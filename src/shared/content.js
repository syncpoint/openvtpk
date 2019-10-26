'use strict'

const fs = require('fs')
const path = require('path')

const TILE_FOLDER = path.join('p12', 'tile')

const enumerateLevels = rootPath => {
    const tileFolderContent = fs.readdirSync(path.join(rootPath, TILE_FOLDER))
    return tileFolderContent
        .filter(entry => entry.startsWith('L'))
        .map(entry => {
            const z = parseInt(entry.substr(1))
            const descriptor = {
                z: z,
                folder: path.join(rootPath, TILE_FOLDER, entry)
            }
            return descriptor
        })
}

const enumerateBundles = (levelFolderPath) => {
    const content = fs.readdirSync(levelFolderPath)
    return content.filter(entry => entry.endsWith('bundle')).map(entry => path.join(levelFolderPath, entry))
}

module.exports = {
    enumerateLevels: enumerateLevels,
    enumerateBundles: enumerateBundles
}