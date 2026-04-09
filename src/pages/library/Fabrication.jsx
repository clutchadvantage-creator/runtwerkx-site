import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  ArrowRight,
  BookOpen,
  Cable,
  Cog,
  Cpu,
  ExternalLink,
  Factory,
  FileText,
  FolderKanban,
  Gauge,
  Hammer,
  HardHat,
  Package,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'

const HERO_VIDEO_SRC = '/videos/fabrication-bg.mp4'

const fabricationDisciplines = [
  {
    title: 'Structural Steel',
    description:
      'Standards, fit-up practices, connection prep, member handling, weld planning, and downstream erection coordination.',
    icon: Hammer,
  },
  {
    title: 'Plate Fabrication',
    description:
      'Plate layout, beveling, forming, cut quality, prep control, distortion awareness, and heavy fabrication workflow discipline.',
    icon: Ruler,
  },
  {
    title: 'Welding',
    description:
      'Process selection, filler matching, WPS use, preheat discipline, inspection thinking, and weld-sequence planning.',
    icon: ShieldCheck,
  },
  {
    title: 'CNC / Cutting',
    description:
      'Programming handoff, nesting, lead-ins, kerf awareness, consumables care, cut quality checks, and machine utilization.',
    icon: Cog,
  },
  {
    title: 'Robotics / Automation',
    description:
      'Robotic welding, automated coping, beam lines, material handling automation, and fabrication cell integration.',
    icon: Cpu,
  },
  {
    title: 'Fit-Up / Assembly',
    description:
      'Assembly logic, reference control, dimensional verification, clamp strategy, and sequence choices that reduce rework.',
    icon: FolderKanban,
  },
]

const calculatorsAndTools = [
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
      'Calculate stock and shape weights for estimating, rigging plans, nesting decisions, and production use.',
    status: 'Live',
    to: '/knowledge-library/calculators-charts-conversions/material-weight-calculator',
  },
  {
    title: 'Shop Math Calculator',
    description:
      'Quick fabrication math support for layout, dimensions, percentages, and general shop calculation work.',
    status: 'Live',
    to: '/knowledge-library/calculators-charts-conversions/shop-math-calculator',
  },
]

const processStartingPoints = [
  {
    title: 'GMAW Short Circuit Start Point',
    description:
      'Carbon steel, 0.035 ER70S-6, 75/25 gas, roughly 1/8 to 1/4 inch material.',
    details: ['Voltage: 18 to 20.5 V', 'Wire feed: 250 to 325 ipm', 'Polarity: DCEP', 'Use as a machine-specific starting point only and confirm with your WPS and machine manual.'],
  },
  {
    title: 'FCAW Dual Shield Start Point',
    description:
      'Structural steel fabrication with 0.045 E71T-1 and 75/25 shielding gas.',
    details: ['Voltage: 24 to 28 V', 'Wire feed: 275 to 375 ipm', 'Polarity: DCEP', 'Verify travel speed, CTWD, and preheat against your procedure before production welding.'],
  },
  {
    title: 'Plasma Cut Quality Check',
    description:
      'For profile and plate cutting, quality usually shows up first in edge condition before it shows up in downstream fit-up.',
    details: ['Check bevel angle drift', 'Watch dross level and pierce splash', 'Verify hole roundness and web detail quality', 'Review consumables and torch height before blaming the file.'],
  },
  {
    title: 'Saw and Drill Line Discipline',
    description:
      'A clean fabrication line depends more on material prep and reference consistency than on downstream heroics.',
    details: ['Confirm datum strategy', 'Verify stop condition and clamp stability', 'Check tooling wear before dimension drift becomes normal', 'Tie machine output back to the drawing revision and label flow.'],
  },
]

const officialResources = [
  {
    title: 'OSHA Fabrication-Relevant References',
    description: 'Machine guarding, welding, material handling, PPE, ventilation, and general industry safety references used in fabrication shops.',
    href: 'https://www.osha.gov',
    type: 'Agency',
  },
  {
    title: 'AWS Standards and Welding Resources',
    description: 'Welding codes, qualification, workmanship, inspection, filler-metal information, and education resources.',
    href: 'https://www.aws.org/standards',
    type: 'Standards body',
  },
  {
    title: 'AISC Steel Construction Resources',
    description: 'Steel construction specifications, structural references, fabrication guidance, and industry publications.',
    href: 'https://www.aisc.org',
    type: 'Industry institute',
  },
  {
    title: 'ASME Codes and Standards',
    description: 'Mechanical, pressure-system, piping, and equipment codes relevant to industrial and heavy fabrication work.',
    href: 'https://www.asme.org/codes-standards',
    type: 'Standards body',
  },
  {
    title: 'ANSI Standards System',
    description: 'Consensus standards activity and standards coordination that often intersects fabrication equipment and safety expectations.',
    href: 'https://www.ansi.org',
    type: 'Standards body',
  },
  {
    title: 'NFPA Codes and Standards',
    description: 'Hot work, fire protection, electrical safety, egress, and life-safety references used around fabrication environments.',
    href: 'https://www.nfpa.org/codes-and-standards',
    type: 'Standards body',
  },
  {
    title: 'FMA Fabrication Industry Resources',
    description: 'Trade association resources focused on metal fabrication operations, forming, cutting, and shop improvement.',
    href: 'https://www.fmamfg.org',
    type: 'Trade association',
  },
  {
    title: 'FABTECH',
    description: 'Major fabrication-industry event and vendor ecosystem useful for equipment research, process updates, and supplier discovery.',
    href: 'https://www.fabtechexpo.com',
    type: 'Industry event',
  },
]

const oemGroups = [
  {
    title: 'Welding and Power Sources',
    items: [
      { name: 'Miller Electric', href: 'https://www.millerwelds.com', note: 'Power sources, feeders, PPE, consumables guidance, and welding support material.' },
      { name: 'Lincoln Electric', href: 'https://www.lincolnelectric.com', note: 'Welding systems, wire, automation, procedures, and fabrication support resources.' },
      { name: 'ESAB', href: 'https://www.esab.com', note: 'Welding and cutting systems, automation, filler metals, and process support.' },
      { name: 'OTC DAIHEN', href: 'https://www.daihen-usa.com', note: 'Robotic welding systems, welding power sources, and automation equipment.' },
    ],
  },
  {
    title: 'Structural and Plate Machinery',
    items: [
      { name: 'Peddinghaus', href: 'https://www.peddinghaus.com', note: 'Beam lines, plate processing, drilling, sawing, and structural fabrication systems.' },
      { name: 'Ocean Machinery', href: 'https://oceanmachinery.com', note: 'Drill lines, saws, coping, angle lines, and structural-steel machinery.' },
      { name: 'Pacific Press', href: 'https://www.pacific-press.com', note: 'Press brakes, shears, and forming equipment.' },
      { name: 'Voortman', href: 'https://www.voortman.net', note: 'Structural and plate processing machinery for fabrication shops.' },
    ],
  },
  {
    title: 'Coping, Cutting, and Automation',
    items: [
      { name: 'HGG', href: 'https://www.hgg-group.com', note: '3D profiling, coping, and robotic cutting systems.' },
      { name: 'Kinetic', href: 'https://kineticusa.com', note: 'Thermal cutting tables and integrated plate processing solutions.' },
      { name: 'Controlled Automation', href: 'https://controlledautomation.com', note: 'Structural beam drilling, cutting, and fabrication automation equipment.' },
      { name: 'AKYAPAK', href: 'https://www.akyapak.com', note: 'Plate rolls, drilling lines, angle lines, and fabrication machinery.' },
    ],
  },
]

const roboticsCompanies = [
  {
    name: 'AGT Robotics',
    href: 'https://www.agtrobotics.com',
    note: 'Robotic welding and advanced automation systems for structural and heavy fabrication environments.',
  },
  {
    name: 'Pemamek',
    href: 'https://www.pemamek.com',
    note: 'Welding automation, fit-up stations, and production lines for heavy fabrication.',
  },
  {
    name: 'Yaskawa Motoman',
    href: 'https://www.motoman.com',
    note: 'Industrial robotics used widely across robotic welding and fabrication cells.',
  },
  {
    name: 'FANUC America',
    href: 'https://www.fanucamerica.com',
    note: 'Robotic welding and industrial automation used in fabrication and manufacturing cells.',
  },
  {
    name: 'ABB Robotics',
    href: 'https://new.abb.com/products/robotics',
    note: 'Industrial robotic platforms, welding automation, and integrated production systems.',
  },
  {
    name: 'KUKA',
    href: 'https://www.kuka.com',
    note: 'Automation and robotic platforms used in high-throughput fabrication and production environments.',
  },
]

const supplyGroups = [
  {
    title: 'PPE and Safety Gear',
    icon: HardHat,
    items: [
      { name: '3M Personal Safety', href: 'https://www.3m.com/3M/en_US/p/c/ppe/', note: 'Respiratory, eye, hearing, and general safety gear.' },
      { name: 'Honeywell Industrial Safety', href: 'https://automation.honeywell.com/us/en/products/personal-protective-equipment', note: 'General industrial PPE and safety products.' },
      { name: 'Grainger', href: 'https://www.grainger.com', note: 'Broad supplier for PPE, safety gear, tools, and shop consumables.' },
    ],
  },
  {
    title: 'Wire, Filler, Leads, and Welding Accessories',
    icon: Cable,
    items: [
      { name: 'Lincoln Electric Consumables', href: 'https://www.lincolnelectric.com/en/products/consumable', note: 'Wire, stick electrodes, fluxes, and welding accessories.' },
      { name: 'Miller Accessories', href: 'https://www.millerwelds.com/accessories', note: 'Leads, guns, helmets, feeders, and support accessories.' },
      { name: 'Weldfabulous', href: 'https://www.weldfabulous.com', note: 'Online supplier for wire, PPE, leads, consumables, and fabrication gear.' },
    ],
  },
  {
    title: 'Gas and Industrial Supply',
    icon: Package,
    items: [
      { name: 'Airgas', href: 'https://www.airgas.com', note: 'Shielding gas, welding supplies, PPE, and industrial distribution.' },
      { name: 'Linde', href: 'https://www.lindedirect.com', note: 'Industrial gases and process support for fabrication shops.' },
      { name: 'Matheson', href: 'https://www.mathesongas.com', note: 'Industrial gas supply and specialty gas support.' },
    ],
  },
  {
    title: 'Tools and Shop Support',
    icon: Wrench,
    items: [
      { name: 'MSC Industrial Supply', href: 'https://www.mscdirect.com', note: 'Cutting tools, abrasives, measuring tools, shop supplies, and tooling.' },
      { name: 'Fastenal', href: 'https://www.fastenal.com', note: 'Fasteners, safety, tooling, abrasives, and general fabrication support.' },
      { name: 'Acme Tools', href: 'https://www.acmetools.com', note: 'Power tools, cordless platforms, site gear, and shop-support tooling.' },
    ],
  },
]

const bestPractices = [
  {
    title: 'Drawings and revision control',
    points: [
      'Do not let cut, fit, or weld work outrun drawing revision control.',
      'Mark the active revision at the machine and assembly station, not just in the office.',
      'If a fabrication issue repeats, check release discipline before blaming the crew.',
    ],
  },
  {
    title: 'Fit-up and sequence discipline',
    points: [
      'Strong fit-up reduces rework, weld volume, distortion, and downstream field pain.',
      'Sequence clamps, tacks, and weld passes based on distortion behavior, not habit alone.',
      'Stop forcing parts together when the mismatch suggests an upstream error.',
    ],
  },
  {
    title: 'Machine and consumables care',
    points: [
      'Cut quality, drill accuracy, and weld consistency usually degrade before outright failure occurs.',
      'Consumable condition is part of process control, not an afterthought.',
      'If output keeps drifting, look at maintenance, gas delivery, grounding, and staging before reprogramming everything.',
    ],
  },
]

const resourceFinderCategories = ['All', 'Official Docs', 'OEMs', 'Robotics', 'Suppliers', 'Tools']

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'finder', label: 'Resource Finder' },
  { id: 'disciplines', label: 'Disciplines' },
  { id: 'charts', label: 'Charts & Settings' },
  { id: 'tools', label: 'Tools' },
  { id: 'docs', label: 'Official Docs' },
  { id: 'oems', label: 'OEMs' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'supplies', label: 'Supplies' },
  { id: 'practices', label: 'Practices' },
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

function DisciplineCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>
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

function ProcessCard({ item }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/68">{item.description}</p>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-left">
        <ul className="space-y-2 text-sm leading-6 text-white/72">
          {item.details.map((detail) => (
            <li key={detail} className="flex gap-3">
              <span className="font-bold text-green-400">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LinkCard({ title, description, href, eyebrow }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]"
    >
      <div className="flex flex-col items-center gap-3">
        <ExternalLink className="h-4 w-4 text-green-400" />
        <div>
          {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">{eyebrow}</div> : null}
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
        </div>
      </div>
    </a>
  )
}

function SupplierGroupCard({ group }) {
  const Icon = group.icon ?? Factory

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 transition duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-300">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-bold text-white">{group.title}</h3>
      </div>
      <div className="mt-5 grid gap-3">
        {group.items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 bg-black/35 p-4 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-white">{item.name}</div>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.note}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-green-400" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function BestPracticeCard({ item }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 transition duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="flex items-center gap-3">
        <BadgeCheck className="h-5 w-5 text-green-400" />
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-white/72">
        {item.points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="font-bold text-green-400">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResourceFinder({ resources }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const categoryMatch = category === 'All' || resource.category === category
      const haystack = [resource.title, resource.description, resource.note ?? '', resource.eyebrow ?? '']
        .join(' ')
        .toLowerCase()
      const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery)
      return categoryMatch && queryMatch
    })
  }, [category, query, resources])

  return (
    <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
      <SectionHeader
        id="finder"
        eyebrow="― Resource Finder ―"
        title="Search fabrication docs, suppliers, machine makers, and support resources"
        description="Use the finder to jump quickly into official references, OEMs, robotics vendors, supply sources, and live fabrication utilities."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search AWS, Miller, Peddinghaus, PPE, wire, gas, robotics..."
            className="w-full rounded-2xl border border-green-400/20 bg-black/50 py-3 pl-11 pr-4 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {resourceFinderCategories.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === value
                  ? 'border-green-400/35 bg-green-500/15 text-green-300'
                  : 'border-white/10 bg-black/35 text-white/70 hover:border-green-400/25 hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          resource.to ? (
            <Link
              key={resource.title}
              to={resource.to}
              className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">{resource.category}</div>
              <h3 className="mt-3 text-xl font-bold text-white">{resource.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{resource.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-300">
                Open Resource
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ) : (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">{resource.category}</div>
              <h3 className="mt-3 text-xl font-bold text-white">{resource.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{resource.description}</p>
              {resource.note ? <p className="mt-3 text-sm leading-6 text-white/55">{resource.note}</p> : null}
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-300">
                Open Link
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
          )
        ))}
      </div>
    </section>
  )
}

export default function Fabrication() {
  const [activeSection, setActiveSection] = useState('overview')

  const finderResources = useMemo(
    () => [
      ...officialResources.map((item) => ({
        title: item.title,
        description: item.description,
        href: item.href,
        category: 'Official Docs',
        note: item.type,
      })),
      ...calculatorsAndTools
        .filter((item) => item.to)
        .map((item) => ({
          title: item.title,
          description: item.description,
          to: item.to,
          category: 'Tools',
        })),
      ...oemGroups.flatMap((group) =>
        group.items.map((item) => ({
          title: item.name,
          description: item.note,
          href: item.href,
          category: 'OEMs',
        }))
      ),
      ...roboticsCompanies.map((item) => ({
        title: item.name,
        description: item.note,
        href: item.href,
        category: 'Robotics',
      })),
      ...supplyGroups.flatMap((group) =>
        group.items.map((item) => ({
          title: item.name,
          description: item.note,
          href: item.href,
          category: 'Suppliers',
        }))
      ),
    ],
    []
  )

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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <video
        src={HERO_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover"
      />

      <div className="fixed inset-0 z-0 bg-black/72" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_32%),linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.88))]" />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_18%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -left-20 top-[-3rem] h-72 w-72 rounded-full bg-green-500/12 blur-[110px]" />
        <div className="absolute right-[-5rem] top-[2rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]" />
      </div>

      <main className="relative z-10 overflow-hidden">

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
                  Built for fabrication teams
                </div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  This page now acts as a fabrication industry reference center with practical process guidance, official documentation, OEM links, robotics resources, and shop-support supplier paths.
                </p>
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="overview"
                  eyebrow="― Fabrication Overview ―"
                  title="A dedicated fabrication industry resource center"
                  description="Fabrication touches drawings, standards, settings, machines, consumables, safety controls, and supplier decisions every day. This page is built to gather the parts that actually matter into one usable destination for shops, estimators, programmers, fitters, welders, and supervisors."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
                    <BookOpen className="mx-auto h-6 w-6 text-green-400" />
                    <div className="mt-4 text-sm font-semibold text-white">Official Docs and Standards</div>
                    <p className="mt-2 text-sm leading-7 text-white/65">AWS, AISC, ASME, ANSI, NFPA, OSHA, and trade resources tied directly to fabrication work.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
                    <Gauge className="mx-auto h-6 w-6 text-green-400" />
                    <div className="mt-4 text-sm font-semibold text-white">Charts, Settings, and Starting Points</div>
                    <p className="mt-2 text-sm leading-7 text-white/65">Common process starting points and production checks that help crews get into the right range faster.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
                    <Factory className="mx-auto h-6 w-6 text-green-400" />
                    <div className="mt-4 text-sm font-semibold text-white">Suppliers, OEMs, and Automation</div>
                    <p className="mt-2 text-sm leading-7 text-white/65">Machine makers, robotics companies, welding brands, PPE sources, gas suppliers, and shop-support vendors.</p>
                  </div>
                </div>
              </section>

              <ResourceFinder resources={finderResources} />

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="disciplines"
                  eyebrow="― Disciplines ―"
                  title="Explore key fabrication disciplines"
                  description="Each discipline below drives different standards, suppliers, processes, and machine choices. Use them as the backbone for how you organize the work and the reference material around it."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {fabricationDisciplines.map((item) => (
                    <DisciplineCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="charts"
                  eyebrow="― Charts & Settings ―"
                  title="Process charts and standard starting points"
                  description="These are practical starting references for fabrication teams, not universal one-size-fits-all answers. Final settings, procedures, and acceptance criteria should always match the active WPS, machine manual, material condition, and code requirements."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  {processStartingPoints.map((item) => (
                    <ProcessCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="tools"
                  eyebrow="― Tools & Calculators ―"
                  title="Practical tools built for real fabrication work"
                  description="Use the live fabrication utilities below for shop math, drill data, production planning, and stock-weight support instead of hunting through disconnected references."
                />

                <div className="mt-12 grid gap-6">
                  {calculatorsAndTools.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="docs"
                  eyebrow="― Official Docs ―"
                  title="Trusted documentation and official fabrication references"
                  description="These links are the serious reference layer for fabrication: code bodies, trade groups, safety agencies, and industry resources professionals actually use to support decisions."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  {officialResources.map((item) => (
                    <LinkCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                      eyebrow={item.type}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="oems"
                  eyebrow="― OEMs & Machine Makers ―"
                  title="Major fabrication equipment and machine-maker links"
                  description="Use these to reach the major brands and machine makers fabrication shops often rely on for support, documentation, accessories, machine capability reviews, and purchasing research."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {oemGroups.map((group) => (
                    <SupplierGroupCard key={group.title} group={group} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="robotics"
                  eyebrow="― Robotics & Automation ―"
                  title="Automation and robotic fabrication companies worth tracking"
                  description="Robotics in fabrication is no longer a side conversation. These companies cover robotic welding, cutting, handling, and automation systems used across modern fabrication environments."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {roboticsCompanies.map((company) => (
                    <LinkCard
                      key={company.name}
                      title={company.name}
                      description={company.note}
                      href={company.href}
                      eyebrow="Robotics Company"
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="supplies"
                  eyebrow="― PPE, Consumables & Supplies ―"
                  title="Where fabrication shops source the daily essentials"
                  description="This section is for the gear and support items shops use constantly: PPE, wire, leads, gas, tooling, abrasives, hand tools, and general fabrication consumables."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  {supplyGroups.map((group) => (
                    <SupplierGroupCard key={group.title} group={group} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader
                  id="practices"
                  eyebrow="― Best Practices ―"
                  title="Shop practices that usually separate strong fabrication flow from constant rework"
                  description="Good fabrication performance depends on more than machines and settings. These are the operating disciplines that keep drawings, material, machines, welds, and downstream handoffs aligned."
                />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {bestPractices.map((item) => (
                    <BestPracticeCard key={item.title} item={item} />
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