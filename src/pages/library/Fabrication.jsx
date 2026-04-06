import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import {
  Wrench,
  FolderKanban,
  BookOpen,
  ShieldCheck,
  Hammer,
  Cpu,
  Ruler,
  Cog,
  ArrowRight,
  FileText,
  ExternalLink,
} from 'lucide-react'

const HERO_VIDEO_SRC = '/videos/fabrication-bg.mp4'

const disciplines = [
  {
    title: 'Structural Steel',
    description:
      'References, workflows, tools, and fabrication resources for structural steel operations and production environments.',
    icon: Hammer,
  },
  {
    title: 'Plate Fabrication',
    description:
      'Layouts, fit-up references, processing guidance, and workflow support for plate-based fabrication work.',
    icon: Ruler,
  },
  {
    title: 'Welding',
    description:
      'Weld-related tools, practical guidance, code references, and support content for shop and field welding.',
    icon: ShieldCheck,
  },
  {
    title: 'CNC / Cutting',
    description:
      'Resources for cutting systems, file prep, process considerations, and shop-floor production flow.',
    icon: Cog,
  },
  {
    title: 'Robotics / Automation',
    description:
      'Guidance, references, and future tools centered around automation, robotics, and connected fabrication systems.',
    icon: Cpu,
  },
  {
    title: 'Fit-Up / Assembly',
    description:
      'Assembly logic, layout thinking, sequencing, and field-tested fabrication knowledge for getting parts together right.',
    icon: FolderKanban,
  },
]

const tools = [
  {
    title: 'Tap & Drill Workbook',
    description:
      'Quick access to tap drill sizing and reference data for fabrication and shop-floor use.',
    status: 'Live',
    to: '/knowledge-library/calculators-charts-conversions/tap-drill-chart',
  },
  {
    title: 'Production Rate Calculator',
    description:
      'Estimate throughput, shift output, and planning targets for real fabrication workflows.',
    status: 'Live',
    to: '/knowledge-library/calculators-charts-conversions/production-rate-calculator',
  },
  {
    title: 'Material Weight Calculator',
    description:
      'Calculate stock and shape weights for estimating, planning, and production use.',
    status: 'Coming Soon',
  },
  {
    title: 'Bolt / Fastener Reference',
    description:
      'Fastener-oriented lookups and support references for install and fabrication planning.',
    status: 'Planned',
  },
]

const references = [
  {
    title: 'OSHA References',
    description:
      'Safety-related official documentation and regulatory references relevant to fabrication environments.',
  },
  {
    title: 'AWS / Welding Resources',
    description:
      'Official and industry-recognized welding documentation, codes, and process guidance.',
  },
  {
    title: 'AISC / Structural References',
    description:
      'Steel construction and structural reference material useful to fabrication teams and planners.',
  },
  {
    title: 'Equipment / Manufacturer Docs',
    description:
      'A future home for machine manuals, support documentation, and trusted fabrication equipment references.',
  },
]

const fieldNotes = [
  'Why fit-up quality changes everything downstream',
  'Common causes of avoidable rework in fabrication flow',
  'Where digital shop tools actually save time in the real world',
]

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'featured', label: 'Featured Systems' },
  { id: 'disciplines', label: 'Disciplines' },
  { id: 'tools', label: 'Tools & Calculators' },
  { id: 'references', label: 'Documentation & Links' },
  { id: 'field-notes', label: 'Field Notes' },
]

function SectionHeader({ eyebrow, title, description, id }) {
  return (
    <div id={id} className="mx-auto max-w-4xl text-center scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
        {description}
      </p>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-7 text-white/65">{description}</p>
    </div>
  )
}

function ToolCard({ tool }) {
  const isLive = tool.status === 'Live' && !!tool.to
  const Wrapper = isLive ? Link : 'div'

  return (
    <Wrapper
      {...(isLive ? { to: tool.to } : {})}
      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/50 p-5 transition duration-300 ${
        isLive
          ? 'cursor-pointer hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_24px_rgba(34,197,94,0.10)]'
          : 'hover:border-white/15'
      }`}
    >
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            Fabrication Utility
          </div>

          <div
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isLive
                ? 'border border-green-400/30 bg-green-500/10 text-green-300'
                : 'border border-white/10 bg-white/[0.04] text-white/45'
            }`}
          >
            {tool.status}
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-white">{tool.title}</h3>

        <p className="mt-4 text-sm leading-7 text-white/68">{tool.description}</p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/40">
          {isLive ? 'Interactive utility available' : 'Expandable utility slot'}
        </div>
      </div>
    </Wrapper>
  )
}

function DisciplineCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-300">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>
    </div>
  )
}

function ReferenceCard({ title, description }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="flex flex-col items-center gap-3">
        <ExternalLink className="h-4 w-4 text-green-400" />

        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
        </div>
      </div>
    </div>
  )
}

function FieldNoteCard({ note }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 text-center transition duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <p className="text-sm leading-7 text-white/68">{note}</p>
    </div>
  )
}

export default function Fabrication() {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const elements = sectionLinks
      .map((section) => document.getElementById(section.id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.15, 0.3, 0.5, 0.7],
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_32%),linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.88))]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_18%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -left-20 top-[-3rem] h-72 w-72 rounded-full bg-green-500/12 blur-[110px]" />
          <div className="absolute right-[-5rem] top-[2rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]" />
        </div>

        <section className="relative z-10 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
            <div className="mx-auto max-w-5xl rounded-[2rem] bg-black/55 px-6 py-12 text-center backdrop-blur-[2px] md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.30em] text-green-400">
                ― Current Location ―
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                Fabrication
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                A structured fabrication resource hub built to connect tools,
                documentation, references, and discipline-focused knowledge into
                one growing industrial system.
              </p>

              <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-white/60">
                Explore fabrication utilities, practical reference paths,
                discipline categories, official documentation, and field-driven
                knowledge designed to support real-world work across shop,
                production, and operations environments.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12 lg:py-14">
            <aside className="h-fit rounded-[1.75rem] border border-green-500/15 bg-zinc-950/70 p-5 shadow-[0_0_35px_rgba(34,197,94,0.08)] backdrop-blur-sm">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                ― Fabrication Navigation ―
              </div>

              <nav className="mt-6 space-y-3">
                {sectionLinks.map((section) => {
                  const isActive = activeSection === section.id

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`group flex items-center justify-center gap-3 rounded-full border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition duration-300 ${
                        isActive
                          ? 'border-green-400/35 bg-white/[0.08] text-white shadow-[0_0_18px_rgba(34,197,94,0.14)]'
                          : 'border-white/10 bg-white/[0.04] text-green-300 hover:-translate-y-0.5 hover:border-green-400/30 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition duration-300 ${
                          isActive
                            ? 'bg-green-300 shadow-[0_0_12px_rgba(134,239,172,0.95)]'
                            : 'bg-green-500/40 group-hover:bg-green-300/80'
                        }`}
                      />
                      <span>{section.label}</span>
                      <ArrowRight
                        className={`h-4 w-4 transition duration-300 ${
                          isActive ? 'text-green-200' : 'text-green-400'
                        }`}
                      />
                    </a>
                  )
                })}
              </nav>

              <div className="mt-6 rounded-[1.5rem] border border-green-500/15 bg-black/40 p-4 text-center">
                <div className="text-sm font-semibold text-white">
                  Built for expansion
                </div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  This page is designed to grow into a larger connected
                  fabrication information system with deeper references, tools,
                  categories, and documentation over time.
                </p>
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="overview"
                  eyebrow="― Fabrication Overview ―"
                  title="A dedicated knowledge system for fabrication work"
                  description="Fabrication covers workflows, processes, references, machines, materials, and real-world execution. This page is being built to organize that into a cleaner, more usable, and more valuable system."
                />
              </section>

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="featured"
                  eyebrow="― Featured Systems ―"
                  title="A connected hub for tools, references, and disciplines"
                  description="The fabrication page is designed to bring together the kinds of resources professionals actually need: useful tools, official references, focused categories, and practical field-driven knowledge."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  <FeatureCard
                    title="Tools & Calculators"
                    description="Practical fabrication tools designed for real-world use instead of filler content."
                  />
                  <FeatureCard
                    title="Official References"
                    description="Curated documentation and trusted links that help make this a serious destination."
                  />
                  <FeatureCard
                    title="Fabrication Disciplines"
                    description="Dedicated paths for specialties, processes, and support content across fabrication work."
                  />
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="disciplines"
                  eyebrow="― Disciplines ―"
                  title="Explore key fabrication disciplines"
                  description="Each area below can later expand into its own dedicated section with tools, references, links, notes, and discipline-specific support content."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {disciplines.map((item) => (
                    <DisciplineCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="tools"
                  eyebrow="― Tools & Calculators ―"
                  title="Practical tools built for real fabrication work"
                  description="These utilities are meant to become direct-use entries into the larger fabrication system, giving professionals quick access to the tools they actually use."
                />

                <div className="mt-12 grid gap-6">
                  {tools.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="references"
                  eyebrow="― Documentation & Links ―"
                  title="Trusted references and official documentation"
                  description="This section is intended for official resources, standards, documentation libraries, manufacturer references, and serious support material fabrication professionals actually use."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  {references.map((item) => (
                    <ReferenceCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="field-notes"
                  eyebrow="― Field Notes ―"
                  title="Real-world fabrication thinking belongs here too"
                  description="Over time, this area can house short practical writeups, lessons, support notes, workflow observations, and useful insights pulled from real fabrication experience."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {fieldNotes.map((note) => (
                    <FieldNoteCard key={note} note={note} />
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <Link
                    to="/knowledge-library"
                    className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-green-300 transition duration-300 hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-500/[0.10] hover:text-white hover:shadow-[0_0_18px_rgba(34,197,94,0.12)]"
                  >
                    Return to Knowledge Library
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}