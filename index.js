'use strict'

const MBTILES_FILE = 'basemap.at.mbtiles'
const VTPK_FOLDER = '/Users/Thomas/Downloads/bmapv_vtpk_3857'

const MBTiles = require('@mapbox/mbtiles')
const Promise = require('bluebird')

const bundle = require('@syncpoint/compact-cache-bundle')
const fs = require('fs')
const fsOpen = Promise.promisify(fs.open)
const fsClose = Promise.promisify(fs.close)
const gunzip = Promise.promisify(require('zlib').gunzip)
const Pbf = require('pbf')
const VectorTile = require('@mapbox/vector-tile').VectorTile

let allLayers = new Set()

const openMBTiles = (filepath, mode = 'rwc') => {
    return new Promise((resolve, reject) => {
        new MBTiles(`${filepath}?mode=${mode}`, (error, mbTilesWrapper) => {
            if (error) {
                return reject(error)
            }
            const mbTilesWrapperAsync = Promise.promisifyAll(mbTilesWrapper)
            return resolve(mbTilesWrapperAsync)
        }
        )
    })
}

const exploreLayers = async (tileBuffer) => {
    const uncompressedTile = await gunzip(tileBuffer)
    const protoBuffer = new Pbf(uncompressedTile)
    const tile = new VectorTile(protoBuffer)
    const layers = Object.keys(tile.layers)
    return layers
}

const toVectorLayers = (setOfLayers) => {
    const vectorLayers = []

    for (let layer of setOfLayers) {
        vectorLayers.push({
            id: layer,
            fields: {}
        })
    }
    return vectorLayers
}

const getTilesetInfo = (distinctLayers) => {
    const info = {
        "name": "basemap.at",
        "description": "the world in vector tiles",
        "format": "pbf",
        "version": 2,
        "minzoom": 0,
        "maxzoom": 16,
        "center": "13.344755,47.69627,6",
        "bounds": "9.52678,46.36851,17.16273,49.02403",
        "type": "overlay",
        "json": `{"vector_layers":  ${JSON.stringify(toVectorLayers(distinctLayers))}}`
    }
    return info
}

const tileFolder = require('./tileFolder')

    ; (async () => {
        try {
            const mbTiles = await openMBTiles(MBTILES_FILE)

            console.log(`created/opened ${MBTILES_FILE}`)
            await mbTiles.startWritingAsync()
            console.log(`ready to write data ...`)
            const levels = tileFolder.levels(VTPK_FOLDER)

            for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
                const level = levels[levelIndex]
                const bundleFiles = tileFolder.bundles(`${VTPK_FOLDER}/${level.folder}`)
                for (let bundleIndex = 0; bundleIndex < bundleFiles.length; bundleIndex++) {
                    const fqfn = `${VTPK_FOLDER}/${level.folder}/${bundleFiles[bundleIndex]}`
                    const bundleOffset = bundle.offset(fqfn)
                    console.log(`processing ${fqfn}`)
                    const fd = await fsOpen(fqfn, 'r')
                    const records = await bundle.tileIndex(fd)
                    for (let r = 0; r < records.length; r++) {
                        const tile = await bundle.tiles(fd, records[r])
                        if (r === 0) {
                            // explore the first tile and read all layer information
                            const layers = await exploreLayers(tile)
                            allLayers = new Set([...allLayers, ...layers])
                        }
                        const row = bundleOffset.rowOffset + records[r].row
                        const column = bundleOffset.columnOffset + records[r].column
                        await mbTiles.putTileAsync(level.z, column, row, tile)
                    }
                    await fsClose(fd)
                }
            }

            await mbTiles.putInfoAsync(getTilesetInfo(allLayers))
            await mbTiles.stopWritingAsync()
            console.log(`finished writing data ...`)
        }
        catch (error) {
            console.error(error)
        }
    })()
