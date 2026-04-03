import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { capabilityCards, preorderLinks } from '../../data/homeContent'
import { openExternalOrLog } from '../../utils/homeUtils'

function OperationalImpactField() {
  const impactPoints = [
    {
      title: 'Faster Response',
      text: 'Reduce lag between issue discovery, communication, and action.',
      top: '10%',
      left: '10%',
    },
    {
      title: 'Better Visibility',
      text: 'Give teams cleaner access to the information that matters.',
      top: '22%',
      left: '58%',
    },
    {
      title: 'Less Friction',
      text: 'Cut wasted steps, duplicate entry, and disconnected handoffs.',
      top: '46%',
      left: '22%',
    },
    {
      title: 'Stronger Accountability',
      text: 'Track ownership, follow-up, and closure with more confidence.',
      top: '62%',
      left: '64%',
    },
    {
      title: 'Operational Clarity',
      text: 'Build systems that help people move with less uncertainty.',
      top: '72%',
      left: '24%',
    },
  ]

  const streamLabels = [
    'Systems',
    'Workflow',
    'Visibility',
    'Actions',
    'Safety',
    'Data',
  ]

  return (
    <div className="relative min-h-[900px] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.10)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="absolute left-[7%] top-[9%] h-44 w-44 rounded-full bg-green-500/10 blur-[90px]" />
      <div className="absolute right-[8%] top-[22%] h-52 w-52 rounded-full bg-green-400/10 blur-[110px]" />
      <div className="absolute bottom-[10%] left-[26%] h-56 w-56 rounded-full bg-green-500/8 blur-[120px]" />
      <div className="absolute bottom-[12%] right-[10%] h-44 w-44 rounded-full bg-white/5 blur-[90px]" />

      <svg
        viewBox="0 0 700 900"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="impactStreamA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,197,94,0.00)" />
            <stop offset="45%" stopColor="rgba(74,222,128,0.55)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.00)" />
          </linearGradient>

          <linearGradient id="impactStreamB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34,197,94,0.00)" />
            <stop offset="50%" stopColor="rgba(187,247,208,0.42)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.00)" />
          </linearGradient>

          <radialGradient id="impactPulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(134,239,172,0.85)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
        </defs>

        <path
          d="M60 150 C150 100, 240 110, 315 170 C390 230, 470 255, 640 225"
          stroke="rgba(34,197,94,0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M90 315 C180 285, 250 315, 340 395 C430 475, 530 520, 640 505"
          stroke="rgba(34,197,94,0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M70 640 C160 610, 255 630, 355 710 C450 785, 530 800, 640 760"
          stroke="rgba(34,197,94,0.12)"
          strokeWidth="1.5"
        />

        <path
          d="M60 150 C150 100, 240 110, 315 170 C390 230, 470 255, 640 225"
          stroke="url(#impactStreamA)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="900"
          strokeDashoffset="900"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="900"
            to="-900"
            dur="7s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M90 315 C180 285, 250 315, 340 395 C430 475, 530 520, 640 505"
          stroke="url(#impactStreamB)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="800"
          strokeDashoffset="800"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="800"
            to="-800"
            dur="7.8s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M70 640 C160 610, 255 630, 355 710 C450 785, 530 800, 640 760"
          stroke="url(#impactStreamA)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="850"
          strokeDashoffset="850"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="850"
            to="-850"
            dur="8.4s"
            begin="1s"
            repeatCount="indefinite"
          />
        </path>

        <circle cx="120" cy="128" r="5" fill="#4ade80" opacity="0.55" />
        <circle cx="404" cy="224" r="5" fill="#4ade80" opacity="0.55" />
        <circle cx="612" cy="228" r="5" fill="#86efac" opacity="0.55" />
        <circle cx="150" cy="302" r="5" fill="#4ade80" opacity="0.5" />
        <circle cx="370" cy="420" r="5" fill="#4ade80" opacity="0.55" />
        <circle cx="610" cy="505" r="5" fill="#bbf7d0" opacity="0.5" />
        <circle cx="130" cy="626" r="5" fill="#4ade80" opacity="0.5" />
        <circle cx="390" cy="732" r="5" fill="#4ade80" opacity="0.55" />
        <circle cx="620" cy="760" r="5" fill="#bbf7d0" opacity="0.55" />

        <circle r="9" fill="url(#impactPulseGlow)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M60 150 C150 100, 240 110, 315 170 C390 230, 470 255, 640 225"
          />
        </circle>

        <circle r="8" fill="url(#impactPulseGlow)">
          <animateMotion
            dur="7.8s"
            begin="0.6s"
            repeatCount="indefinite"
            path="M90 315 C180 285, 250 315, 340 395 C430 475, 530 520, 640 505"
          />
        </circle>

        <circle r="9" fill="url(#impactPulseGlow)">
          <animateMotion
            dur="8.4s"
            begin="1s"
            repeatCount="indefinite"
            path="M70 640 C160 610, 255 630, 355 710 C450 785, 530 800, 640 760"
          />
        </circle>
      </svg>

      <div className="relative z-10 px-2 py-2">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Operational Momentum ―
          </div>

          <h3 className="mt-3 text-3xl font-bold leading-tight text-white">
            Better systems create momentum you can actually feel
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
            Good software should not just collect information. It should help people move
            faster, communicate more clearly, and work with less wasted effort across the
            operation.
          </p>
        </div>

        <div className="relative mt-12 min-h-[700px]">
          {impactPoints.map((point, index) => (
            <div
              key={point.title}
              className="absolute max-w-[250px]"
              style={{ top: point.top, left: point.left }}
            >
              <div
                className="absolute -left-6 top-2 h-3 w-3 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.55)]"
                style={{
                  animation: `impactBlink 2.4s ease-in-out ${index * 0.3}s infinite`,
                }}
              />

              <div className="pl-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-300">
                  {point.title}
                </div>
                <div className="mt-2 text-sm leading-7 text-white/62">
                  {point.text}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-[6%] left-[6%] right-[6%]">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {streamLabels.map((label, index) => (
                <div
                  key={label}
                  className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/32"
                  style={{
                    animation: `tagFloat 4.6s ease-in-out ${index * 0.25}s infinite`,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ModernSystemsSection() {
  const [activeCapability, setActiveCapability] = useState(-1)
  const navigate = useNavigate()

  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
                ― RuntWerkx Delivers ―
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
                Confidence & Clarity For Your Operations
              </h2>

              <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">
                The modern world runs on software, systems, applications, databases, and connected tools
                that shape how we work every day. RuntWerkx Systems is focused on improving those experiences
                by creating smarter, easier-to-implement solutions that are built around real needs — not
                unnecessary complexity.
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Whether it is an internal utility, a workflow platform, an operations dashboard, a safety
                system, or a custom-built industrial application, the idea is the same: create tools that
                save time, reduce wasted effort, improve visibility, and help people work with more
                confidence.
              </p>
            </div>

            <div className="relative mt-10 h-[220px] overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.10)_1px,transparent_1px)] bg-[size:26px_26px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.07),transparent_24%),radial-gradient(circle_at_85%_30%,rgba(34,197,94,0.05),transparent_18%)]" />

              <svg
                viewBox="0 0 900 220"
                className="absolute inset-0 h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="deliverCircuitGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(34,197,94,0.00)" />
                    <stop offset="50%" stopColor="rgba(74,222,128,0.95)" />
                    <stop offset="100%" stopColor="rgba(34,197,94,0.00)" />
                  </linearGradient>

                  <radialGradient id="deliverPulseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(134,239,172,0.95)" />
                    <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                  </radialGradient>
                </defs>

                <path d="M40 110 H180 L230 70 H380 L430 110 H860" stroke="rgba(34,197,94,0.10)" strokeWidth="2" />
                <path d="M180 110 V170 H300" stroke="rgba(34,197,94,0.10)" strokeWidth="2" />
                <path d="M380 70 V35 H520" stroke="rgba(34,197,94,0.10)" strokeWidth="2" />
                <path d="M540 110 V165 H700" stroke="rgba(34,197,94,0.10)" strokeWidth="2" />

                <path
                  d="M40 110 H180 L230 70 H380 L430 110 H860"
                  stroke="url(#deliverCircuitGlow)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0 1000;260 740;0 1000"
                    dur="4.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-320;-860"
                    dur="4.6s"
                    repeatCount="indefinite"
                  />
                </path>

                <path
                  d="M180 110 V170 H300"
                  stroke="url(#deliverCircuitGlow)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0 400;90 310;0 400"
                    dur="4.6s"
                    begin="0.35s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-120;-300"
                    dur="4.6s"
                    begin="0.35s"
                    repeatCount="indefinite"
                  />
                </path>

                <path
                  d="M380 70 V35 H520"
                  stroke="url(#deliverCircuitGlow)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0 300;80 220;0 300"
                    dur="4.6s"
                    begin="0.65s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-90;-220"
                    dur="4.6s"
                    begin="0.65s"
                    repeatCount="indefinite"
                  />
                </path>

                <path
                  d="M540 110 V165 H700"
                  stroke="url(#deliverCircuitGlow)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0 340;95 245;0 340"
                    dur="4.6s"
                    begin="1s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-100;-260"
                    dur="4.6s"
                    begin="1s"
                    repeatCount="indefinite"
                  />
                </path>

                <circle cx="180" cy="110" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="380" cy="70" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="540" cy="110" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="300" cy="170" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="520" cy="35" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="700" cy="165" r="4" fill="#4ade80" opacity="0.55" />

                <circle r="7" fill="url(#deliverPulseGlow)">
                  <animateMotion
                    dur="4.6s"
                    repeatCount="indefinite"
                    path="M40 110 H180 L230 70 H380 L430 110 H860"
                  />
                </circle>
              </svg>

              <div className="relative z-10 flex h-full flex-col justify-between py-2">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-green-400">
                    ― Systems That Communicate ―
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">
                    No More Broken Links Between Tools
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
                      Event
                    </div>
                    <div className="mt-2 text-sm text-white/55">Action Trigger</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
                      System Logic Updates Modules
                    </div>
                    <div className="mt-2 text-sm text-white/55">System Updates Across The Board</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
                      Real Time Data
                    </div>
                    <div className="mt-2 text-sm text-white/55">Information with real purpose.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {capabilityCards.map((card, index) => {
              const isOpen = activeCapability === index

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => setActiveCapability(isOpen ? -1 : index)}
                  className={`group relative min-h-[520px] overflow-hidden rounded-[2rem] border text-center transition-all duration-500 ${
                    isOpen
                      ? 'col-span-2 border-green-400/70 bg-black/75 shadow-[0_0_35px_rgba(34,197,94,0.14)]'
                      : 'col-span-1 border-white/10 bg-black/50 hover:border-green-400/35 hover:bg-black/60'
                  }`}
                >
                  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-green-300 transition group-hover:border-green-400/40">
                    {isOpen ? '−' : '+'}
                  </div>

                  <div className="relative flex h-full min-h-[520px] flex-col items-center p-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                        {card.kicker}
                      </div>

                      <h3
                        className={`mt-4 font-bold leading-tight text-white transition-all duration-500 ${
                          isOpen ? 'text-3xl' : 'text-[2rem]'
                        }`}
                      >
                        {card.title}
                      </h3>
                    </div>

                    <div
                      className={`relative mt-6 -mx-2 overflow-hidden transition-all duration-500 ${
                        isOpen ? 'h-[300px]' : 'h-[170px]'
                      }`}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full rounded-[1.45rem] object-cover object-center transition duration-500"
                      />

                      <div className="absolute inset-0 rounded-[1.45rem] bg-gradient-to-t from-black/50 via-black/10 to-green-500/10" />
                      <div className="absolute inset-0 rounded-[1.45rem] opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:22px_22px]" />
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? 'mt-6 max-h-[320px] opacity-100' : 'mt-0 max-h-0 opacity-0'
                      }`}
                    >
                      <div className="mx-auto max-w-xl">
                        <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
                        <p className="mx-auto max-w-md text-base leading-8 text-white/72">{card.text}</p>
                      </div>
                    </div>

                    {!isOpen && (
                      <div className="relative mt-auto w-full pt-6 text-center">
                        <div className="h-px w-full bg-gradient-to-r from-green-500/0 via-green-400/30 to-green-500/0" />
                        <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                          Click to Expand
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-6">
            <div className="group relative overflow-hidden rounded-[1.75rem] border border-green-500/15 bg-black/50 p-5 shadow-[0_0_35px_rgba(34,197,94,0.08)]">
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:26px_26px]" />
              <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-green-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-green-400/10 blur-[90px]" />

              <div className="relative">
                <div className="mb-4 flex flex-col items-center justify-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
                  <div className="text-center md:text-left">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                      ― AegisOne ―
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">
                      RuntWerkx Systems Premire Safety Management Platform
                    </div>
                  </div>

                  <div className="rounded-full border border-green-400/20 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-green-300">
                    Currently In Development
                  </div>
                </div>

                <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                  <img
                    src="/images/AegisOne4.png"
                    alt="Industrial digital systems visual"
                    className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-[0.92] transition duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1"
                  />

                  <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/15 to-green-500/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.06),transparent_20%)] opacity-80 transition duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <button
                    type="button"
                    onClick={() => openExternalOrLog(preorderLinks.aegisone)}
                    className="absolute left-1/2 top-48 -translate-x-1/2 rounded-full border border-green-400/30 bg-black/55 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-green-300 backdrop-blur transition hover:scale-[1.05] hover:border-green-300 hover:text-green-200"
                  >
                    SIGN UP FOR PRE-ORDERS HERE
                  </button>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                    <div className="mx-auto max-w-lg">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-300">
                        Safety Intelligence
                      </div>
                      <div className="mt-2 text-2xl font-bold text-white">
                        Smart Safety Management
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.75rem] border border-green-500/15 bg-black/50 p-5 shadow-[0_0_35px_rgba(34,197,94,0.08)]">
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:26px_26px]" />
              <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-green-500/14 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/5 blur-[80px]" />

              <div className="relative">
                <div className="mb-4 flex flex-col items-center justify-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
                  <div className="text-center md:text-left">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                      ― Knowledge Center ―
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">
                      RuntWerkx Digital Library
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/knowledge-library')}
                    className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-center text-[15px] font-semibold uppercase tracking-[0.22em] text-white/60 transition hover:border-green-400/30 hover:text-green-300"
                  >
                    GO TO LIBRARY (Click Here)
                  </button>
                </div>

                <div className="relative h-[260px] overflow-hidden rounded-[1.5rem] bg-black">
                  <video
                    src="/images/rwlibrarygreenglow2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          <OperationalImpactField />
        </div>
      </div>

      <style>{`
        @keyframes impactBlink {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes tagFloat {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0px);
          }
          50% {
            opacity: 0.72;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  )
}