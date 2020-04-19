'use strict'

const matchToInt = param => {
    const val = param.replace('..', '')
    return parseInt(val, 10)
}

/**
 * 
 * @param {*} levelParam The commandline parameter for narrowing the levels
 * @returns {Object} An object with a min and max value 
 */
const parse = (levelParam) => {
    const z = {
        min: 0,
        max: 23
    }
    if (!levelParam) return z
    // 0.., 11..
    const minLevelPattern = /^[0-9]{1,2}(\.\.)/

    // ..2, ..16
    const maxLevelPattern = /(\.\.)[0-9]{1,2}$/

    const min = levelParam.match(minLevelPattern)
    if (min) { z.min = matchToInt(min[0]) }

    const max = levelParam.match(maxLevelPattern)
    if (max) {
        const tempMax = matchToInt(max[0])
        if (tempMax >= z.min) { z.max = tempMax }
    }

    return z
}



module.exports = parse