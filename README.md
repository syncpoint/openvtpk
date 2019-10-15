# OpenVTPK

ESRI's Vector Tile Package (VTPK) archive contains vector tiles that follow Mapbox' Vector Tile specification v2.0. In addition all resources to render the tiles are include (i.e. stylesheet, fonts, etc.).

Unfortunately none of the open source vector tile servers are able to process VTPK packages. Most require either an MBTiles container or an GeoPackage.

The aim of OpenVTPK is to extract the tiles from a VTPK and to re-package them in a container that is supported by open source tile servers.

In the first run repackaging from VTPK to MBTiles is supported.

## Motivation

Austria's government publishes detailed geospatial data like tiles, elevation data etc. on [data.gv.at](https://www.data.gv.at/?s=basemap.at). One can find vector tiles for the [region of Austria](https://www.data.gv.at/katalog/dataset/a73befc7-575f-48cb-8eb9-b05172a8c9e3) in order to use them offline. The publishing format ist VTPK.

## What to expect

OpenVTPK is a _proof of concept_ to repackage vector tiles into MBTiles container. This software is __not production ready__. Instead it should be treated as a common ground to start discussion about the usage of open date with open (source) software.