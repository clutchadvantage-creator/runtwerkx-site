import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderCog,
  FileStack,
  Repeat,
  Brush,
  Users,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'

const FILE_ROUTER_PAYMENT_LINKS = {
  monthly: 'https://buy.stripe.com/4gMbJ19zg6NC3cb1ty4ZG00',
  sixMonth: 'https://buy.stripe.com/dRm7sL6n40peeUT3BG4ZG01',
  yearly: 'https://buy.stripe.com/9B68wPfXEdc0dQP8W04ZG02',
}

const FILE_ROUTER_BILLING_LINKS = {
  portal: 'https://billing.stripe.com/p/login/4gMbJ19zg6NC3cb1ty4ZG00',
}

const WHY_IT_MATTERS_ROWS = [
  {
    title: 'Staging Workspace Acts Like A Shopping Cart',
    text: 'Bring files and folders into a clean command area before routing so the user can review the plan before execution.',
  },
  {
    title: 'Routing Logic ~ Thinks For Itself',
    text: 'Apply saved profiles or quick bulk actions to route files with less clicking, less wasted motion, and less second guessing.',
  },
  {
    title: 'Profile System For Repeat Routing Jobs',
    text: 'Create reusable routing rules for repeat jobs, packages, archives, and consistent delivery workflows.',
  },
  {
    title: 'Lean Interface Navigation',
    text: 'Easy to use and easy to navigate with no bloat, no clutter, and no unnecessary noise getting in the way of the work.',
  },
]

const FAQ_POOL = [
  {
    question: 'Do all plans include the same features?',
    answer:
      'Yes. Every plan includes the same full version of RuntWerkx File Router. The only difference is billing frequency.',
  },
  {
    question: 'Are payments recurring?',
    answer:
      'Yes. Payments recur based on the billing option you choose and can be canceled at any time.',
  },
  {
    question: 'Is File Router built for real work environments?',
    answer:
      'Yes. File Router was built around real day-to-day production workflow problems.',
  },
  {
    question: 'How do I get help or ask questions?',
    answer:
      'Reach out by email or phone for product questions, setup help, documentation requests, or general support.',
  },
  {
    question: 'Is setup complicated?',
    answer:
      'No. The goal is a clean startup path with practical support available if you need help getting your routing flow in place.',
  },
  {
    question: 'Can File Router help with repeat jobs?',
    answer:
      'Yes. Saved profiles and repeatable logic are a core part of the app so recurring workflows stay fast and consistent.',
  },
  {
    question: 'Do I need a lot of training to use it?',
    answer:
      'No. File Router was shaped around real users and real daily work so it stays approachable without piling on clutter.',
  },
  {
    question: 'What kind of files can it help organize?',
    answer:
      'It is designed to help stage, sort, and route production files, archives, and other common job-related data.',
  },
]

function mailtoLink(subject, body = '') {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body) params.set('body', body)
  return `mailto:runtwerkx.dev@gmail.com?${params.toString()}`
}

function ScreenshotCard({ src, title, text }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition hover:border-green-400/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.12)]">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="text-lg font-bold">{title}</div>
        <div className="mt-1 text-sm text-white/60">{text}</div>
      </div>
      <div className="bg-black p-2">
        <img
          src={src}
          alt={title}
          className="w-full rounded-b-[1.75rem] object-cover"
        />
      </div>
    </div>
  )
}

function CircuitGlow() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[1.75rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_72%_35%,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_35%_70%,rgba(34,197,94,0.10),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:62px_62px] opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div className="absolute left-8 right-8 top-10 h-px bg-gradient-to-r from-transparent via-green-400/25 to-transparent" />
      <div className="absolute left-20 right-20 bottom-14 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
    </div>
  )
}

function LogoPanel() {
  return (
    <div className="absolute inset-x-0 top-8 z-10 mx-auto flex w-[82%] items-center justify-center">
      <div className="px-8 py-6">
        <img
          src="/images/newrwfr.png"
          alt="RuntWerkx logo"
          className="mx-auto h-80 w-auto object-contain drop-shadow-[0_0_18px_rgba(34,197,94,0.35)]"
        />
      </div>
    </div>
  )
}

function WhyItMattersTicker() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState('enter')
  const timeoutsRef = useRef([])

  useEffect(() => {
    const clearAll = () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []
    }

    clearAll()
    setPhase('enter')

    const exitTimeout = setTimeout(() => {
      setPhase('exit')
    }, 14250)

    const nextTimeout = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % WHY_IT_MATTERS_ROWS.length)
      setPhase('enter')
    }, 15550)

    timeoutsRef.current.push(exitTimeout, nextTimeout)

    return clearAll
  }, [activeIndex])

  const activeRow = WHY_IT_MATTERS_ROWS[activeIndex]

  return (
    <div className="relative overflow-hidden rounded-full py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-black via-black/80 to-transparent" />

      <div
        key={`${activeRow.title}-${activeIndex}`}
        className={`whitespace-nowrap text-sm md:text-base ${
          phase === 'enter'
            ? 'animate-[rwx-marquee-in_15s_linear_forwards]'
            : 'animate-[rwx-marquee-out_1.3s_linear_forwards]'
        }`}
      >
        <span className="inline-flex items-center gap-4 pr-16 text-white/88">
          <span className="font-bold uppercase tracking-[0.22em] text-green-400">
            {activeRow.title}
          </span>
          <span className="text-white/68">{activeRow.text}</span>
        </span>
      </div>
    </div>
  )
}

function FaqFerrisWheel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    if (!isPaused) return

    const pauseTimer = setTimeout(() => {
      setIsPaused(false)
    }, 6000)

    return () => clearTimeout(pauseTimer)
  }, [isPaused, activeIndex])

  useEffect(() => {
    if (isPaused) return

    const spinTimer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % FAQ_POOL.length)
      setIsPaused(true)
    }, 4000)

    return () => clearTimeout(spinTimer)
  }, [isPaused])

  const wheelSize = 560
  const center = wheelSize / 2
  const hubRadius = 26
  const cardWidth = 320
  const cardHeight = 164
  const radiusX = 250
  const radiusY = 190
  const stepDeg = 360 / FAQ_POOL.length
  const VISIBLE_SLOTS = 4

  const positionedCards = FAQ_POOL.map((item, index) => {
    const relativeIndex = (index - activeIndex + FAQ_POOL.length) % FAQ_POOL.length
    const angleDeg = relativeIndex * stepDeg
    const angleRad = (angleDeg - 90) * (Math.PI / 180)

    const x = Math.cos(angleRad) * radiusX
    const y = Math.sin(angleRad) * radiusY

    const normalizedDepth = (y + radiusY) / (radiusY * 2)
    const isFront = relativeIndex === 0
    const isVisible = relativeIndex < VISIBLE_SLOTS

    return {
      ...item,
      index,
      relativeIndex,
      x,
      y,
      isFront,
      isVisible,
      scale: isFront && isPaused ? 1.08 : 0.76 + normalizedDepth * 0.18,
      opacity: isVisible ? (isFront ? 1 : 0.34 + normalizedDepth * 0.46) : 0,
      zIndex: isVisible
        ? (isFront ? 50 : Math.round(normalizedDepth * 20) + 10)
        : 0,
      blur: isVisible ? (isFront ? 0 : (1 - normalizedDepth) * 1.1) : 0,
    }
  }).sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="relative mx-auto h-[720px] max-w-6xl overflow-hidden md:h-[760px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_48%)]" />

      <div className="absolute left-1/2 top-[52%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_62%)]" />

      <div
        className="absolute left-1/2 top-[52%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translate(-50%, -50%) rotate(${-activeIndex * stepDeg}deg)`,
        }}
      >
        <div className="absolute inset-0 rounded-full border border-white/8 shadow-[0_0_90px_rgba(34,197,94,0.08)]" />
        <div className="absolute inset-[54px] rounded-full border border-green-400/10" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {FAQ_POOL.map((_, index) => {
            const angleDeg = index * stepDeg
            const angleRad = (angleDeg - 90) * (Math.PI / 180)
            const x = center + Math.cos(angleRad) * radiusX
            const y = center + Math.sin(angleRad) * radiusY

            return (
              <g key={`spoke-${index}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.4"
                />
                <circle cx={x} cy={y} r="4" fill="rgba(74,222,128,0.8)" />
              </g>
            )
          })}

          <circle
            cx={center}
            cy={center}
            r={hubRadius}
            fill="rgba(34,197,94,0.15)"
            stroke="rgba(74,222,128,0.38)"
            strokeWidth="2"
          />
        </svg>

        {FAQ_POOL.map((item, index) => {
          const angleDeg = index * stepDeg
          const angleRad = (angleDeg - 90) * (Math.PI / 180)
          const x = Math.cos(angleRad) * radiusX
          const y = Math.sin(angleRad) * radiusY

          return (
            <div
              key={`hanger-${item.question}`}
              className="absolute left-1/2 top-1/2 h-[22px] w-[2px] -translate-x-1/2 bg-gradient-to-b from-white/30 to-transparent"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - 22}px))`,
              }}
            />
          )
        })}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[52%] h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/20 bg-black/55 shadow-[0_0_35px_rgba(34,197,94,0.12)]" />
      <div className="pointer-events-none absolute left-1/2 top-[52%] h-[255px] w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/10 via-green-400/20 to-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-[52%] h-[90px] w-[300px] -translate-x-1/2 rounded-t-full border-x border-t border-white/8" />
      <div className="pointer-events-none absolute left-1/2 top-[52%] h-[10px] w-[360px] -translate-x-1/2 rounded-full bg-white/6" />

      <div className="absolute inset-0 overflow-hidden">
        {positionedCards.map((card) => {
          const left = `calc(50% + ${card.x}px - ${cardWidth / 2}px)`
          const top = `calc(52% + ${card.y}px - ${cardHeight / 2}px)`

          return (
            <div
              key={card.question}
              className="absolute transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left,
                top,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                opacity: card.opacity,
                zIndex: card.zIndex,
                transform: `scale(${card.scale})`,
                filter: `blur(${card.blur}px)`,
                visibility: card.isVisible ? 'visible' : 'hidden',
                pointerEvents: card.isVisible ? 'auto' : 'none',
              }}
              aria-hidden={!card.isVisible}
            >
              <div className="absolute left-1/2 top-[-18px] h-5 w-[2px] -translate-x-1/2 bg-gradient-to-t from-white/35 to-transparent" />
              <div className="absolute left-1/2 top-[-21px] h-3 w-3 -translate-x-1/2 rounded-full border border-green-400/30 bg-black" />

              <div className="relative h-full rounded-[1.8rem] border border-white/12 bg-white/6 px-6 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.38)] backdrop-blur">
                <div className="absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_36%)]" />

                <div className="relative">
                  <h4 className="text-base font-bold text-white md:text-lg">
                    {card.question}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {card.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FileRouterUseCasesInteractive() {
  const items = useMemo(
    () => [
      {
        id: 'cnc',
        title: 'CNC File Prep',
        short: 'NC files routed to the correct machine folders.',
        description:
          'Quickly stage and route NC files into the correct machine folders without digging through deep directory structures or relying on manual folder hunting.',
        industry: 'Steel Fabrication',
        example:
          'NC1 / DSTV files moved into machine-specific production folders.',
        Icon: FolderCog,
      },
      {
        id: 'drawings',
        title: 'Drawing Packages',
        short: 'Drawing sets and PDFs organized by job.',
        description:
          'Move full drawing sets, PDFs, and supporting documentation into clean, structured job folders in seconds.',
        industry: 'Engineering / Production',
        example:
          'Approval drawings, fab details, and install documents grouped by project number.',
        Icon: FileStack,
      },
      {
        id: 'repeat',
        title: 'Repeat Jobs',
        short: 'Saved routing profiles for recurring work.',
        description:
          'Apply saved routing profiles for jobs that happen over and over so the same logic can be reused with less setup and less rework.',
        industry: 'Manufacturing',
        example:
          'Standard product lines routed the same way every time with one click.',
        Icon: Repeat,
      },
      {
        id: 'cleanup',
        title: 'Bulk Cleanup',
        short: 'Messy folders cleaned in one controlled pass.',
        description:
          'Take disorganized source folders and apply clean routing logic in one controlled operation instead of manually sorting files one at a time.',
        industry: 'Operations',
        example:
          'Downloads, shared folders, or hot folders reorganized into usable production structure.',
        Icon: Brush,
      },
      {
        id: 'operator',
        title: 'Operator-Friendly Flow',
        short: 'Simple enough for real-world shop use.',
        description:
          'Built so operators and office users can work confidently without needing complicated training or memorizing fragile folder trees.',
        industry: 'Shop Floor / Office',
        example:
          'Simple staging, visible actions, and predictable outcomes for everyday use.',
        Icon: Users,
      },
      {
        id: 'validation',
        title: 'Pre-Flight Validation',
        short: 'See what happens before execution.',
        description:
          'Preview exactly what the routing engine is going to do before moving files so users can validate the result with confidence.',
        industry: 'Quality / Admin Control',
        example:
          'Review destinations, actions, and profile behavior before committing file operations.',
        Icon: ShieldCheck,
      },
    ],
    []
  )

  const [activeId, setActiveId] = useState(items[0].id)
  const activeItem = items.find((item) => item.id === activeId) ?? items[0]

  const radius = 245
  const innerRadius = 112

  return (
    <section id="workflow" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-green-400">
          ― Use Cases ―
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
          Real industry workflows
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-white/70">
          The File Router tool was created from actual day-to-day problems and
          friction, not theory. Explore live workflow examples connected to the
          routing core.
        </p>
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex min-h-[680px] items-center justify-center overflow-hidden">
          <div className="absolute h-[440px] w-[440px] rounded-full border border-green-400/10" />
          <div className="absolute h-[580px] w-[580px] rounded-full border border-white/5" />
          <div className="absolute h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,rgba(34,197,94,0.03)_22%,transparent_62%)]" />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0)" />
              </radialGradient>
            </defs>

            <circle cx="400" cy="400" r="34" fill="url(#coreGlow)" />

            {items.map((item, index) => {
              const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2
              const x1 = 400 + Math.cos(angle) * innerRadius
              const y1 = 400 + Math.sin(angle) * innerRadius
              const x2 = 400 + Math.cos(angle) * radius
              const y2 = 400 + Math.sin(angle) * radius
              const isActive = item.id === activeId

              return (
                <g key={`line-${item.id}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isActive
                        ? 'rgba(74, 222, 128, 0.7)'
                        : 'rgba(255,255,255,0.08)'
                    }
                    strokeWidth={isActive ? '2.5' : '1.2'}
                    strokeLinecap="round"
                  />

                  {isActive && (
                    <circle r="5" fill="rgba(74,222,128,0.95)">
                      <animateMotion
                        dur="1.7s"
                        repeatCount="indefinite"
                        path={`M ${x2} ${y2} L ${x1} ${y1}`}
                      />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>

          {items.map((item, index) => {
            const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const isActive = item.id === activeId
            const Icon = item.Icon

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className="group absolute left-1/2 top-1/2 z-10"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                aria-pressed={isActive}
              >
                <div
                  className={[
                    'w-56 rounded-2xl border p-4 text-left backdrop-blur transition duration-300',
                    isActive
                      ? 'scale-[1.03] border-green-400/50 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.22)]'
                      : 'border-white/10 bg-white/5 hover:border-green-400/30 hover:bg-white/8 hover:shadow-[0_0_18px_rgba(34,197,94,0.08)]',
                  ].join(' ')}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={[
                        'flex h-10 w-10 items-center justify-center rounded-xl border transition',
                        isActive
                          ? 'border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_16px_rgba(34,197,94,0.16)]'
                          : 'border-white/10 bg-black/30 text-white/70 group-hover:border-green-400/20 group-hover:text-green-300',
                      ].join(' ')}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </div>

                    <div
                      className={[
                        'h-2.5 w-2.5 rounded-full transition',
                        isActive
                          ? 'bg-green-400 shadow-[0_0_14px_rgba(34,197,94,0.95)]'
                          : 'bg-white/25',
                      ].join(' ')}
                    />
                  </div>

                  <h3
                    className={[
                      'text-sm font-semibold transition',
                      isActive ? 'text-green-300' : 'text-white',
                    ].join(' ')}
                  >
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/60">
                    {item.short}
                  </p>
                </div>
              </button>
            )
          })}

          <div className="relative z-20 flex h-52 w-52 flex-col items-center justify-center rounded-full border border-green-400/40 bg-black shadow-[0_0_45px_rgba(34,197,94,0.18)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.16)_0%,rgba(34,197,94,0.04)_42%,transparent_72%)] animate-pulse" />
            <div className="relative z-10 mb-3 h-4 w-4 rounded-full bg-green-400 shadow-[0_0_16px_rgba(34,197,94,0.95)]" />
            <p className="relative z-10 text-center text-[11px] uppercase tracking-[0.34em] text-green-400">
              File Router
            </p>
            <h3 className="relative z-10 mt-2 px-5 text-center text-lg font-bold text-white">
              {activeItem.title}
            </h3>
            <p className="relative z-10 mt-2 px-6 text-center text-xs leading-5 text-white/55">
              Active workflow linked to routing core
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-green-400/20 bg-white/5 p-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-green-400">
            ― Selected Workflow ―
          </p>

          <h3 className="mt-4 text-3xl font-bold text-white">
            {activeItem.title}
          </h3>

          <p className="mt-4 text-base leading-8 text-white/70">
            {activeItem.description}
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                Industry Fit
              </p>
              <p className="mt-2 text-sm text-white/80">{activeItem.industry}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                Real Example
              </p>
              <p className="mt-2 text-sm text-white/80">{activeItem.example}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-500/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-green-400">
              Why it matters
            </p>
            <p className="mt-2 text-sm leading-7 text-white/75">
              This workflow shows how File Router turns repetitive file handling
              into a controlled, repeatable movement system with better
              visibility, less wasted motion, and cleaner daily execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FileRouter() {
  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes rwx-marquee-in {
          0% { transform: translateX(100%); opacity: 1; }
          100% { transform: translateX(-108%); opacity: 1; }
        }

        @keyframes rwx-marquee-out {
          0% { transform: translateX(-108%); opacity: 1; }
          100% { transform: translateX(-132%); opacity: 0; }
        }
      `}</style>

      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <img
            src="/images/hero-background4.png"
            alt="Hero background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/68" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_25%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-10" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                ― RuntWerkx ―
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <h1 className="text-5xl font-black leading-tight md:text-7xl">
                  File Routing Software for Manufacturing & Production Facilities
                </h1>
                <span className="rounded-full border border-green-400/30 px-3 py-1 text-xs font-semibold text-green-400">
                  v2.1.3 Stable
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-lg text-white/75">
                RuntWerkx File Router is a file routing and workflow automation tool designed for manufacturing, CNC shops, and production environments. 
              </p>

              <p className="mt-4 max-w-3xl text-sm uppercase tracking-[0.22em] text-white/45">
                Built and tested around real production workflow pain points
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#pricing"
                  className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                >
                  Download Installer (v2.1.3 Stable)
                </a>

                <a
                  href="#screenshots"
                  className="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:border-green-400 hover:text-green-400"
                >
                  View Features
                </a>

                <a
                  href="#workflow"
                  className="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:border-green-400 hover:text-green-400"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <div className="relative">
              <LogoPanel />
              <CircuitGlow />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              ― By Industry Professionals ― For Industry Professionals ―
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Meticulously crafted with users in mind.
            </h2>
          </div>

          <WhyItMattersTicker />
        </section>

        <section
          id="screenshots"
          className="border-y border-white/10 bg-white/[0.03]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                ― Get More Done ―
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Designed for Real-World Production
              </h2>
              <p className="mt-4 max-w-3xl text-white/70">
                These screenshots show the actual command-center layout, routing
                controls, profile editor, and the improved staging workspace
                design.
              </p>
            </div>

            <div className="grid gap-8">
              <ScreenshotCard
                src="/images/newstaging.png"
                title="Staging Command Center"
                text="Files and folders are staged first so actions, targets, and status can be reviewed before routing."
              />

              <div className="grid gap-8 lg:grid-cols-2">
                <ScreenshotCard
                  src="/images/newfilenetwork.png"
                  title="View your files and folders like never before"
                  text="Apply profiles to staged items, view files like a network brain, a physical view of your files and folders, customizable graph settings."
                />
                <ScreenshotCard
                  src="/images/newprofiles.png"
                  title="Profile Editor"
                  text="Reusable routing profiles make common workflows faster, more predictable, and easier to maintain."
                />
              </div>

              <ScreenshotCard
                src="/images/applyprofiles.png"
                title="Polished Staging Workspace"
                text="The updated staging area introduces a cleaner spreadsheet-style work surface with stronger row visibility and interaction."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              ― Product Evolution ―
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Where it started & Where we are now
            </h2>
            <p className="mt-4 max-w-3xl text-white/70">
              Our File Router keeps getting sharper through real world use. The
              newer staging workspace improves visibility, interaction clarity,
              and overall flow while keeping the same command-center identity.
              Runtwerkx continues to provide support and updates to the
              application at regular intervals.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition hover:border-green-400/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="text-lg font-bold">Before</div>
                <div className="mt-1 text-sm text-white/60">
                  Based off of a game engine UI/UX originally with the same-file
                  routing concept we had an idea and a problem to fix!
                </div>
              </div>
              <div className="bg-black p-2">
                <img
                  src="/images/whereitstarted.png"
                  alt="File Router staging before improvements"
                  className="w-full rounded-b-[1.75rem] object-cover"
                />
              </div>
              <div className="border-t border-white/10 px-5 py-4 text-sm text-white/65">
                Strong layout foundation, but less spreadsheet-like visual
                clarity for row-based work.
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-green-500/30 bg-green-500/5 transition hover:shadow-[0_0_24px_rgba(34,197,94,0.16)]">
              <div className="border-b border-green-500/20 px-5 py-4">
                <div className="text-lg font-bold text-green-400">After</div>
                <div className="mt-1 text-sm text-white/60">
                  Updated staging workspace with a cleaner white work surface
                  and stronger row visibility with an added SaaS aesthetic.
                </div>
              </div>
              <div className="bg-black p-2">
                <img
                  src="/images/newstaging.png"
                  alt="File Router staging after improvements"
                  className="w-full rounded-b-[1.75rem] object-cover"
                />
              </div>
              <div className="border-t border-green-500/20 px-5 py-4 text-sm text-white/65">
                Cleaner table interaction, better row contrast, stronger action
                visibility, and a more usable daily workflow.
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold">⚙️-Industry Focused-</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                RuntWerkx Systems has worked with industry leaders for the last
                12 years to find solutions to industry's biggest pain points.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold">🔬-Research & Development-</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                At RuntWerkx, we prioritize real-world use and continuous
                improvement over flashy marketing or empty promises. We reinvest
                in our products to make them better for our users!
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold">🧠-Real Logic Built In-</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                RuntWerkx uses a routing logic layer that thinks for itself to
                reduce clicks, wasted motion, and decision fatigue. It applies
                real-world logic to make routing faster and more intuitive
                instead of just throwing a bunch of options at the user.
              </p>
            </div>
          </div>
        </section>

        <FileRouterUseCasesInteractive />

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              RuntWerkx File Router ― If Windows File Explorer had a brain
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Born From Bad Workflows and Inefficiency
            </h2>
            <p className="mt-4 max-w-3xl text-white/70">
              Built for people doing real work with real files in real
              environments. RuntWerkx File Router reduces wasted motion,
              repeated clicks, and folder chaos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold text-green-400">~Monthly~</h3>
              <p className="mt-3 text-3xl font-black text-white">$9.99</p>
              <p className="mt-1 text-sm text-white/60">per month</p>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Full access to File Router with the same complete feature set.
              </p>
              <a
                href={FILE_ROUTER_PAYMENT_LINKS.monthly}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
              >
                Buy & Download
              </a>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold text-green-400">~6 Months~</h3>
              <p className="mt-3 text-3xl font-black text-white">$49.99</p>
              <p className="mt-1 text-sm text-white/60">every 6 months</p>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Same full product, billed less often for a cleaner workflow.
              </p>
              <a
                href={FILE_ROUTER_PAYMENT_LINKS.sixMonth}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl border border-white/20 px-4 py-3 font-semibold text-white transition hover:border-green-400 hover:text-green-400"
              >
                Buy & Download
              </a>
            </div>

            <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6 transition hover:shadow-[0_0_24px_rgba(34,197,94,0.16)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-green-400">~Yearly~</h3>
                <span className="rounded-full border border-green-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-300">
                  Best Value
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-white">$89.99</p>
              <p className="mt-1 text-sm text-white/60">per year</p>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Same full feature set with a lower overall cost when billed
                annually.
              </p>
              <a
                href={FILE_ROUTER_PAYMENT_LINKS.yearly}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
              >
                Buy & Download
              </a>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-green-400/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-xl font-bold text-green-400">~In The Know~</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                All payments are recurring and can be canceled at any time.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Everyone gets the same full version of the File Router. Choose
                the billing cycle that fits you best.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Subscriptions can be managed or canceled anytime through your secure billing portal.
              </p>
              <a
                href={FILE_ROUTER_BILLING_LINKS.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-green-400/30 px-4 py-2 text-sm font-semibold text-green-300 transition hover:border-green-300 hover:text-green-200"
              >
                Manage Subscription
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Industry Forged Innovation ―
              </h2>
              <p className="mt-4 text-white/70">
                At RuntWerkx Systems, the mission is to design and implement the
                next generation of industrial applications, tools, and software
                built for real-world use. Backed by 12 years of experience in
                structural steel, heavy equipment operations, and production
                environments, RuntWerkx combines hands-on field knowledge with a
                deep understanding of industrial digital systems. That
                background includes experience with CAD, Raptor, Cortex by AGT /
                AGT Robotics, StruMIS integration, HRIS, SMS, EHS workflows, NC
                files, DSTV data, and the operational realities that surround
                them. The result is a software approach grounded in practical
                industry experience and focused on delivering smarter workflows,
                cleaner systems, stronger visibility, and future-ready tools for
                the people doing the work.
              </p>
            </div>

            <div className="rounded-3xl border border-green-500/30 bg-white/5 p-6 transition hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <div className="text-sm uppercase tracking-[0.2em] text-green-400">
                ― Contact Us ―
              </div>
              <div className="mt-3 text-xl font-bold">
                Professional support from people who understand your workflow.
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Phone: (417) 988-7395
                <br />
                Email: runtwerkx.dev@gmail.com
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={mailtoLink(
                    'File Router Demo Request',
                    'Hello RuntWerkx,%0D%0A%0D%0AI would like to learn more about File Router.'
                  )}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-green-400 hover:text-green-400"
                >
                  Request Info
                  <ArrowUpRight size={14} />
                </a>

                <a
                  href="tel:4179887395"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Call Support
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                ― Testimonials ―
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                What our customers think
              </h2>
              <p className="mt-4 max-w-3xl text-white/70">
                It matters what our users say, here at RuntWerk our intention is
                to offer real world solutions to those who get things done.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.22em] text-green-400">
                  ― What People Actually Want ―
                </p>
                <p className="mt-4 text-base leading-8 text-white/75">
                  “We just need something that helps us move files faster,
                  cleaner, and with less guessing.”
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
                  Workflow-first thinking
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.22em] text-green-400">
                  ― Built For Real Pain Points ―
                </p>
                <p className="mt-4 text-base leading-8 text-white/75">
                  “Most of the wasted time is not the job itself — it’s the
                  repeated clicking, folder digging, and uncertainty around what
                  goes where.”
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
                  Real-world production friction
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.22em] text-green-400">
                  ― Support That Understands ―
                </p>
                <p className="mt-4 text-base leading-8 text-white/75">
                  “Questions about setup, workflow, or product use go to real
                  people who understand the environment this tool was built
                  for.”
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
                  Practical support, not fluff
                </p>
              </div>
            </div>

            <div className="mt-14">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                  ― FAQ ―
                </p>
                <h3 className="mt-3 text-2xl font-bold md:text-3xl">
                  A few quick answers
                </h3>
              </div>

              <FaqFerrisWheel />
            </div>

            <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-lg font-bold text-white">File Router</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  A focused utility for staging, routing, and handling files in
                  a faster, cleaner, more repeatable way.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#pricing"
                    className="inline-flex rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    View Pricing
                  </a>
                  <a
                    href={FILE_ROUTER_BILLING_LINKS.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-green-400 hover:text-green-400"
                  >
                    Billing Portal
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
                  Product
                </h4>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
                  <a href="#pricing" className="transition hover:text-green-400">
                    Pricing
                  </a>
                  <a href="#workflow" className="transition hover:text-green-400">
                    How It Works
                  </a>
                  <a
                    href="#screenshots"
                    className="transition hover:text-green-400"
                  >
                    Screenshots
                  </a>
                  <a
                    href={FILE_ROUTER_PAYMENT_LINKS.monthly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Monthly Checkout
                  </a>
                  <a
                    href={FILE_ROUTER_PAYMENT_LINKS.sixMonth}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    6 Month Checkout
                  </a>
                  <a
                    href={FILE_ROUTER_PAYMENT_LINKS.yearly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Yearly Checkout
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
                  Customer Tools
                </h4>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
                  <a
                    href={FILE_ROUTER_BILLING_LINKS.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Manage Subscription
                  </a>
                  <a
                    href={FILE_ROUTER_BILLING_LINKS.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Billing Portal
                  </a>
                  <a
                    href={FILE_ROUTER_BILLING_LINKS.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Cancel Subscription
                  </a>
                  <a
                    href={mailtoLink(
                      'File Router Support Request',
                      'Hello RuntWerkx,%0D%0A%0D%0AI need help with File Router.'
                    )}
                    className="transition hover:text-green-400"
                  >
                    Support
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
                  Resources
                </h4>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
                  <a
                    href={mailtoLink(
                      'File Router Documentation Request',
                      'Hello RuntWerkx,%0D%0A%0D%0AI would like documentation for File Router.'
                    )}
                    className="transition hover:text-green-400"
                  >
                    Documentation Request
                  </a>
                  <a
                    href={mailtoLink(
                      'File Router Setup Help',
                      'Hello RuntWerkx,%0D%0A%0D%0AI need help getting File Router set up.'
                    )}
                    className="transition hover:text-green-400"
                  >
                    Setup Help
                  </a>
                  <a
                    href={mailtoLink(
                      'File Router Billing Question',
                      'Hello RuntWerkx,%0D%0A%0D%0AI have a billing question about File Router.'
                    )}
                    className="transition hover:text-green-400"
                  >
                    Billing Questions
                  </a>
                  <a
                    href={mailtoLink(
                      'File Router General Inquiry',
                      'Hello RuntWerkx,%0D%0A%0D%0AI have a general question about File Router.'
                    )}
                    className="transition hover:text-green-400"
                  >
                    General Inquiry
                  </a>
                  <Link
                    to="/"
                    className="transition hover:text-green-400"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  RuntWerkx Systems ― File Router ― Built for Industry
                </p>

                <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-white/35">
                  <a
                    href={FILE_ROUTER_BILLING_LINKS.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-green-400"
                  >
                    Manage Subscription
                  </a>
                  <a
                    href={mailtoLink('Privacy Question')}
                    className="transition hover:text-green-400"
                  >
                    Privacy
                  </a>
                  <a
                    href={mailtoLink('Terms Question')}
                    className="transition hover:text-green-400"
                  >
                    Terms
                  </a>
                  <a
                    href={mailtoLink('Cancellation Question')}
                    className="transition hover:text-green-400"
                  >
                    Cancellation
                  </a>
                  <a
                    href={mailtoLink('Support Request')}
                    className="transition hover:text-green-400"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}