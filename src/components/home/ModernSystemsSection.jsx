import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { capabilityCards, metrics, preorderLinks } from '../../data/homeContent'
import { openExternalOrLog } from '../../utils/homeUtils'

export default function ModernSystemsSection() {
  const [activeCapability, setActiveCapability] = useState(-1)
  const navigate = useNavigate()

  return (
    <section className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
              ⇼ RuntWerkx Delivers ⇼
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              Confidence & Clarity For Your Operations
            </h2>

            <div className="mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
              The modern world runs on software, systems, applications, databases, and connected tools
              that shape how we work every day. RuntWerkx Systems is focused on improving those experiences
              by creating smarter, easier-to-implement solutions that are built around real needs — not
              unnecessary complexity.
            </p>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
              Whether it is an internal utility, a workflow platform, an operations dashboard, a safety
              system, or a custom-built industrial application, the idea is the same: create tools that
              save time, reduce wasted effort, improve visibility, and help people work with more
              confidence.
            </p>

            <div className="mt-10 relative h-[220px] overflow-hidden">
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

                <path d="M40 110 H180 L230 70 H380 L430 110 H860" stroke="url(#deliverCircuitGlow)" strokeWidth="2.4" strokeLinecap="round">
                  <animate attributeName="stroke-dasharray" values="0 1000;260 740;0 1000" dur="4.6s" repeatCount="indefinite" />
                  <animate attributeName="stroke-dashoffset" values="0;-320;-860" dur="4.6s" repeatCount="indefinite" />
                </path>

                <path d="M180 110 V170 H300" stroke="url(#deliverCircuitGlow)" strokeWidth="2.2" strokeLinecap="round">
                  <animate attributeName="stroke-dasharray" values="0 400;90 310;0 400" dur="4.6s" begin="0.35s" repeatCount="indefinite" />
                  <animate attributeName="stroke-dashoffset" values="0;-120;-300" dur="4.6s" begin="0.35s" repeatCount="indefinite" />
                </path>

                <path d="M380 70 V35 H520" stroke="url(#deliverCircuitGlow)" strokeWidth="2.2" strokeLinecap="round">
                  <animate attributeName="stroke-dasharray" values="0 300;80 220;0 300" dur="4.6s" begin="0.65s" repeatCount="indefinite" />
                  <animate attributeName="stroke-dashoffset" values="0;-90;-220" dur="4.6s" begin="0.65s" repeatCount="indefinite" />
                </path>

                <path d="M540 110 V165 H700" stroke="url(#deliverCircuitGlow)" strokeWidth="2.2" strokeLinecap="round">
                  <animate attributeName="stroke-dasharray" values="0 340;95 245;0 340" dur="4.6s" begin="1s" repeatCount="indefinite" />
                  <animate attributeName="stroke-dashoffset" values="0;-100;-260" dur="4.6s" begin="1s" repeatCount="indefinite" />
                </path>

                <circle cx="180" cy="110" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="380" cy="70" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="540" cy="110" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="300" cy="170" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="520" cy="35" r="4" fill="#4ade80" opacity="0.55" />
                <circle cx="700" cy="165" r="4" fill="#4ade80" opacity="0.55" />

                <circle r="7" fill="url(#deliverPulseGlow)">
                  <animateMotion dur="4.6s" repeatCount="indefinite" path="M40 110 H180 L230 70 H380 L430 110 H860" />
                </circle>
              </svg>

              <div className="relative z-10 flex h-full flex-col justify-between py-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-green-400">
                    ⇼ Systems That Communicate ⇼
                  </div>
                  <div className="hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35 md:block">
                    No More Broken Links Between Tools
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
                      Event
                    </div>
                    <div className="mt-2 text-sm text-white/55">Action Trigger</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
                      System Logic Updates Modules
                    </div>
                    <div className="mt-2 text-sm text-white/55">System Updates Across The Board</div>
                  </div>

                  <div>
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
                  className={`group relative min-h-[520px] overflow-hidden rounded-[2rem] border text-left transition-all duration-500 ${
                    isOpen
                      ? 'col-span-2 border-green-400/70 bg-black/75 shadow-[0_0_35px_rgba(34,197,94,0.14)]'
                      : 'col-span-1 border-white/10 bg-black/50 hover:border-green-400/35 hover:bg-black/60'
                  }`}
                >
                  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-green-300 transition group-hover:border-green-400/40">
                    {isOpen ? '−' : '+'}
                  </div>

                  <div className="relative flex h-full min-h-[520px] flex-col p-6">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
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
                      className={`relative mt-6 overflow-hidden transition-all duration-500 ${
                        isOpen ? 'h-[220px]' : 'h-[110px]'
                      }`}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full rounded-[1.35rem] object-cover transition duration-500"
                      />

                      <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-t from-black/50 via-black/10 to-green-500/10" />
                      <div className="absolute inset-0 rounded-[1.35rem] opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:22px_22px]" />
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? 'mt-6 max-h-[320px] opacity-100' : 'mt-0 max-h-0 opacity-0'
                      }`}
                    >
                      <div className="max-w-xl">
                        <div className="mb-4 h-px w-24 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
                        <p className="text-base leading-8 text-white/72">{card.text}</p>
                      </div>
                    </div>

                    {!isOpen && (
                      <div className="relative mt-auto pt-6">
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
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                      ⇼ AegisOne ⇼
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
                    src="/images/AegisOne.png"
                    alt="Industrial digital systems visual"
                    className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-[0.92] transition duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1"
                  />

                  <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/15 to-green-500/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.06),transparent_20%)] opacity-80 transition duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <button
                    type="button"
                    onClick={() => openExternalOrLog(preorderLinks.aegisone)}
                    className="absolute left-4 top-4 rounded-full border border-green-400/30 bg-black/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-green-300 backdrop-blur transition hover:scale-[1.05] hover:border-green-300 hover:text-green-200"
                  >
                    SIGN UP FOR PRE-ORDERS HERE
                  </button>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="max-w-lg">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-300">
                        Digital Safety Intelligence
                      </div>
                      <div className="mt-2 text-2xl font-bold text-white">
                        Smarter tools built for real operational environments
                      </div>
                      <p className="mt-2 text-sm leading-7 text-white/70">
                        AegisOne is a modular safety management platform designed to give teams better tools
                        for reducing risk, improving compliance, and making safety information more accessible
                        and actionable across all levels of an organization.
                      </p>
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
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                      ⇼ Media Center ⇼
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">
                      RuntWerkx Digital Library
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/media-center')}
                    className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 transition hover:border-green-400/30 hover:text-green-300"
                  >
                    Go To Media Library
                  </button>
                </div>

                <div className="relative h-[260px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-green-500/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,197,94,0.14),transparent_22%),radial-gradient(circle_at_82%_72%,rgba(255,255,255,0.05),transparent_22%)] opacity-90" />
                  <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="h-16 w-16 rounded-full border border-green-400/20 bg-green-500/10 shadow-[0_0_22px_rgba(34,197,94,0.12)]" />
                    <div className="mt-6 text-3xl font-bold text-white">
                      Multimedia Coming Soon
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                      Future home for product walkthroughs, quick training videos,
                      promotional media, and other RuntWerkx support content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.10),transparent_28%)]" />
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                  ⇼ Performance Snapshot ⇼
                </div>
                <h3 className="mt-3 text-2xl font-bold">How better tools create real gains</h3>
                <p className="mt-3 max-w-xl text-white/70">
                  Small process improvements can stack fast when software is built to reduce friction,
                  increase clarity, and help people move faster with less wasted effort.
                </p>

                <div className="mt-8 grid gap-5">
                  {metrics.map((metric, index) => (
                    <div key={metric.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/75">{metric.label}</span>
                        <span className="font-semibold text-green-300">{metric.value}%</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-600 via-green-400 to-green-300 shadow-[0_0_18px_rgba(74,222,128,0.35)]"
                          style={{
                            width: `${metric.value}%`,
                            animation: `metricGrow 1.1s ease-out ${index * 0.15}s both`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/60 p-6">
              <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                  ⇼ Graph Area ⇼
                </div>
                <h3 className="mt-3 text-2xl font-bold">Mini animated chart placeholder</h3>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/70 p-4">
                  <svg
                    viewBox="0 0 420 190"
                    className="h-[180px] w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#166534" />
                        <stop offset="50%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#bbf7d0" />
                      </linearGradient>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(74,222,128,0.28)" />
                        <stop offset="100%" stopColor="rgba(74,222,128,0.00)" />
                      </linearGradient>
                    </defs>

                    <path d="M30 20 V160 H390" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
                    <path d="M30 130 H390" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <path d="M30 95 H390" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <path d="M30 60 H390" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    <path
                      d="M42 142 C92 138, 120 124, 158 112 C205 97, 230 84, 270 70 C305 58, 338 40, 378 26 L378 160 L42 160 Z"
                      fill="url(#chartFill)"
                    />

                    <path
                      d="M42 142 C92 138, 120 124, 158 112 C205 97, 230 84, 270 70 C305 58, 338 40, 378 26"
                      stroke="url(#chartLine)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="800"
                      strokeDashoffset="800"
                    >
                      <animate attributeName="stroke-dashoffset" from="800" to="0" dur="2s" fill="freeze" />
                    </path>

                    <circle cx="158" cy="112" r="4" fill="#86efac">
                      <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="270" cy="70" r="4" fill="#86efac">
                      <animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="378" cy="26" r="4" fill="#bbf7d0">
                      <animate attributeName="r" values="4;7;4" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  Nice spot for a small animated graph showing reduced time, lower cost, increased output,
                  or better workflow performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes metricGrow {
          0% {
            width: 0%;
            opacity: 0.35;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}