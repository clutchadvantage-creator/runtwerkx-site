import { writeFileSync } from 'node:fs'
import { worldMapData } from '../src/data/worldMapData.js'

const compactPath = (value) =>
  value.replace(/-?\d+\.\d+/g, (match) => {
    const rounded = Number(match).toFixed(1)
    return rounded.endsWith('.0') ? rounded.slice(0, -2) : rounded
  })

const optimized = {
  spherePath: compactPath(worldMapData.spherePath),
  graticulePath: compactPath(worldMapData.graticulePath),
  landPath: compactPath(worldMapData.landPath),
  worldRoutePaths: worldMapData.worldRoutePaths.map(compactPath),
  worldRouteNodes: worldMapData.worldRouteNodes.map(({ x, y }) => ({
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
  })),
}

const output = `export const worldMapData = ${JSON.stringify(optimized, null, 2)}\n`
writeFileSync(new URL('../src/data/worldMapData.js', import.meta.url), output)
console.log('Optimized src/data/worldMapData.js')
