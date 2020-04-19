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

    const levels = await content.enumerateLevels(path)
    const zNumbers = levels.map(level => level.z)
    const z = {
      min: Math.min(...zNumbers),
      max: Math.max(...zNumbers)
    }

    return {
        compliance: compliance,
        levels: levels,
        z
    }
}

module.exports = inspect