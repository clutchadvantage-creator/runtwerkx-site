import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CalendarClock, CheckCircle2, Wrench } from 'lucide-react'
import LibraryPageLayout from './LibraryPageLayout'
import {
  addPdfChecklistSection,
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  toPdfFileName,
} from '../../utils/pdfExport'

const scheduleFilters = ['All', 'Welding systems', 'Mobile equipment', 'Compressed air', 'Shop machinery', 'Rigging gear', 'Facility systems']
const cadenceFilters = ['All', 'Per shift', 'Weekly', 'Monthly', 'Quarterly']

const maintenanceEntries = [
  {
    title: 'Engine-driven welder service rhythm',
    category: 'Welding systems',
    cadence: 'Per shift',
    assetClass: 'Field welding power source',
    appliesTo: 'Engine-driven welders, leads, grounds, fuel systems, remote controls.',
    coreChecks: [
      'Inspect leads, lugs, and electrode holders for heat damage, exposed copper, and poor connections.',
      'Check fuel, coolant, and oil levels before startup and verify no active leak points are present.',
      'Clean vents and verify panels, doors, and guards close fully before transport or use.',
    ],
    watchFor: 'Hard starts, voltage fluctuation, poor arc performance, fuel seepage, or damaged lead insulation should move the unit out of production until reviewed.',
    downtimeTrigger: 'Remove from service for active fluid leaks, unsafe electrical insulation, damaged output studs, or any condition affecting stable output or fire safety.',
    officialLink: 'https://www.osha.gov/welding-cutting-brazing',
  },
  {
    title: 'Forklift and powered industrial truck PM cadence',
    category: 'Mobile equipment',
    cadence: 'Per shift',
    assetClass: 'Forklifts and material handlers',
    appliesTo: 'Sit-down lifts, stand-up lifts, telehandlers used in yards or warehouses.',
    coreChecks: [
      'Verify brakes, horn, steering, mast operation, fork condition, and visible hydraulic leak points.',
      'Confirm battery charge, propane connection, or fuel condition and inspect tires for chunking or flat spots.',
      'Check operator restraint, lights, alarms, and data plate legibility before use.',
    ],
    watchFor: 'Steering drift, brake fade, mast hesitation, chain wear, or fork damage are not minor defects on lifting equipment.',
    downtimeTrigger: 'Tag out for hydraulic leaks, brake failure, steering issues, damaged forks, non-working alarms, or any instability under load.',
    officialLink: 'https://www.osha.gov/powered-industrial-trucks',
  },
  {
    title: 'Compressed air system weekly check',
    category: 'Compressed air',
    cadence: 'Weekly',
    assetClass: 'Compressors, receivers, dryers, hoses, regulators',
    appliesTo: 'Shop air systems that support tools, blasting, controls, or process equipment.',
    coreChecks: [
      'Drain moisture points, verify auto drains work, and inspect receiver condition and pressure readings.',
      'Inspect hoses, couplers, whip checks, and regulator stations for damage or creep.',
      'Listen for escalating leak load or short cycling that indicates capacity loss or hidden demand growth.',
    ],
    watchFor: 'A compressor that cycles harder, runs hotter, or loses pressure is usually telling you something before it fails outright.',
    downtimeTrigger: 'Stop and repair for receiver integrity concerns, damaged hoses, unsafe couplers, regulator failure, or relief device issues.',
    officialLink: 'https://www.osha.gov/compressed-air-vacuum',
  },
  {
    title: 'Band saw and cold saw monthly inspection',
    category: 'Shop machinery',
    cadence: 'Monthly',
    assetClass: 'Cutting equipment',
    appliesTo: 'Horizontal band saws, vertical saws, cold saws, and production cutting stations.',
    coreChecks: [
      'Inspect guards, blade condition, coolant flow, vises, stop systems, and feed accuracy.',
      'Check chips, residue, and tracking wear around guides, bearings, and drive components.',
      'Verify E-stop response, lockable disconnect access, and signage or operating instructions.',
    ],
    watchFor: 'Blade drift, poor clamping, coolant delivery issues, and bypassed guards usually show up well before a breakdown or injury event.',
    downtimeTrigger: 'Remove from service for ineffective guards, unstable workholding, excessive vibration, failed stop controls, or drive-system concerns.',
    officialLink: 'https://www.osha.gov/machine-guarding',
  },
  {
    title: 'Rigging hardware quarterly inspection block',
    category: 'Rigging gear',
    cadence: 'Quarterly',
    assetClass: 'Slings, shackles, hooks, below-the-hook gear',
    appliesTo: 'Shop and field rigging inventories, cranes, hoists, and shipping support gear.',
    coreChecks: [
      'Review sling tags, remove damaged gear, and inspect hooks, shackles, and hardware for deformation or cracks.',
      'Confirm storage keeps gear dry, protected, and separated from cutting edges or weld spatter exposure.',
      'Match inspection records to actual field inventory so worn gear is not recirculated quietly.',
    ],
    watchFor: 'Unreadable tags, side-loaded hardware, flattened hooks, broken wires, and improvised repairs are immediate credibility failures in the lifting program.',
    downtimeTrigger: 'Destroy or quarantine gear with missing identification, deformation, heat damage, broken strands, or questionable repair history.',
    officialLink: 'https://www.osha.gov/cranes-derricks',
  },
  {
    title: 'Facility egress and life-safety monthly review',
    category: 'Facility systems',
    cadence: 'Monthly',
    assetClass: 'Exits, alarms, extinguishers, lighting, eyewash or shower points',
    appliesTo: 'Shop buildings, fabrication facilities, maintenance areas, offices, and yard support spaces.',
    coreChecks: [
      'Confirm exit paths, panic hardware, emergency lighting, and extinguisher access remain clear and serviceable.',
      'Verify inspection tags, eyewash readiness, alarm visibility, and posted response information.',
      'Review housekeeping drift in storage areas, charging stations, flammable storage, and temporary work zones.',
    ],
    watchFor: 'Life-safety systems degrade quietly when layout changes, temporary storage grows, or routine inspections become pencil-whipped.',
    downtimeTrigger: 'Escalate immediately for blocked exits, failed lighting, missing extinguishers, expired service tags, or impaired emergency wash stations.',
    officialLink: 'https://www.osha.gov/exit-routes-emergency-planning',
  },
]

const planningTemplates = [
  {
    id: 'daily-equipment',
    title: 'Daily Equipment Readiness Sheet',
    audience: 'Operators, leads, and shift supervisors',
    items: ['Asset identified and assigned', 'Visible defects inspected', 'Controls and safeguards checked', 'Leaks, wear, and alarms reviewed', 'Status communicated before use'],
  },
  {
    id: 'weekly-pm',
    title: 'Weekly PM Coordination Sheet',
    audience: 'Maintenance coordinators and shop leadership',
    items: ['Units due this week listed', 'Parts and consumables staged', 'Lockout needs confirmed', 'Downtime windows aligned', 'Work completion logged'],
  },
  {
    id: 'critical-asset',
    title: 'Critical Asset Recovery Plan',
    audience: 'Supervisors, planners, and maintenance leads',
    items: ['Failure mode documented', 'Temporary controls reviewed', 'Spare parts identified', 'Vendor or technical support assigned', 'Return-to-service criteria defined'],
  },
]

const triggerPanels = [
  {
    title: 'Escalate sooner',
    points: [
      'Repeated resets, nuisance trips, or workarounds usually mean the failure has already started.',
      'A defect on lifting, pressure, guarding, or braking systems should not wait for the formal PM window.',
      'If the same unit keeps generating the same issue, the problem is no longer just the operator inspection.',
    ],
  },
  {
    title: 'Plan downtime deliberately',
    points: [
      'Tie PM work to production windows, staging needs, and critical deliveries instead of hoping time appears.',
      'Pre-stage filters, belts, wear parts, tooling, and permits before opening up equipment.',
      'Use maintenance windows to close documentation gaps, not just to wrench on the asset.',
    ],
  },
  {
    title: 'Return to service with discipline',
    points: [
      'Confirm guards, settings, utilities, and housekeeping before handing the asset back to operations.',
      'Functional testing should prove the fault is resolved, not just that the equipment can power on.',
      'Communicate what changed so the next shift is not guessing about condition, limits, or follow-up work.',
    ],
  },
]

const officialLinks = [
  {
    title: 'OSHA Machine Guarding',
    description: 'Guarding expectations and machinery safety guidance that support maintenance review and safe return to service.',
    href: 'https://www.osha.gov/machine-guarding',
  },
  {
    title: 'OSHA Powered Industrial Trucks',
    description: 'Inspection and operating safety references for forklifts and other powered material handling assets.',
    href: 'https://www.osha.gov/powered-industrial-trucks',
  },
  {
    title: 'NFPA Codes and Standards',
    description: 'Life-safety, fire protection, and electrical references relevant to facility maintenance and emergency readiness.',
    href: 'https://www.nfpa.org/codes-and-standards',
  },
  {
    title: 'Compressed Air and Vacuum Guidance',
    description: 'OSHA guidance for compressed air and related system concerns often surfaced during PM work.',
    href: 'https://www.osha.gov/compressed-air-vacuum',
  },
]

function downloadMaintenanceTemplate(template) {
  const { pdf, margin, pageWidth, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'MAINTENANCE PLANNING SHEET',
    title: template.title,
    subtitle: `Audience: ${template.audience}`,
  })

  cursorY = addPdfChecklistSection(pdf, {
    cursorY: cursorY + 12,
    margin,
    maxWidth,
    pageWidth,
    pageHeight,
    label: 'PLANNING ITEMS',
    items: template.items,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 8,
    margin,
    maxWidth,
    pageHeight,
    label: 'WORK ORDER DETAILS',
    body: 'Asset / ID: ____________________\nLocation: ____________________\nScheduled Window: ____________________\nAssigned Tech: ____________________\nParts / Consumables: ____________________',
    minHeight: 92,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This sheet supports maintenance planning only. Final service steps, permits, isolation methods, and return-to-service checks should match the manufacturer guidance and your site maintenance procedures.',
  })

  pdf.save(`${toPdfFileName(template.id)}-maintenance-sheet.pdf`)
}

function downloadMaintenanceSheet(entry) {
  const { pdf, margin, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'EQUIPMENT MAINTENANCE QUICK SHEET',
    title: entry.title,
    subtitle: `${entry.category} / ${entry.cadence}`,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 12,
    margin,
    maxWidth,
    pageHeight,
    label: 'ASSET CLASS',
    body: entry.assetClass,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'APPLIES TO',
    body: entry.appliesTo,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'CORE CHECKS',
    body: entry.coreChecks.map((item, index) => `${index + 1}. ${item}`).join('\n'),
    minHeight: 96,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'WATCH FOR',
    body: entry.watchFor,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'DOWNTIME TRIGGER',
    body: entry.downtimeTrigger,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'OFFICIAL REFERENCE',
    body: entry.officialLink,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This quick sheet is a field-use planning reference. Final service intervals, lubrication points, torque values, and replacement criteria should always follow the manufacturer and site procedures.',
  })

  pdf.save(`${toPdfFileName(entry.title)}-maintenance-quick-sheet.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Maintenance Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          Strong maintenance scheduling is how operations stay boring in the best possible way
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this hub is for</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use this page to keep preventive work visible, prioritize what cannot slip, and move assets out of service before a defect becomes a shutdown.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Best daily use</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Search by asset type or cadence, download the right planning sheet, and use the downtime trigger notes to decide whether the unit stays in production.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this prevents</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Silent backlog growth, repeated nuisance failures, unsafe workaround culture, missed inspections, and last-minute downtime that hits the schedule hardest.
          </p>
        </div>
      </div>
    </section>
  )
}

function MaintenanceSelector() {
  const [selection, setSelection] = useState('Welding systems')

  const recommendations = useMemo(() => {
    return maintenanceEntries.filter((entry) => entry.category === selection).slice(0, 3)
  }, [selection])

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Quick Selector ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">What equipment are you maintaining?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Pick the equipment family to surface the checks and schedule blocks that should be reviewed first.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {scheduleFilters.filter((filter) => filter !== 'All').map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelection(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selection === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/75 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((entry) => (
          <div key={entry.title} className="rounded-2xl border border-green-400/20 bg-black/60 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
              {entry.cadence}
            </p>
            <h3 className="mt-3 text-lg font-bold text-white">{entry.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{entry.assetClass}</p>
          </div>
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
          ― Planning Sheets ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Downloadable maintenance planning templates</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Use these sheets for operator inspections, weekly PM coordination, and critical asset recovery planning.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planningTemplates.map((template) => (
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
              onClick={() => downloadMaintenanceTemplate(template)}
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

function MaintenanceLibrary() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeCadence, setActiveCadence] = useState('All')

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return maintenanceEntries.filter((entry) => {
      const filterMatches = activeFilter === 'All' || entry.category === activeFilter
      const cadenceMatches = activeCadence === 'All' || entry.cadence === activeCadence
      const haystack = [
        entry.title,
        entry.category,
        entry.cadence,
        entry.assetClass,
        entry.appliesTo,
        entry.watchFor,
        entry.downtimeTrigger,
        ...entry.coreChecks,
      ]
        .join(' ')
        .toLowerCase()

      return filterMatches && cadenceMatches && (!query || haystack.includes(query))
    })
  }, [activeCadence, activeFilter, search])

  const printableEntries = useMemo(() => maintenanceEntries.slice(0, 5), [])

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Searchable Library ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Maintenance schedule and trigger lookup</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Search by asset type, PM cadence, or failure sign to find the right inspection rhythm and shutdown trigger guidance quickly.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search forklift, welder, compressor, rigging, guard..."
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-2 text-white transition placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400 sm:w-96"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {scheduleFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {cadenceFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveCadence(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeCadence === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
          ― Printable Sheets ―
        </p>
        <h3 className="mt-3 text-xl font-bold text-white">One-page maintenance quick sheets</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/70">
          Download core PM references for leads, operators, and maintenance planners working around the most failure-prone assets.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {printableEntries.map((entry) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => downloadMaintenanceSheet(entry)}
              className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              Download {entry.category} PDF
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
            No maintenance schedules matched that search. Try broader terms like forklift, compressor, welder, rigging, guard, or leak.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <article
              key={entry.title}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 transition hover:border-green-400/25 hover:bg-black/50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
                    <span>{entry.category}</span>
                    <span className="text-white/35">/</span>
                    <span>{entry.cadence}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{entry.title}</h3>
                  <div className="mt-3 inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
                    {entry.assetClass}
                  </div>
                </div>

                <a
                  href={entry.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                >
                  Official source
                </a>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1.8fr]">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Applies to
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.appliesTo}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Watch for
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.watchFor}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Core checks
                  </p>
                  <ol className="mt-3 space-y-3 text-sm leading-7 text-white/80">
                    {entry.coreChecks.map((item, index) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-400/25 bg-green-500/10 text-xs font-semibold text-green-300">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                  Downtime trigger
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">{entry.downtimeTrigger}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function TriggerPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Decision Discipline ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">When the schedule is not enough by itself</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {triggerPanels.map((section) => (
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
        <h2 className="mt-4 text-3xl font-bold text-white">Cross-check maintenance with the rest of the plan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          to="/daily-safety"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Daily Safety</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use pre-start controls and hazard checks before putting repaired or inspected assets back into service.
          </p>
        </Link>

        <Link
          to="/knowledge-library/industry-standards?query=lockout&filter=Energy%20control&scope=Maintenance"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Standards Cross-Check</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Jump straight into energy control, guarding, rigging, and electrical standards that influence maintenance planning.
          </p>
        </Link>

        <Link
          to="/knowledge-library/emergency-protocols?query=electrical&filter=Electrical%20emergency"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Emergency Protocols</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Review the emergency side of energized work, confined space maintenance, spills, or unexpected equipment failures.
          </p>
        </Link>

        <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.08] p-5">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-green-300">Operational reminder</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/72">
            If a critical asset is being kept alive with habit, luck, or tribal knowledge, the schedule is already behind reality and needs to be reset.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function MaintenanceSchedules() {
  return (
    <LibraryPageLayout
      eyebrow="― Equipment Care ―"
      title="Equipment Maintenance Schedules"
      description="A more complete maintenance planning hub for preventive schedules, shutdown triggers, printable work sheets, and asset-specific field guidance."
      intro="Built for practical use by operators, maintenance leads, supervisors, and planners who need to decide what can stay in service, what needs a PM window, and what needs to come down now."
      customContent={
        <div className="space-y-12">
          <OverviewPanel />
          <MaintenanceSelector />
          <TemplatesPanel />
          <MaintenanceLibrary />
          <TriggerPanel />
          <RelatedResourcesPanel />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}
