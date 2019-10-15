'use strict'

const P12_TILE = 'p12/tile'

const fs = require('fs')

const levels = (expandedVTPKFolderPath) => {
    const tileFolderContent = fs.readdirSync(`${expandedVTPKFolderPath}/${P12_TILE}`)
    return tileFolderContent
        .filter(entry => entry.startsWith('L'))
        .map(entry => {
            const z = parseInt(entry.substr(1))
            const descriptor = {
                z: z,
                folder: `${P12_TILE}/${entry}`
            }
            return descriptor
        })
}

const bundles = (levelFolderPath) => {
    const content = fs.readdirSync(levelFolderPath)
    return content.filter(entry => entry.endsWith('bundle'))
}

module.exports = {
    levels: levels,
    bundles: bundles
}