'use strict'

const checkForCompliance = require('./compliance')
const content = require('./content')

const inspect = async (path) => {
    const compliance =  await checkForCompliance(path)
    if (! compliance.isCompliant) {
      return {
        compliance: compliance,
        levels: []
      }
    }
    return {
        compliance: compliance,
        levels: await content.enumerateLevels(path)
    }
}

module.exports = inspect