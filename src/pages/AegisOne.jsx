import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'

function ModuleAccordionCard({
  module,
  isOpen,
  onToggle,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border transition duration-300 ${
        isOpen
          ? 'border-green-400/50 bg-white/[0.08] shadow-[0_0_28px_rgba(34,197,94,0.14)]'
          : 'border-white/10 bg-white/[0.04] hover:border-green-400/30 hover:bg-white/[0.06]'
      }`}
    >
      {module.image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-55"
            style={{ backgroundImage: `url(${module.image})` }}
          />

          {/* ✅ CLEAN LIGHT OVERLAY (replaced heavy gradient) */}
          <div className="absolute inset-0 bg-black/40" />

          {/* subtle green accent (not grainy) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_40%)]" />
        </>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="relative z-10 flex w-full items-start justify-between gap-6 px-5 py-5 text-left md:px-6"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-green-400">
            {module.eyebrow}
          </div>
          <div className="mt-2 text-xl font-bold md:text-2xl">{module.title}</div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 md:text-base">
            {module.summary}
          </p>
        </div>

        <div
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition ${
            isOpen
              ? 'border-green-400/50 bg-green-500/10 text-green-300'
              : 'border-white/10 bg-white/5 text-white/70'
          }`}
        >
          {isOpen ? '−' : '+'}
        </div>
      </button>

      <div
        className={`relative z-10 grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-green-400">
                  What it does
                </div>
                <p className="mt-3 text-sm leading-8 text-white/70 md:text-base">
                  {module.detail}
                </p>

                <div className="mt-6 text-xs uppercase tracking-[0.24em] text-green-400">
                  Why it matters
                </div>
                <p className="mt-3 text-sm leading-8 text-white/70 md:text-base">
                  {module.why}
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-green-400">
                  Example use
                </div>
                <p className="mt-3 text-sm leading-8 text-white/70 md:text-base">
                  {module.example}
                </p>

                <div className="mt-6 text-xs uppercase tracking-[0.24em] text-green-400">
                  Keywords
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AegisOne() {
  const [parallaxY, setParallaxY] = useState(0)
  const [openModule, setOpenModule] = useState('incident')

  useEffect(() => {
    const handleScroll = () => {
      const offset = Math.min(window.scrollY * 0.18, 80)
      setParallaxY(offset)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const modules = useMemo(
    () => [
      {
        id: 'incident',
        eyebrow: 'Incident Reporting',
        title: 'Incident Management',
        summary:
          'Report workplace incidents, near misses, and safety events quickly while tracking investigations, ownership, status, and closure.',
        detail:
          'Incident Management gives safety teams a structured place to log workplace incidents, near misses, injuries, property damage events, and other operational safety issues. Instead of scattered notes, emails, and spreadsheets, everything is captured in one connected safety record with owners, dates, status, and follow-up visibility.',
        why:
          'Fast, consistent incident reporting improves response time, supports investigations, and makes it easier to identify patterns before they become bigger operational problems.',
        example:
          'A supervisor logs a near miss from the production floor, assigns follow-up tasks, documents root cause findings, and keeps leadership informed until the issue is fully closed.',
        tags: ['incident reporting', 'near misses', 'investigations', 'safety records'],
        image: '/images/incidentreport.png',
      },
      {
        id: 'audits-risk',
        eyebrow: 'Audits, Inspections & Risk',
        title: 'Audits, Inspections & Risk Control',
        summary:
          'Run inspections, observations, audits, and risk reviews in one connected system instead of disconnected forms and spreadsheets.',
        detail:
          'This module combines recurring inspections, field observations, formal audits, hazards, controls, and job safety analysis into one operational workflow. It gives teams a better way to evaluate exposure, document findings, and connect risk information directly to follow-up actions and safety records.',
        why:
          'Bringing inspections and risk controls together improves compliance visibility, reduces duplicate work, and helps teams spot repeating hazards across jobs, areas, and departments.',
        example:
          'A safety coordinator completes a facility inspection, records deficiencies, documents hazard controls, and pushes the open findings into action tracking.',
        tags: ['audits', 'inspections', 'risk management', 'JSA'],
        image: '/images/inspections.png',
      },
      {
        id: 'actions',
        eyebrow: 'Action Tracking',
        title: 'Corrective Actions',
        summary:
          'Assign, track, and verify corrective actions so safety issues are addressed, followed up, and closed without getting lost.',
        detail:
          'Corrective Actions gives teams a formal workflow for assigning follow-up work tied to incidents, inspections, audits, or risk findings. Ownership, due dates, status, and completion history are visible in one place so open issues do not disappear into email chains or verbal handoffs.',
        why:
          'Corrective action tracking is what turns findings into real operational improvement. Without it, incident reviews and inspections create paperwork but not progress.',
        example:
          'After an audit identifies repeated housekeeping issues, actions are assigned to supervisors with due dates and tracked until the problem is verified as corrected.',
        tags: ['corrective actions', 'task tracking', 'ownership', 'follow-up'],
        image: '/images/correctiveaction.png',
      },
      {
        id: 'training',
        eyebrow: 'Training & Qualifications',
        title: 'Training Tracking',
        summary:
          'Track employee training status, qualifications, expirations, and upcoming requirements so the workforce stays current and visible.',
        detail:
          'Training Tracking helps organizations manage workforce qualification history, required training completion, expiration dates, refresher needs, and visibility into who is current or overdue. It creates a cleaner operational record than scattered spreadsheets or disconnected HR notes.',
        why:
          'Training visibility supports compliance, reduces surprises, and helps keep teams prepared for audits, customer requirements, and day-to-day operational readiness.',
        example:
          'A manager reviews which employees are nearing forklift certification expiration and schedules refresher training before those qualifications lapse.',
        tags: ['training records', 'qualifications', 'expirations', 'workforce readiness'],
        image: '/images/trainingrecord.png',
      },
      {
        id: 'analytics',
        eyebrow: 'Analytics & Visibility',
        title: 'Analytics Dashboard',
        summary:
          'Monitor safety trends, overdue actions, incident patterns, and compliance performance with a live operational dashboard.',
        detail:
          'Analytics Dashboard turns raw safety activity into usable visibility. It gives leadership and safety teams a live view of incident trends, backlog pressure, overdue actions, inspection performance, and compliance signals so they can make better decisions without digging through disconnected reports.',
        why:
          'Data only matters if it helps teams act. A live dashboard helps organizations spot trends early, focus effort where it matters, and communicate performance clearly.',
        example:
          'Leadership reviews incident frequency, overdue corrective actions, and inspection completion rates in one dashboard before the weekly operations meeting.',
        tags: ['analytics dashboard', 'safety trends', 'KPIs', 'operational visibility'],
        image: '/images/riskmatrix.png',
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[2200px] overflow-hidden">
          <div
            className="absolute inset-x-[-6%] top-0 h-[1850px] opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(34,197,94,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.18) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
              animation: 'gridDriftAegis 26s linear infinite',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.96) 52%, rgba(0,0,0,0.58) 76%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.96) 52%, rgba(0,0,0,0.58) 76%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div className="absolute inset-x-0 top-0 h-[1950px] bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_42%)]" />
        </div>

        <section className="relative z-10 overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_25%)]" />

            <div
              className="absolute inset-[-6%] opacity-[0.10]"
              style={{
                transform: `translate3d(0, ${parallaxY * 0.35}px, 0)`,
                backgroundImage:
                  'linear-gradient(rgba(34,197,94,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.22) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
                animation: 'gridDriftAegis 22s linear infinite',
                willChange: 'transform, background-position',
              }}
            />

            <div
              className="absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-green-500/20 blur-[110px]"
              style={{
                transform: `translate3d(0, ${parallaxY * 0.45}px, 0)`,
                animation: 'orbFloatAegis 9s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute right-[-5rem] bottom-[-6rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]"
              style={{
                transform: `translate3d(0, ${-parallaxY * 0.25}px, 0)`,
                animation: 'orbFloatAegisTwo 12s ease-in-out infinite',
                willChange: 'transform',
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-16">
            <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/70 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
              <img
                src="/images/AegisOne4.png"
                alt="AegisOne platform visual"
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{
                  transform: `translate3d(0, ${parallaxY * 0.12}px, 0) scale(1.02)`,
                  willChange: 'transform',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_25%)]" />
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative z-10 flex min-h-[420px] items-end md:min-h-[520px]">
                <div className="w-full px-8 pb-10 md:px-12 md:pb-14">
                  <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                    Safety Platform
                  </p>

                  <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
                    Industrial Safety Management & EHS
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg text-white/75">
                    A modular, enterprise-grade safety management system built for real operations.
                    Incidents, audits, training, risk, and corrective actions connected into one
                    intelligent platform.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <button className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
                      Request Demo
                    </button>
                    <button className="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:border-green-400 hover:text-green-400">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              ⇼ Safety Management Software ⇼
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              Industrial Safety Management Software Built For Real-World Operational Challenges
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
              AegisOne is industrial safety management software built for manufacturing,
              fabrication, and industrial operations. It connects incident reporting, audits and
              inspections, corrective actions, training records, risk management, and analytics
              into one operational system so teams can reduce paperwork, improve visibility, and
              move faster with better control.
            </p>
          </div>

          <div className="mt-12">
            <div className="relative overflow-hidden rounded-[2rem] border border-green-500/25 bg-black/70 shadow-[0_0_45px_rgba(34,197,94,0.08)]">
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_20%)]" />

              <div className="relative z-10 px-6 py-6 md:px-8 md:py-8">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-green-400">
                      ⇼ Core Modules ⇼
                    </div>
                    <h3 className="mt-3 text-2xl font-bold md:text-4xl">
                      Explore The Core Safety Management Modules Inside AegisOne
                    </h3>
                  </div>

                  <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-300">
                    ⇼ Working Prototype ⇼
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-8 text-white/68 md:text-base">
                  The screenshot shows the real command surface. Below it, the key modules are laid
                  out in a clear vertical format so visitors can quickly understand what each part
                  of the platform does and how it supports industrial safety management workflows.
                </p>

                <div className="mt-8 relative overflow-hidden rounded-[1.8rem] border border-green-500/20 bg-black">
                  <img
                    src="/images/AegisOnePrototype.png"
                    alt="AegisOne safety management dashboard screenshot"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="relative z-10 min-h-[440px] md:min-h-[540px]" />
                </div>

                <div className="mt-10 space-y-4">
                  {modules.map((module) => (
                    <ModuleAccordionCard
                      key={module.id}
                      module={module}
                      isOpen={openModule === module.id}
                      onToggle={() =>
                        setOpenModule((current) => (current === module.id ? null : module.id))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes gridDriftAegis {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 0 42px, 42px 0;
          }
        }

        @keyframes orbFloatAegis {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, 12px, 0);
          }
        }

        @keyframes orbFloatAegisTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-16px, -14px, 0);
          }
        }
      `}</style>
    </div>
  )
}