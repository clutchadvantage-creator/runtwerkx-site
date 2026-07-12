import { worldMapData } from '../../data/worldMapData'

export default function ContactWorldMap({ prefersReducedMotion = false }) {
  return (
    <svg
      className={`fresh-world-map ${prefersReducedMotion ? 'is-reduced-motion' : ''}`}
      viewBox="0 0 1000 640"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="freshMapInk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(91,255,122,0.16)" />
          <stop offset="50%" stopColor="rgba(91,255,122,0.4)" />
          <stop offset="100%" stopColor="rgba(91,255,122,0.14)" />
        </linearGradient>
        <linearGradient id="freshMapRoute" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(91,255,122,0)" />
          <stop offset="50%" stopColor="rgba(91,255,122,0.72)" />
          <stop offset="100%" stopColor="rgba(91,255,122,0)" />
        </linearGradient>
        <filter id="freshMapSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="mapBlur" />
          <feMerge>
            <feMergeNode in="mapBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path className="fresh-world-sphere" d={worldMapData.spherePath} />
      <path className="fresh-world-graticule" d={worldMapData.graticulePath} />
      <path className="fresh-world-land" d={worldMapData.landPath} pathLength={1} filter="url(#freshMapSoftGlow)" />

      <g className="fresh-world-routes" filter="url(#freshMapSoftGlow)">
        {worldMapData.worldRoutePaths.map((routePath, index) => (
          <path key={`world-route-${index}`} className="fresh-world-route" d={routePath} />
        ))}
      </g>

      <g className="fresh-world-nodes" filter="url(#freshMapSoftGlow)">
        {worldMapData.worldRouteNodes.map((node, index) => (
          <circle key={`world-node-${index}`} cx={node.x} cy={node.y} r={index === 0 ? 3.3 : 2.8} />
        ))}
      </g>

      {!prefersReducedMotion ? (
        <g className="fresh-world-travel" filter="url(#freshMapSoftGlow)">
          {worldMapData.worldRoutePaths.slice(0, 2).map((routePath, index) => (
            <circle key={`world-travel-${index}`} className="fresh-world-pulse" r={index === 0 ? 2.4 : 2.2}>
              <animateMotion dur={index === 0 ? '7.5s' : '8.3s'} repeatCount="indefinite" path={routePath} />
            </circle>
          ))}
        </g>
      ) : null}
    </svg>
  )
}
