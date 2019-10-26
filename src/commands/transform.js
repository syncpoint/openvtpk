'use strict'

const fs = require('fs')
const path = require('path')
const { Command, flags } = require('@oclif/command')
const MBTiles = require('@mapbox/mbtiles')
const Promise = require('bluebird')
const bundle = require('@syncpoint/compact-cache-bundle')

const params = require('../shared/params')
const inspect = require('../shared/inspect')
const content = require('../shared/content')
const levels = require('../shared/levels')

const fsOpen = Promise.promisify(fs.open)
const fsClose = Promise.promisify(fs.close)

const buildMBTilesName = (sourceFolder) => {
    try {
        const rootFileName = path.join(sourceFolder, 'p12', 'root.json')
        const rootFile = fs.readFileSync(rootFileName)
        const root = JSON.parse(rootFile)
        return `${root.name}.mbtiles`
    }
    catch (error) {
        console.error(error)
        return `${Date.now()}.mbtiles`
    }
}

const createMBTileContainer = (filepath, mode = 'rwc') => {
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

const writeBundles = async (tileContainer, level) => {
    const allBundles = content.enumerateBundles(level.folder)
    for (const bundlePath of allBundles) {
        console.log(`processing ${bundlePath}`)
        const bundleOffset = bundle.offset(bundlePath)
        const bundleFileDescriptor = await fsOpen(bundlePath, 'r')
        const tileIndex = await bundle.tileIndex(bundleFileDescriptor)
        for (const index of tileIndex) {
            const tile = await bundle.tiles(bundleFileDescriptor, index)
            const row = bundleOffset.rowOffset + index.row
            const column = bundleOffset.columnOffset + index.column
            await tileContainer.putTileAsync(level.z, column, row, tile)
        }

        await fsClose(bundleFileDescriptor)
    }
}

const writeTiles = async (tileContainer, levels) => {
    for (const level of levels) {
        console.log(`processing level ${level.z}`)
        await writeBundles(tileContainer, level)
    }
}

const readLayerInfo = level => {
    const allBundles = content.enumerateBundles(level.folder)
    for (const bundlePath of allBundles) {

    }
}

const writeMetadata = async (tileContainer, levels) => {
    for (const level of levels) {
        await readLayerInfo(level)
    }
}

const doTransform = async (sourceFolder, inspection) => {
    // restrict the zoom levels to the given boundarys
    const levelsToProcess = inspection.levels.filter(level => (level.z >= inspection.processingLevels.min && level.z <= inspection.processingLevels.max))

    const mbtilesName = buildMBTilesName(sourceFolder)
    console.log(`creating MBTiles container ${mbtilesName}`)
    try {
        const tileContainer = await createMBTileContainer(mbtilesName)
        await tileContainer.startWritingAsync()
        await writeTiles(tileContainer, levelsToProcess)
        await writeMetadata(tileContainer, levelsToProcess)
        await tileContainer.stopWritingAsync()
    }
    catch (error) {
        console.error(error)
    }
}

class TransformCommand extends Command {
    async run() {
        const { args, flags } = this.parse(TransformCommand)
        this.log(`transforming VTPK ${args.sourceFolder} into MBTiles container`)

        const processingLevels = levels(flags.levels)
        const inspection = await inspect(args.sourceFolder)

        if (!inspection.compliance.isCompliant) {
            this.error('The given VTPK source folder does not meet the requirements')
            this.error(inspection.compliance.error)
            this.exit(1)
        }
        const mergedInspection = {
            ...inspection, ...{ processingLevels: processingLevels }
        }

        doTransform(args.sourceFolder, mergedInspection)

    }

}

TransformCommand.args = [
    params.args.sourceFolder
]

TransformCommand.flags = {
    levels: params.flags.levels
}

module.exports = TransformCommand