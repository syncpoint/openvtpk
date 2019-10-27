'use strict'

const fs = require('fs')
const path = require('path')
/**
 * 
 * @param {String} sourceFolder 
 * @returns {JSON} the content of the root.json file
 */
const root = (sourceFolder) => {
    const rootFileName = path.join(sourceFolder, 'p12', 'root.json')
    const rootFile = fs.readFileSync(rootFileName)
    const root = JSON.parse(rootFile)
    return root
}

module.exports = root