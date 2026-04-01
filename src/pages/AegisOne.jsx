import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MetricCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        accent
          ? 'border-green-500/40 bg-green-500/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="text-xs uppercase tracking-[0.25em] text-white/50">{label}</div>
      <div className={`mt-3 text-3xl font-black ${accent ? 'text-green-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}

function ModuleCard({ title, text, delay = 0 }) {
  return (
    <div
      className="rounded-3xl border border-white/10 bg-white/5 p-6 opacity-0 translate-y-6 transition hover:border-green-400/40 hover:bg-white/[0.07] animate-[fadeRise_0.8s_ease-out_forwards]"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-white/65">{text}</p>
    </div>
  )
}

function SidebarItem({ label, active = false }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active
          ? 'border border-green-500/30 bg-green-500/10 text-green-300'
          : 'border border-transparent bg-white/0 text-white/65 hover:border-white/10 hover:bg-white/5 hover:text-white'
      }`}
    >
      {label}
    </div>
  )
}

export default function AegisOne() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main>
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_25%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-16">
            <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/70 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
              <img
                src="/images/AegisOne4.png"
                alt="AegisOne platform visual"
                className="absolute inset-0 h-full w-full object-cover object-center"
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
                    AegisOne
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
                    <a
                      href="#dashboard-preview"
                      className="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:border-green-400 hover:text-green-400"
                    >
                      See Dashboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              ⇼ Core Modules ⇼
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Safety Management Done Right
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1fr]">
            <div className="flex flex-col gap-6">
              <ModuleCard
                title="Incident Management"
                text="Capture incidents fast, track severity, owners, and follow-up actions."
                delay={0.05}
              />

              <ModuleCard
                title="Corrective Actions"
                text="Assign actions, due dates, ownership, and closure verification cleanly."
                delay={0.15}
              />

              <ModuleCard
                title="Training Tracking"
                text="Track required training, status, expirations, and qualification history."
                delay={0.25}
              />
            </div>

            <div
              className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/70 shadow-[0_0_40px_rgba(34,197,94,0.08)] opacity-0 translate-y-6 animate-[fadeRise_0.95s_ease-out_forwards]"
              style={{ animationDelay: '0.12s' }}
            >
              <img
                src="/images/AegisOne4.png"
                alt="AegisOne platform visual"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-xs uppercase tracking-[0.28em] text-green-300">
                  AegisOne Platform
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  Connected Safety Intelligence System
                </div>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                  Incidents, audits, training, corrective actions, and risk visibility all connected
                  into one unified operational system.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <ModuleCard
                title="Audits & Inspections"
                text="Run structured audits, inspections, and observation workflows in one place."
                delay={0.1}
              />

              <ModuleCard
                title="Risk & JSA Tools"
                text="Evaluate hazards, document controls, and connect field risk to system records."
                delay={0.2}
              />

              <ModuleCard
                title="Analytics Dashboard"
                text="Use live metrics to spot trends, backlog pressure, and compliance gaps."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section
          id="dashboard-preview"
          className="border-y border-white/10 bg-white/[0.03]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                Dashboard Preview
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                AegisOne Command Center
              </h2>
              <p className="mt-4 max-w-3xl text-white/70">
                A visual preview of how the platform can feel: live metrics, active items,
                compliance status, and action-driven workflow across the whole safety system.
              </p>
            </div>

            <div className="rounded-[2rem] border border-green-500/20 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-4 shadow-2xl shadow-green-500/10 md:p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/80">
                <div className="grid min-h-[760px] lg:grid-cols-[260px_1fr]">
                  <aside className="border-b border-white/10 bg-white/[0.03] p-4 lg:border-b-0 lg:border-r">
                    <div className="mb-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-green-300">
                        AegisOne
                      </div>
                      <div className="mt-2 text-lg font-bold">Safety OS</div>
                      <div className="mt-1 text-sm text-white/60">
                        Live operations layer
                      </div>
                    </div>

                    <div className="space-y-2">
                      <SidebarItem label="Overview" active />
                      <SidebarItem label="Incidents" />
                      <SidebarItem label="Audits" />
                      <SidebarItem label="Training" />
                      <SidebarItem label="Corrective Actions" />
                      <SidebarItem label="Risk & JSA" />
                      <SidebarItem label="Documents" />
                      <SidebarItem label="Analytics" />
                    </div>

                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                        Site Status
                      </div>
                      <div className="mt-3 text-sm text-white/75">
                        Springfield Fabrication Campus
                      </div>
                      <div className="mt-3 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                        All Systems Normal
                      </div>
                    </div>
                  </aside>

                  <div className="p-4 md:p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.28em] text-green-400">
                          Live Environment
                        </div>
                        <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                          Safety Operations Overview
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                          Shift: Day
                        </div>
                        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">
                          System Healthy
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <MetricCard label="Open Incidents" value="12" accent />
                      <MetricCard label="Audits This Week" value="28" />
                      <MetricCard label="Training Due Soon" value="9" />
                      <MetricCard label="Actions Overdue" value="4" />
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                              Activity Trend
                            </div>
                            <div className="mt-2 text-xl font-bold">30-Day Safety Snapshot</div>
                          </div>
                          <div className="text-sm text-green-400">+8% closure rate</div>
                        </div>

                        <div className="mt-6 flex h-56 items-end gap-3 rounded-2xl border border-white/5 bg-black/40 p-4">
                          {[35, 52, 44, 68, 58, 76, 70, 88, 61, 92, 74, 97].map((h, i) => (
                            <div key={i} className="flex flex-1 flex-col items-center gap-2">
                              <div
                                className="w-full rounded-t-xl bg-gradient-to-t from-green-500/80 to-green-300/80"
                                style={{ height: `${h * 1.5}px` }}
                              />
                              <div className="text-[10px] text-white/35">
                                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                          Priority Queue
                        </div>
                        <div className="mt-2 text-xl font-bold">Active Attention Items</div>

                        <div className="mt-5 space-y-3">
                          {[
                            ['Forklift Near-Miss Review', 'Assigned to Operations', 'High'],
                            ['PPE Audit Follow-Up', 'Due today', 'Medium'],
                            ['LOTO Refresher Training', '8 employees pending', 'Medium'],
                            ['Housekeeping Observation', 'Area C south bay', 'Low'],
                          ].map(([title, sub, level]) => (
                            <div
                              key={title}
                              className="rounded-2xl border border-white/10 bg-black/40 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-semibold">{title}</div>
                                  <div className="mt-1 text-sm text-white/55">{sub}</div>
                                </div>
                                <div
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    level === 'High'
                                      ? 'border border-green-500/30 bg-green-500/15 text-green-300'
                                      : level === 'Medium'
                                      ? 'border border-white/15 bg-white/10 text-white/80'
                                      : 'border border-white/10 bg-white/5 text-white/50'
                                  }`}
                                >
                                  {level}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                          Compliance
                        </div>
                        <div className="mt-2 text-xl font-bold">97.2%</div>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[97.2%] rounded-full bg-green-400" />
                        </div>
                        <p className="mt-3 text-sm text-white/60">
                          Most required items completed and current.
                        </p>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                          Training Status
                        </div>
                        <div className="mt-2 text-xl font-bold">142 / 151 Current</div>
                        <p className="mt-3 text-sm text-white/60">
                          Nine employees need training attention in the next 14 days.
                        </p>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                          Action Velocity
                        </div>
                        <div className="mt-2 text-xl font-bold">23 Closed This Week</div>
                        <p className="mt-3 text-sm text-white/60">
                          Closure performance is trending above prior period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                A system that actually works together
              </h2>
              <p className="mt-4 text-white/70">
                AegisOne is not a pile of disconnected forms. It is a connected operational
                layer where incidents create actions, audits reveal trends, and training status
                supports compliance visibility in one place.
              </p>
            </div>

            <div className="rounded-3xl border border-green-500/30 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-[0.2em] text-green-400">
                System Intelligence
              </div>
              <div className="mt-3 text-xl font-bold">
                Real-time awareness across modules
              </div>
              <p className="mt-2 text-sm text-white/70">
                Built to feel like a modern SaaS platform with live status, shared data,
                and a clear command view for safety teams.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-green-500/30 bg-gradient-to-br from-green-500/10 to-white/5 p-10">
            <h2 className="text-3xl font-bold md:text-4xl">
              Built for real industry teams
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Replace spreadsheets, disconnected tools, and outdated systems with one platform
              that actually works.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
                Get Started
              </button>
              <Link
                to="/"
                className="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:border-green-400 hover:text-green-400"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeRise {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}