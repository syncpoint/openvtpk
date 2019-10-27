'use strict'

const proj4 = require('proj4')

const xyToLatLng = (x, y) => {
    return proj4('EPSG:3857', 'EPSG:4326').forward(x, y)
}

module.exports = {
    webMercator: {
        xyToLatLng: xyToLatLng
    }
}