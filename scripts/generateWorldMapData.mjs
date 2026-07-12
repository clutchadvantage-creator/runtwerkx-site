import { readFileSync, writeFileSync } from 'node:fs'
import { geoGraticule, geoNaturalEarth1, geoPath } from 'd3-geo'
import { merge, mesh } from 'topojson-client'

const worldAtlas = JSON.parse(
  readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url), 'utf8')
)

const countriesTopology = worldAtlas.objects.countries
const projection = geoNaturalEarth1().fitExtent(
  [
    [70, 92],
    [930, 548],
  ],
  { type: 'Sphere' }
)

const pathGenerator = geoPath(projection)
const graticuleGeometry = geoGraticule().step([20, 20])()
const landGeometry = merge(worldAtlas, countriesTopology.geometries)
const borderGeometry = mesh(worldAtlas, countriesTopology, (a, b) => a !== b)

const routeCoordinates = [
  [
    [-122.332, 47.606],
    [2.3522, 48.8566],
  ],
  [
    [2.3522, 48.8566],
    [103.8198, 1.3521],
  ],
  [
    [-46.6333, -23.5505],
    [18.4241, -33.9249],
  ],
]

const routeNodeCoordinates = [
  [-122.332, 47.606],
  [2.3522, 48.8566],
  [103.8198, 1.3521],
  [-46.6333, -23.5505],
  [18.4241, -33.9249],
]

const worldRoutePaths = routeCoordinates
  .map((coordinates) => pathGenerator({ type: 'LineString', coordinates }) || '')
  .filter(Boolean)

const worldRouteNodes = routeNodeCoordinates
  .map((coordinates) => projection(coordinates))
  .filter(Boolean)
  .map(([x, y]) => ({ x, y }))

const mapData = {
  spherePath: pathGenerator({ type: 'Sphere' }) || '',
  graticulePath: pathGenerator(graticuleGeometry) || '',
  landPath: pathGenerator(landGeometry) || '',
  borderPath: pathGenerator(borderGeometry) || '',
  worldRoutePaths,
  worldRouteNodes,
}

const output = `export const worldMapData = ${JSON.stringify(mapData, null, 2)}\n`
writeFileSync(new URL('../src/data/worldMapData.js', import.meta.url), output)
console.log('Wrote src/data/worldMapData.js')
