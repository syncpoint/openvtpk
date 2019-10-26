'use strict'

/* checks if the given folder is an expanded VTPK package */

const fs = require('fs')
const path = require('path')

const FOLDERS = [
    {
        path: path.join('p12', 'tile'),
        name: 'tile'
    }
]

const directoryExists = path => {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
}

const isCompliant = async (rootPath) => {

    if (!directoryExists(rootPath)) {
        return {
            folders: [{
                exists: false,
                error: 'path does not exist or is not a directory',
                folder: rootPath,
                name: 'root'
            }],
            isCompliant: false
        }
    }

    const folders = FOLDERS.map(async folder => {
        const currentFolder = path.join(rootPath, folder.path)
        if (directoryExists(currentFolder)) {
            return { ...folder, ...{ exists: true } }
        }
        else {
            return { ...folder, ...{ exists: false, error: 'path does not exist or is not a directory' } }
        }
    })
    const folderInfo = await Promise.all(folders)
    return {
        folders: folderInfo,
        isCompliant: (folderInfo.findIndex(folder => folder.exists === false) === -1)
    }
}

module.exports = isCompliant