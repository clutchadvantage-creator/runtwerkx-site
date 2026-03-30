import { useState } from 'react'

export default function ContactSignalLock() {
  const [active, setActive] = useState('consult')
  const [locking, setLocking] = useState(null)

  const performAction = (id) => {
    if (id === 'call') {
      window.location.href = 'tel:+14179887395'
      return
    }

    if (id === 'email') {
      window.location.href =
        'mailto:runtwerkx.dev@gmail.com?subject=RuntWerkx%20Inquiry&body=Hello%20RuntWerkx,%0D%0A%0D%0AI%20would%20like%20to%20ask%20about...'
      return
    }

    const title = encodeURIComponent('RuntWerkx Online Consult')
    const details = encodeURIComponent(
      'Requested meeting with RuntWerkx Systems.\n\nPlease email runtwerkx.dev@gmail.com to confirm availability after selecting your preferred date and time.'
    )
    const location = encodeURIComponent('Online')
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`

    window.open(calendarUrl, '_blank', 'noopener,noreferrer')
  }

  const triggerAction = (id) => {
    setLocking(id)
    setActive(id)
    window.setTimeout(() => {
      performAction(id)
      setLocking(null)
    }, 260)
  }

  const actions = [
    {
      id: 'consult',
      short: 'Consult',
      label: 'Schedule An Online Consult',
      hint: 'Open scheduling route',
      className: 'left-1/2 top-[7%] -translate-x-1/2',
      labelClass: 'bottom-[calc(100%+14px)]',
    },
    {
      id: 'email',
      short: 'Email',
      label: 'Send Questions By Email',
      hint: 'Compose direct message',
      className: 'left-[8%] top-[61%]',
      labelClass: 'top-[calc(100%+16px)]',
    },
    {
      id: 'call',
      short: 'Call',
      label: 'Call (417) 988-7395',
      hint: 'Open direct phone link',
      className: 'right-[8%] top-[61%]',
      labelClass: 'top-[calc(100%+16px)]',
    },
  ]

  const activeMap = {
    consult: { top: true, left: false, right: false },
    email: { top: false, left: true, right: false },
    call: { top: false, left: false, right: true },
  }

  return (
    <>
      <div className="relative mx-auto min-h-[560px] max-w-5xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.16)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_20%_70%,rgba(34,197,94,0.06),transparent_20%),radial-gradient(circle_at_80%_70%,rgba(34,197,94,0.06),transparent_20%)]" />

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="signal-particle absolute h-1 w-1 rounded-full bg-green-300/50"
              style={{
                left: `${10 + ((i * 13) % 80)}%`,
                top: `${18 + ((i * 17) % 60)}%`,
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 1000 560"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="signalRouteBase" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.04)" />
              <stop offset="50%" stopColor="rgba(74,222,128,0.26)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.04)" />
            </linearGradient>

            <linearGradient id="signalRouteActive" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0)" />
              <stop offset="50%" stopColor="rgba(74,222,128,0.95)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </linearGradient>

            <radialGradient id="signalPulseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(134,239,172,0.98)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </radialGradient>
          </defs>

          {/* base routes always visible */}
          <path
            d="M500 280 C500 220, 500 150, 500 95"
            stroke="url(#signalRouteBase)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M500 280 C400 315, 260 350, 140 400"
            stroke="url(#signalRouteBase)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M500 280 C600 315, 740 350, 860 400"
            stroke="url(#signalRouteBase)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* active routes */}
          <path
            d="M500 280 C500 220, 500 150, 500 95"
            className={`transition-all duration-300 ${activeMap[active].top ? 'opacity-100' : 'opacity-20'}`}
            stroke="url(#signalRouteActive)"
            strokeWidth={activeMap[active].top ? '3.2' : '1.2'}
            strokeLinecap="round"
          />
          <path
            d="M500 280 C400 315, 260 350, 140 400"
            className={`transition-all duration-300 ${activeMap[active].left ? 'opacity-100' : 'opacity-20'}`}
            stroke="url(#signalRouteActive)"
            strokeWidth={activeMap[active].left ? '3.2' : '1.2'}
            strokeLinecap="round"
          />
          <path
            d="M500 280 C600 315, 740 350, 860 400"
            className={`transition-all duration-300 ${activeMap[active].right ? 'opacity-100' : 'opacity-20'}`}
            stroke="url(#signalRouteActive)"
            strokeWidth={activeMap[active].right ? '3.2' : '1.2'}
            strokeLinecap="round"
          />

          {/* active route pulses */}
          {activeMap[active].top && (
            <circle r="8" fill="url(#signalPulseGlow)">
              <animateMotion dur="1.9s" repeatCount="indefinite" path="M500 280 C500 220, 500 150, 500 95" />
            </circle>
          )}

          {activeMap[active].left && (
            <circle r="8" fill="url(#signalPulseGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M500 280 C400 315, 260 350, 140 400" />
            </circle>
          )}

          {activeMap[active].right && (
            <circle r="8" fill="url(#signalPulseGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M500 280 C600 315, 740 350, 860 400" />
            </circle>
          )}

          {/* subtle idle pulses */}
          <circle r="4" fill="url(#signalPulseGlow)" opacity="0.5">
            <animateMotion dur="5.5s" repeatCount="indefinite" path="M500 280 C500 220, 500 150, 500 95" />
          </circle>
          <circle r="4" fill="url(#signalPulseGlow)" opacity="0.35">
            <animateMotion dur="6.4s" repeatCount="indefinite" path="M500 280 C400 315, 260 350, 140 400" />
          </circle>
          <circle r="4" fill="url(#signalPulseGlow)" opacity="0.35">
            <animateMotion dur="6.4s" repeatCount="indefinite" path="M500 280 C600 315, 740 350, 860 400" />
          </circle>

          <circle cx="500" cy="280" r="7" fill="#4ade80" opacity="0.9" />
          <circle cx="500" cy="95" r="5" fill="#86efac" opacity={activeMap[active].top ? '1' : '0.35'} />
          <circle cx="140" cy="400" r="5" fill="#86efac" opacity={activeMap[active].left ? '1' : '0.35'} />
          <circle cx="860" cy="400" r="5" fill="#86efac" opacity={activeMap[active].right ? '1' : '0.35'} />
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/6 blur-[120px]" />

        <div className="absolute left-1/2 top-[50%] h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 md:h-[190px] md:w-[190px]">
          <div className={`signal-core ${locking ? 'signal-core-lock' : ''}`}>
            <div className="signal-core-ring signal-core-ring-a" />
            <div className="signal-core-ring signal-core-ring-b" />
            <div className="signal-core-ring signal-core-ring-c" />
            <div className="signal-core-inner">
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-green-400">
                  RuntWerkx
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.26em] text-white/45">
                  {locking ? 'Initiating' : 'Direct Access'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {actions.map((item) => {
          const isActive = active === item.id
          const isLocking = locking === item.id

          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setActive(item.id)}
              onFocus={() => setActive(item.id)}
              onClick={() => triggerAction(item.id)}
              className={`group absolute h-[108px] w-[108px] md:h-[124px] md:w-[124px] ${item.className}`}
              aria-label={item.label}
            >
              <span
                className={`signal-node-glow absolute inset-[-24px] rounded-full ${
                  isActive ? 'signal-node-glow-active' : ''
                }`}
              />
              <span
                className={`signal-node absolute inset-0 ${
                  isActive ? 'signal-node-active' : ''
                } ${isLocking ? 'signal-node-lock' : ''}`}
              />
              <span className="signal-node-inner absolute inset-[14px] flex items-center justify-center rounded-full md:inset-[16px]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-300 md:text-xs">
                  {item.short}
                </span>
              </span>

              <span
                className={`pointer-events-none absolute left-1/2 w-[250px] -translate-x-1/2 text-center ${item.labelClass}`}
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">
                  {isActive ? 'Route Selected' : 'Route Option'}
                </span>
                <span className="mt-1 block text-sm font-semibold text-white">{item.label}</span>
                <span className="mt-1 block text-xs text-white/50">{item.hint}</span>
              </span>
            </button>
          )
        })}
      </div>

      <style>{`
        .signal-particle {
          animation-name: signalFloat;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .signal-core {
          position: relative;
          height: 100%;
          width: 100%;
          border-radius: 9999px;
          background:
            radial-gradient(circle at 50% 50%, rgba(74,222,128,0.10), rgba(0,0,0,0) 62%);
          transition: transform 220ms ease, filter 220ms ease;
        }

        .signal-core-lock {
          transform: scale(1.06);
          filter: drop-shadow(0 0 24px rgba(74,222,128,0.22));
        }

        .signal-core-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(74,222,128,0.14);
        }

        .signal-core-ring-a {
          animation: signalPulseA 4.2s ease-in-out infinite;
        }

        .signal-core-ring-b {
          inset: 10%;
          border-color: rgba(74,222,128,0.16);
          animation: signalPulseB 3.6s ease-in-out infinite;
        }

        .signal-core-ring-c {
          inset: 21%;
          border-color: rgba(134,239,172,0.18);
          animation: signalPulseC 3s ease-in-out infinite;
        }

        .signal-core-inner {
          position: absolute;
          inset: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1px solid rgba(74,222,128,0.18);
          background:
            radial-gradient(circle at 50% 50%, rgba(34,197,94,0.18), rgba(0,0,0,0.90) 74%);
          box-shadow:
            inset 0 0 20px rgba(74,222,128,0.12),
            0 0 30px rgba(34,197,94,0.10);
          backdrop-filter: blur(6px);
        }

        .signal-node-glow {
          background:
            radial-gradient(circle at 50% 50%, rgba(74,222,128,0.00), rgba(74,222,128,0.00) 52%, rgba(74,222,128,0.10) 70%, rgba(74,222,128,0.00) 100%);
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 220ms ease, transform 220ms ease;
          filter: blur(8px);
        }

        .group:hover .signal-node-glow,
        .group:focus-within .signal-node-glow {
          opacity: 0.9;
          transform: scale(1.04);
        }

        .signal-node-glow-active {
          opacity: 1;
          transform: scale(1.08);
          filter: blur(12px);
        }

        .signal-node {
          height: 100%;
          width: 100%;
          border-radius: 9999px;
          border: 1px solid rgba(74,222,128,0.16);
          background:
            radial-gradient(circle at 50% 50%, rgba(34,197,94,0.14), rgba(0,0,0,0.90) 72%);
          box-shadow:
            inset 0 0 18px rgba(74,222,128,0.08),
            0 0 18px rgba(34,197,94,0.08);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, opacity 220ms ease;
        }

        .signal-node-active {
          transform: scale(1.08);
          border-color: rgba(134,239,172,0.34);
          box-shadow:
            inset 0 0 22px rgba(74,222,128,0.16),
            0 0 30px rgba(34,197,94,0.18);
        }

        .signal-node-lock {
          animation: signalLockFlash 300ms ease;
        }

        .signal-node-inner {
          border: 1px solid rgba(74,222,128,0.18);
          background:
            radial-gradient(circle at 50% 50%, rgba(74,222,128,0.18), rgba(0,0,0,0) 70%);
          box-shadow: inset 0 0 18px rgba(74,222,128,0.10);
        }

        @keyframes signalFloat {
          0% {
            transform: translateY(0px);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-16px);
            opacity: 0.45;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.08;
          }
        }

        @keyframes signalPulseA {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.30;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.65;
          }
        }

        @keyframes signalPulseB {
          0%, 100% {
            transform: scale(0.98);
            opacity: 0.28;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.55;
          }
        }

        @keyframes signalPulseC {
          0%, 100% {
            transform: scale(0.99);
            opacity: 0.28;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.60;
          }
        }

        @keyframes signalLockFlash {
          0% {
            box-shadow:
              inset 0 0 18px rgba(74,222,128,0.08),
              0 0 18px rgba(34,197,94,0.08);
          }
          50% {
            box-shadow:
              inset 0 0 26px rgba(134,239,172,0.22),
              0 0 38px rgba(74,222,128,0.26);
          }
          100% {
            box-shadow:
              inset 0 0 18px rgba(74,222,128,0.08),
              0 0 18px rgba(34,197,94,0.08);
          }
        }
      `}</style>
    </>
  )
}