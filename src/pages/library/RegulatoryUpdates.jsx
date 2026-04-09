import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertTriangle, CalendarClock, CheckCircle2, Search, Shield } from 'lucide-react'
import LibraryPageLayout from './LibraryPageLayout'
import {
  addPdfChecklistSection,
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  toPdfFileName,
} from '../../utils/pdfExport'

const regulatoryProfiles = [
  {
    id: 'construction-fabrication',
    title: 'Construction and Fabrication',
    description: 'Steel work, welding, cranes, fall protection, and site-safety rule activity.',
    defaultTerm: 'osha construction fabrication welding cranes fall protection',
    watchItems: ['OSHA rules and notices', 'Crane and derrick guidance', 'Construction site safety emphasis'],
  },
  {
    id: 'manufacturing-general-industry',
    title: 'Manufacturing and General Industry',
    description: 'Guarding, energy control, machine safety, PPE, and plant operations updates.',
    defaultTerm: 'osha machine guarding lockout tagout manufacturing ppe general industry',
    watchItems: ['General industry rulemaking', 'Machine and guarding guidance', 'Energy control priorities'],
  },
  {
    id: 'transport-hazmat',
    title: 'Transportation and Hazmat',
    description: 'Shipping, DOT, PHMSA, fleet, placarding, and hazardous-material movement changes.',
    defaultTerm: 'phmsa dot hazmat transportation placard shipping federal motor carrier',
    watchItems: ['Hazmat transport notices', 'DOT enforcement shifts', 'Carrier and shipping rule updates'],
  },
  {
    id: 'environment-energy',
    title: 'Environmental and Energy',
    description: 'Air, waste, water, process systems, and energy-sector compliance activity.',
    defaultTerm: 'epa emissions hazardous waste industrial stormwater energy process safety',
    watchItems: ['EPA rulemaking', 'Waste and emissions updates', 'Energy and process compliance changes'],
  },
  {
    id: 'labor-employment',
    title: 'Labor and Employment',
    description: 'Wage-hour, workplace policy, labor standards, and employment law changes affecting operations.',
    defaultTerm: 'department of labor wage hour labor standards workplace rule',
    watchItems: ['DOL rule updates', 'Posting and policy requirements', 'Labor compliance shifts'],
  },
]

const documentTypeOptions = [
  { label: 'All types', value: 'all' },
  { label: 'Rules', value: 'RULE' },
  { label: 'Proposed rules', value: 'PRORULE' },
  { label: 'Notices', value: 'NOTICE' },
]

const daysBackOptions = [
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
  { label: 'Last 180 days', value: '180' },
]

const standardsWatchSources = [
  {
    title: 'ANSI Standards Activity',
    type: 'Consensus standards',
    description: 'Monitor approvals, revisions, and standards-board notices that may influence industry compliance expectations.',
    href: 'https://www.ansi.org/american-national-standards/standards-activities',
  },
  {
    title: 'NFPA Codes and Standards',
    type: 'Fire and electrical codes',
    description: 'Watch revision cycles, code adoption activity, and standards-development notices relevant to industrial sites.',
    href: 'https://www.nfpa.org/codes-and-standards',
  },
  {
    title: 'ASME Codes and Standards',
    type: 'Mechanical and pressure systems',
    description: 'Useful for piping, pressure equipment, lifting, and mechanical standards updates.',
    href: 'https://www.asme.org/codes-standards',
  },
  {
    title: 'AWS Codes and Standards',
    type: 'Welding codes',
    description: 'Track welding code publications and revisions that affect fabrication and field welding programs.',
    href: 'https://www.aws.org/standards',
  },
  {
    title: 'ICC Code Development',
    type: 'Building and fire code process',
    description: 'Use when projects intersect local code adoption, occupancy, fire protection, or structural building requirements.',
    href: 'https://www.iccsafe.org/products-and-services/i-codes/code-development-process/',
  },
  {
    title: 'State Plan OSHA Directory',
    type: 'State-specific enforcement',
    description: 'Cross-check whether your state plan is issuing local emphasis, alerts, or interpretation changes beyond federal OSHA.',
    href: 'https://www.osha.gov/stateplans',
  },
]

const alertTemplates = [
  {
    id: 'weekly-watch',
    title: 'Weekly Regulatory Watch Log',
    audience: 'Safety leads, supervisors, compliance coordinators',
    items: ['Source checked and date logged', 'Relevant update summarized', 'Assets, jobs, or departments impacted', 'Required action owner assigned', 'Follow-up deadline confirmed'],
  },
  {
    id: 'change-impact',
    title: 'Change Impact Review Sheet',
    audience: 'Operations managers and project leadership',
    items: ['Rule or notice identified', 'Procedure or permit affected', 'Training or communication required', 'Document revisions assigned', 'Verification date scheduled'],
  },
]

const workflowPanels = [
  {
    title: 'Check public rulemaking fast',
    points: [
      'Use the live monitor below to search Federal Register notices, rules, and proposed rules by topic and timeframe.',
      'Start broad, then tighten the term set to the actual trade, hazard, or regulation family you care about.',
      'Treat results as the front-end signal, then confirm the official source before changing procedures.',
    ],
  },
  {
    title: 'Track standards separately',
    points: [
      'Many code bodies do not expose a clean public API, so standards updates still require direct source review.',
      'Use the standards-watch cards for NFPA, ANSI, ASME, AWS, ICC, and state-plan monitoring.',
      'If your work depends on a specific edition, document both the current adopted edition and any pending revision activity.',
    ],
  },
  {
    title: 'Turn alerts into action',
    points: [
      'A regulatory update matters only when it is assigned, communicated, and verified against the actual work.',
      'Tie each update to permits, JSAs, procedures, training, signage, or inspection programs that need revision.',
      'Keep a visible watch log so audits do not rely on memory or scattered email threads.',
    ],
  },
]

const officialLinks = [
  {
    title: 'Federal Register',
    description: 'Official federal rulemaking, notices, and public inspection documents across agencies and industries.',
    href: 'https://www.federalregister.gov',
  },
  {
    title: 'OSHA News Releases',
    description: 'Federal OSHA announcements, enforcement news, directives, and emphasis information.',
    href: 'https://www.osha.gov/news/newsreleases',
  },
  {
    title: 'MSHA News',
    description: 'Mining-sector alerts, enforcement priorities, and safety guidance updates.',
    href: 'https://www.msha.gov/news-media',
  },
  {
    title: 'PHMSA Hazmat Updates',
    description: 'Transportation and hazardous-material regulatory information for shipping and logistics teams.',
    href: 'https://www.phmsa.dot.gov/hazmat',
  },
  {
    title: 'EPA Rulemaking',
    description: 'Environmental rule development and compliance topics affecting industrial sites and process operations.',
    href: 'https://www.epa.gov/rulemaking',
  },
  {
    title: 'U.S. Department of Labor',
    description: 'Labor, wage-hour, workplace rights, and other employment-related regulatory updates.',
    href: 'https://www.dol.gov/newsroom/releases',
  },
]

function downloadAlertTemplate(template) {
  const { pdf, margin, pageWidth, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'REGULATORY WATCH SHEET',
    title: template.title,
    subtitle: `Audience: ${template.audience}`,
  })

  cursorY = addPdfChecklistSection(pdf, {
    cursorY: cursorY + 12,
    margin,
    maxWidth,
    pageWidth,
    pageHeight,
    label: 'ACTION ITEMS',
    items: template.items,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 8,
    margin,
    maxWidth,
    pageHeight,
    label: 'UPDATE DETAILS',
    body: 'Source / agency: ____________________\nDocument or notice: ____________________\nImpacted work area: ____________________\nOwner: ____________________\nDue date: ____________________',
    minHeight: 92,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This sheet is a tracking aid only. Final compliance decisions should be based on the current official text, adopted jurisdictional requirements, and internal policy review.',
  })

  pdf.save(`${toPdfFileName(template.id)}-regulatory-watch-sheet.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Regulatory Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          Compliance drift usually starts before anyone notices the rules have moved
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this hub is for</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This page is built to help teams watch public rulemaking, agency notices, standards activity, and compliance-impact changes without relying on scattered bookmarks.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What the live checker covers</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            The live monitor uses Federal Register public data to scan official federal notices, rules, and proposed rules across industries.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What still needs direct review</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Many code bodies like ANSI, NFPA, ASME, AWS, and ICC still need direct-source review because most do not offer a comparable open public API.
          </p>
        </div>
      </div>
    </section>
  )
}

function ProfileSelector({ selectedProfileId, onSelectProfile }) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Watch Profiles ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Choose the industry lens first</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Start with a profile to preload search terms that match the kinds of updates most likely to affect your work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {regulatoryProfiles.map((profile) => {
          const active = profile.id === selectedProfileId

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectProfile(profile.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                active
                  ? 'border-green-400/35 bg-green-500/[0.10]'
                  : 'border-white/10 bg-black/40 hover:border-green-400/25 hover:bg-black/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white">{profile.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{profile.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-white/72">
                {profile.watchItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-bold text-green-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function LiveMonitorPanel({
  selectedProfile,
  searchTerm,
  setSearchTerm,
  documentType,
  setDocumentType,
  daysBack,
  setDaysBack,
  results,
  loading,
  error,
  lastCheckedAt,
  onRunCheck,
}) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Live Monitor ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Run an official update check</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            This monitor checks the Federal Register public API for new federal rules, notices, and proposed rules using the industry profile and search terms you choose.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/65">
          {lastCheckedAt
            ? `Last checked ${new Date(lastCheckedAt).toLocaleString()}`
            : 'No live check run yet in this session'}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/75">Search terms</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={selectedProfile.defaultTerm}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/75">Document type</span>
          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {documentTypeOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950">
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/75">Time window</span>
          <select
            value={daysBack}
            onChange={(event) => setDaysBack(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {daysBackOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950">
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onRunCheck}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/25 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200 disabled:cursor-wait disabled:opacity-70"
        >
          <Search className="h-4 w-4" />
          {loading ? 'Checking...' : 'Check Updates'}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/70">
        <span className="font-semibold text-white">Current profile:</span> {selectedProfile.title}. This live check covers public federal rulemaking and notices. For standards and code-body revisions, use the standards-watch section below.
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-5 text-sm leading-7 text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {results.length === 0 && !loading ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
            No live results yet. Run the monitor to pull current federal updates for the selected industry profile.
          </div>
        ) : null}

        {results.map((result) => (
          <article
            key={result.id}
            className="rounded-2xl border border-white/10 bg-black/40 p-6 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
                  <span>{result.type}</span>
                  <span className="text-white/35">/</span>
                  <span>{result.publicationDate}</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-white">{result.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{result.agencies}</p>
              </div>

              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
              >
                Open official entry
              </a>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                Summary
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">{result.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TemplatesPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Watch Templates ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Downloadable update tracking sheets</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Use these PDFs for weekly source checks, compliance-change reviews, and action assignment when a new rule or notice affects the work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alertTemplates.map((template) => (
          <div key={template.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-xl font-bold text-white">{template.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{template.audience}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-white/75">
              {template.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => downloadAlertTemplate(template)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              <CalendarClock className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function StandardsWatchPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Standards Watch ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">Track code bodies that do not publish a comparable public API</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {standardsWatchSources.map((source) => (
          <a
            key={source.title}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">
              {source.type}
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{source.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/70">{source.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function WorkflowPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Update Workflow ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">How to use alerts without creating noise</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {workflowPanels.map((section) => (
          <div key={section.title} className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
            </div>
            <ul className="space-y-3 text-sm leading-7 text-white/72">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="font-bold text-green-400">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedResourcesPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Related Resources ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">Move from rule signal to operational response</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          to="/knowledge-library/industry-standards"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Industry Standards</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Cross-check whether a regulatory change also impacts the code or standards references your teams rely on every day.
          </p>
        </Link>

        <Link
          to="/daily-safety"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Daily Safety</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Push compliance changes into daily checklists, toolbox talks, and hazard communication before they get lost in email chains.
          </p>
        </Link>

        <Link
          to="/knowledge-library/maintenance-schedules"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Maintenance Schedules</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Translate new rules into PM intervals, inspection logs, and return-to-service controls where asset compliance is affected.
          </p>
        </Link>

        <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.08] p-5">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-green-300">Practical limit</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/72">
            The live checker can surface public federal activity fast, but final decisions still need the official adopted text and any state or local requirements that sit on top of it.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function RegulatoryUpdates() {
  const location = useLocation()
  const initialParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const initialProfileId = initialParams.get('profile') ?? regulatoryProfiles[0].id
  const initialProfile =
    regulatoryProfiles.find((profile) => profile.id === initialProfileId) ?? regulatoryProfiles[0]

  const [selectedProfileId, setSelectedProfileId] = useState(initialProfile.id)
  const [searchTerm, setSearchTerm] = useState(initialParams.get('term') ?? initialProfile.defaultTerm)
  const [documentType, setDocumentType] = useState(initialParams.get('type') ?? 'all')
  const [daysBack, setDaysBack] = useState(initialParams.get('days') ?? '90')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastCheckedAt, setLastCheckedAt] = useState(null)

  const selectedProfile = useMemo(
    () => regulatoryProfiles.find((profile) => profile.id === selectedProfileId) ?? regulatoryProfiles[0],
    [selectedProfileId]
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const profileId = params.get('profile')
    const matchedProfile = regulatoryProfiles.find((profile) => profile.id === profileId) ?? regulatoryProfiles[0]

    setSelectedProfileId(matchedProfile.id)
    setSearchTerm(params.get('term') ?? matchedProfile.defaultTerm)
    setDocumentType(params.get('type') ?? 'all')
    setDaysBack(params.get('days') ?? '90')
  }, [location.search])

  const runLiveCheck = async () => {
    const effectiveTerm = searchTerm.trim() || selectedProfile.defaultTerm
    const params = new URLSearchParams()
    params.set('order', 'newest')
    params.set('per_page', '12')
    params.set('conditions[term]', effectiveTerm)

    if (documentType !== 'all') {
      params.append('conditions[type][]', documentType)
    }

    const gteDate = new Date()
    gteDate.setDate(gteDate.getDate() - Number(daysBack || 90))
    params.set('conditions[publication_date][gte]', gteDate.toISOString().slice(0, 10))

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`https://www.federalregister.gov/api/v1/documents.json?${params.toString()}`)

      if (!response.ok) {
        throw new Error('The official monitor could not retrieve updates right now. Try again in a moment or open the Federal Register directly.')
      }

      const data = await response.json()
      const nextResults = (data.results ?? []).map((entry) => ({
        id: entry.document_number ?? entry.id ?? entry.html_url,
        title: entry.title,
        type: entry.type ?? 'Federal register entry',
        publicationDate: entry.publication_date,
        url: entry.html_url,
        agencies:
          entry.agencies?.map((agency) => agency.name).join(', ') ||
          entry.agency_names?.join(', ') ||
          'Federal Register',
        summary:
          entry.abstract ||
          entry.excerpts ||
          'Open the official entry to review the full rulemaking or notice detail.',
      }))

      setResults(nextResults)
      setLastCheckedAt(Date.now())
    } catch (nextError) {
      setError(nextError.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <LibraryPageLayout
      eyebrow="― Compliance Alerts ―"
      title="Regulatory Updates & Alerts"
      description="A real regulatory watch hub for public rulemaking, official notices, standards activity, and action planning across industrial work."
      intro="Use this page as a working compliance signal board: run the live official monitor, check standards bodies that still require direct review, assign actions, and push changes into the field before procedures drift out of date."
      customContent={
        <div className="space-y-12">
          <OverviewPanel />
          <ProfileSelector
            selectedProfileId={selectedProfileId}
            onSelectProfile={(profileId) => {
              const nextProfile = regulatoryProfiles.find((profile) => profile.id === profileId)
              setSelectedProfileId(profileId)
              setSearchTerm(nextProfile?.defaultTerm ?? '')
            }}
          />
          <LiveMonitorPanel
            selectedProfile={selectedProfile}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            documentType={documentType}
            setDocumentType={setDocumentType}
            daysBack={daysBack}
            setDaysBack={setDaysBack}
            results={results}
            loading={loading}
            error={error}
            lastCheckedAt={lastCheckedAt}
            onRunCheck={runLiveCheck}
          />
          <TemplatesPanel />
          <StandardsWatchPanel />
          <WorkflowPanel />
          <RelatedResourcesPanel />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}