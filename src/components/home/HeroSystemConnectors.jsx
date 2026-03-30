export default function HeroSystemConnectors() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 600 900"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="connectorLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(34,197,94,0)" />
          <stop offset="50%" stopColor="rgba(74,222,128,0.7)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </linearGradient>

        <radialGradient id="connectorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(134,239,172,0.95)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </radialGradient>
      </defs>

      <path d="M300 205 C300 255, 300 265, 300 315" stroke="url(#connectorLine)" strokeWidth="2" />
      <path d="M300 435 C300 480, 300 495, 300 545" stroke="url(#connectorLine)" strokeWidth="2" />
      <path d="M300 665 C300 710, 300 725, 300 780" stroke="url(#connectorLine)" strokeWidth="2" />

      <path
        d="M300 205 C235 245, 215 285, 215 330"
        stroke="url(#connectorLine)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M300 205 C365 245, 385 285, 385 330"
        stroke="url(#connectorLine)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      <circle cx="300" cy="315" r="8" fill="url(#connectorGlow)" />
      <circle cx="300" cy="545" r="8" fill="url(#connectorGlow)" />
      <circle cx="300" cy="780" r="8" fill="url(#connectorGlow)" />

      <circle cx="215" cy="330" r="5" fill="#4ade80" opacity="0.9" />
      <circle cx="385" cy="330" r="5" fill="#4ade80" opacity="0.9" />

      <circle cx="300" cy="315" r="3" fill="#86efac">
        <animate attributeName="cy" values="315;545;780;315" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}