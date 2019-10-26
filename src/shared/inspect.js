'use strict'

const checkForCompliance = require('./compliance')
const content = require('./content')

const inspect = async (path) => {
    return {
        compliance: await checkForCompliance(path),
        levels: await content.enumerateLevels(path)
    }
}

module.exports = inspect