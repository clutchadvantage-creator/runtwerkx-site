import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showcaseItems } from '../../data/homeContent'
import { handleHref } from '../../utils/homeUtils'

export default function ProductShowcaseSection() {
  const [activeItem, setActiveItem] = useState(-1)
  const navigate = useNavigate()

  useEffect(() => {
    let lastY = window.scrollY
    let accumulatedScroll = 0

    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = Math.abs(currentY - lastY)

      accumulatedScroll += delta

      if (accumulatedScroll > 120) {
        setActiveItem(-1)
        accumulatedScroll = 0
      }

      lastY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="work" className="relative overflow-hidden border-y border-white/10">
      <video
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover blur-[1px]"
        src="/videos/showcase-bg-compressed.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/80" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.14),transparent_24%),radial-gradient(circle_at_85%_35%,rgba(34,197,94,0.10),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.04),transparent_18%)]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:34px_34px]" />

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/70"
            style={{
              left: `${6 + ((i * 7) % 88)}%`,
              top: `${10 + ((i * 11) % 78)}%`,
              animation: `showcaseSpark ${4.6 + (i % 5)}s linear infinite`,
              animationDelay: `${i * 0.28}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
            ― Our Products ―
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">Showcase</h2>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
          <p className="mx-auto mt-5 max-w-2xl text-white/68">
            Built for movement, visibility, structure, and better operational systems.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {showcaseItems.map((item, index) => {
            const isOpen = activeItem === index

            return (
              <div
                key={item.id}
                id={item.id}
                className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
                  isOpen
                    ? 'border-green-400/60 bg-black/72 shadow-[0_0_45px_rgba(34,197,94,0.16)]'
                    : 'border-white/10 bg-black/55 hover:border-green-400/35 hover:bg-black/62'
                }`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`h-full w-full object-cover object-center transition duration-700 ${
                      isOpen
                        ? 'scale-[1.04] opacity-[0.22]'
                        : 'scale-[1.01] opacity-[0.12] group-hover:opacity-[0.18]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.14),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.04),transparent_18%)]" />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem(isOpen ? -1 : index)}
                  className="relative flex w-full items-center justify-between gap-6 px-6 py-6 text-center md:px-8 md:py-7"
                >
                  <div className="mx-auto max-w-4xl flex-1 text-center">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-400">
                      {item.tag}
                    </div>

                    <h3 className="mt-3 text-2xl font-bold leading-tight text-white md:text-[2rem]">
                      {item.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-2xl text-green-300 transition group-hover:border-green-400/40">
                    {isOpen ? '−' : '+'}
                  </div>
                </button>

                <div
                  className={`relative overflow-hidden transition-all duration-500 ${
                    isOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="rounded-[1.6rem] border border-white/10 bg-black/45 p-5 text-center backdrop-blur">
                        <div className="mx-auto h-px w-24 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

                        <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-8 text-white/74">
                          {item.description}
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                          {item.stats.map((stat) => (
                            <div
                              key={stat}
                              className="rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300"
                            >
                              {stat}
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleHref(item.href, navigate)}
                            disabled={!item.href}
                            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                              item.href
                                ? 'bg-green-500 text-black hover:scale-[1.02]'
                                : 'cursor-default border border-white/10 bg-white/[0.04] text-white/45'
                            }`}
                          >
                            {item.actionLabel}
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveItem(-1)}
                            className="rounded-2xl border border-white/12 px-5 py-3 text-sm font-semibold text-white/78 transition hover:border-green-400/50 hover:text-green-300"
                          >
                            Collapse Panel
                          </button>
                        </div>
                      </div>

                      <div className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] border border-green-500/15 bg-black/55 lg:min-h-[440px]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="showcase-image-drift absolute inset-0 h-full w-full object-cover object-center opacity-[0.92]"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/72 via-black/10 to-green-500/10" />
                        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:24px_24px]" />

                        <div className="showcase-glow-orb pointer-events-none absolute -left-10 top-8 h-36 w-36 rounded-full bg-green-500/14 blur-3xl" />
                        <div className="showcase-glow-orb-alt pointer-events-none absolute bottom-4 right-4 h-44 w-44 rounded-full bg-green-400/10 blur-[90px]" />
                      </div>
                    </div>
                  </div>
                </div>

                {!isOpen && (
                  <div className="relative px-6 pb-5 md:px-8">
                    <div className="h-px w-full bg-gradient-to-r from-green-500/0 via-green-400/25 to-green-500/0" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes showcaseSpark {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-18px) scale(1.6);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.08;
          }
        }

        @keyframes showcaseImageDrift {
          0% {
            transform: scale(1.03) translate3d(0px, 0px, 0px);
          }
          50% {
            transform: scale(1.08) translate3d(-8px, -6px, 0px);
          }
          100% {
            transform: scale(1.03) translate3d(0px, 0px, 0px);
          }
        }

        @keyframes showcaseGlowDriftA {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1);
            opacity: 0.18;
          }
          50% {
            transform: translate3d(16px, -10px, 0px) scale(1.08);
            opacity: 0.28;
          }
          100% {
            transform: translate3d(0px, 0px, 0px) scale(1);
            opacity: 0.18;
          }
        }

        @keyframes showcaseGlowDriftB {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1);
            opacity: 0.12;
          }
          50% {
            transform: translate3d(-14px, 10px, 0px) scale(1.1);
            opacity: 0.22;
          }
          100% {
            transform: translate3d(0px, 0px, 0px) scale(1);
            opacity: 0.12;
          }
        }

        .showcase-image-drift {
          animation: showcaseImageDrift 10s ease-in-out infinite;
          will-change: transform;
        }

        .showcase-glow-orb {
          animation: showcaseGlowDriftA 7.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .showcase-glow-orb-alt {
          animation: showcaseGlowDriftB 8.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  )
}