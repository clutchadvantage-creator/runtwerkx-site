import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Printer } from 'lucide-react'
import LibraryPageLayout from './library/LibraryPageLayout'
import {
  addPdfChecklistSection,
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  writeWrapped,
} from '../utils/pdfExport'

const SAFETY_STORAGE_KEY = 'runtwerkx-daily-safety-state'

const checklistScopes = ['All', 'Shop', 'Field', 'Maintenance', 'Shipping', 'Office']

const checklistItems = [
  { id: 1, item: 'PPE matches today’s hazards and is in usable condition', group: 'Personal readiness', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping'] },
  { id: 2, item: 'Crew understands today’s scope, hazards, and stop-work expectations', group: 'Communication', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping', 'Office'] },
  { id: 3, item: 'Tools, equipment, and access systems have been inspected before use', group: 'Equipment check', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping'] },
  { id: 4, item: 'Emergency exits, muster points, and reporting chain are confirmed', group: 'Emergency readiness', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping', 'Office'] },
  { id: 5, item: 'Work area is free of slip, trip, struck-by, and housekeeping hazards', group: 'Area control', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping', 'Office'] },
  { id: 6, item: 'Required permits, JSA/JHA, and client or site controls are reviewed', group: 'Planning', scopes: ['Field', 'Maintenance', 'Office'] },
  { id: 7, item: 'Energy isolation points and restart risks are identified before work begins', group: 'Energy control', scopes: ['Shop', 'Field', 'Maintenance'] },
  { id: 8, item: 'Material movement, lifting path, and traffic interaction are planned', group: 'Movement and lifting', scopes: ['Shop', 'Field', 'Shipping'] },
  { id: 9, item: 'Chemical, fume, dust, or weather exposure controls are in place', group: 'Exposure control', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping'] },
  { id: 10, item: 'Any changed conditions are discussed before the task starts', group: 'Dynamic reassessment', scopes: ['Shop', 'Field', 'Maintenance', 'Shipping', 'Office'] },
]

const hazardOptions = [
  {
    id: 'weather',
    title: 'Weather exposure',
    description: 'Storms, heat, cold stress, wind, and visibility shifts that can change safe work conditions fast.',
    standardsTo: '/knowledge-library/industry-standards?query=weather&scope=Field',
    emergencyTo: '/knowledge-library/emergency-protocols?query=weather&filter=Weather%20emergency',
    checklistItems: [
      { id: 201, item: 'Weather exposure plan is updated for heat, lightning, wind, rain, or cold stress', group: 'Exposure control', scopes: ['Field', 'Shipping'] },
      { id: 202, item: 'Hydration, shelter, and stop-work triggers for weather changes are communicated', group: 'Communication', scopes: ['Field', 'Shipping'] },
    ],
  },
  {
    id: 'hot-work',
    title: 'Hot work',
    description: 'Welding, cutting, grinding, ignition sources, fire watch, and combustibles control.',
    standardsTo: '/knowledge-library/industry-standards?query=welding&filter=Welding&scope=Shop',
    emergencyTo: '/knowledge-library/emergency-protocols?query=fire&filter=Fire%20safety',
    checklistItems: [
      { id: 203, item: 'Hot work permit, fire watch, and combustibles control are confirmed', group: 'Planning', scopes: ['Shop', 'Field', 'Maintenance'] },
      { id: 204, item: 'Ventilation, extinguisher access, and post-work fire monitoring are ready', group: 'Emergency readiness', scopes: ['Shop', 'Field', 'Maintenance'] },
    ],
  },
  {
    id: 'lifting',
    title: 'Lifting and rigging',
    description: 'Cranes, hoists, sling selection, suspended loads, load path control, and exclusion zones.',
    standardsTo: '/knowledge-library/industry-standards?query=rigging&filter=Rigging%20%26%20cranes&scope=Field',
    emergencyTo: '/knowledge-library/emergency-protocols?query=falling%20material',
    checklistItems: [
      { id: 205, item: 'Lift path, exclusion zone, and communication method are verified with the crew', group: 'Movement and lifting', scopes: ['Shop', 'Field', 'Shipping'] },
      { id: 206, item: 'Rigging hardware, sling condition, and load balance have been checked before the pick', group: 'Equipment check', scopes: ['Shop', 'Field', 'Shipping'] },
    ],
  },
  {
    id: 'confined-space',
    title: 'Confined space',
    description: 'Permit spaces, atmospheric testing, attendants, rescue planning, and entry boundaries.',
    standardsTo: '/knowledge-library/industry-standards?query=confined%20space&filter=Confined%20space&scope=Maintenance',
    emergencyTo: '/knowledge-library/emergency-protocols?query=confined%20space&filter=Confined%20space',
    checklistItems: [
      { id: 207, item: 'Permit, atmospheric testing, attendant coverage, and rescue method are verified', group: 'Planning', scopes: ['Field', 'Maintenance'] },
      { id: 208, item: 'Entry boundary control and non-entry rescue equipment are ready before entry starts', group: 'Emergency readiness', scopes: ['Field', 'Maintenance'] },
    ],
  },
]

const hazardFocus = [
  {
    title: 'People and communication',
    points: [
      'Confirm who is in charge, who is new to the task, and who can stop the job.',
      'Make sure radio, phone, or verbal escalation methods are clear before work starts.',
      'Do not assume the previous shift communicated changed hazards correctly.',
    ],
  },
  {
    title: 'Equipment and energy',
    points: [
      'Inspect machine guards, cords, hoses, access gear, and lifting devices before use.',
      'Verify isolation and zero-energy state instead of assuming lock placement equals safety.',
      'Treat unusual vibration, heat, noise, or control lag as a stop-and-check condition.',
    ],
  },
  {
    title: 'Environment and exposure',
    points: [
      'Check floor conditions, weather shifts, visibility, ventilation, and nearby operations.',
      'Confirm fire load, ignition sources, and housekeeping before hot work or chemical handling.',
      'Reassess whenever access changes, materials move, or new trades enter the work zone.',
    ],
  },
]

const checklistTemplates = [
  {
    id: 'daily-toolbox',
    title: 'Daily Toolbox Safety Sheet',
    audience: 'Crew leads and supervisors',
    items: ['Task scope reviewed', 'Top 3 hazards identified', 'PPE confirmed', 'Emergency plan reviewed', 'Stop-work authority reinforced'],
  },
  {
    id: 'pre-shift-field',
    title: 'Pre-Shift Field Safety Sheet',
    audience: 'Field installation and construction crews',
    items: ['Access and fall protection checked', 'Permit and JSA reviewed', 'Lift path and equipment verified', 'Site contacts confirmed', 'Changed conditions discussed'],
  },
  {
    id: 'maintenance-startup',
    title: 'Maintenance Start-Up Safety Sheet',
    audience: 'Maintenance and service work',
    items: ['LOTO points confirmed', 'Electrical boundaries reviewed', 'Line break hazards assessed', 'Test equipment checked', 'Return-to-service plan confirmed'],
  },
]

const officialLinks = [
  {
    title: 'OSHA Safety and Health Topics',
    description: 'Federal safety topics, hazard controls, regulations, and training guidance for daily work planning.',
    href: 'https://www.osha.gov/SLTC',
  },
  {
    title: 'NIOSH Workplace Safety and Health Topics',
    description: 'Research-backed occupational safety guidance for common workplace hazards and exposure control.',
    href: 'https://www.cdc.gov/niosh/topics/default.html',
  },
  {
    title: 'NFPA Safety and Fire Codes',
    description: 'Fire protection, hot work, evacuation, and electrical safety references for daily risk review.',
    href: 'https://www.nfpa.org/codes-and-standards',
  },
  {
    title: 'ANSI Standards Overview',
    description: 'Consensus standards used to support safe work practices, equipment requirements, and operating expectations.',
    href: 'https://www.ansi.org',
  },
]

function downloadSafetyTemplate(template, jobDetails) {
  const { pdf, margin, pageWidth, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'DAILY SAFETY CHECKLIST TEMPLATE',
    title: template.title,
    subtitle: `Audience: ${template.audience}`,
  })

  const jobInfo = [
    `Company: ${jobDetails.company || '____________________'}`,
    `Project / Area: ${jobDetails.siteName || '____________________'}`,
    `Supervisor: ${jobDetails.supervisor || '____________________'}`,
    `Muster Point: ${jobDetails.musterPoint || '____________________'}`,
    `Permit Numbers: ${jobDetails.permitNumbers || '____________________'}`,
    `Date / Shift: ${jobDetails.shiftLabel || '____________________'}`,
    `Crew: ${jobDetails.crewName || '____________________'}`,
  ]
  cursorY += 12
  const jobInfoTop = cursorY
  pdf.setDrawColor(203, 213, 225)
  pdf.roundedRect(margin, jobInfoTop, maxWidth, 110, 12, 12)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(15, 138, 75)
  pdf.text('JOB INFORMATION', margin + 14, jobInfoTop + 18)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(15, 23, 42)
  cursorY = writeWrapped(pdf, jobInfo.join('\n'), margin + 14, jobInfoTop + 38, {
    maxWidth: maxWidth - 28,
    lineHeight: 15,
  })

  cursorY = addPdfChecklistSection(pdf, {
    cursorY: cursorY + 10,
    margin,
    maxWidth,
    pageWidth,
    pageHeight,
    label: 'CHECKLIST',
    items: template.items,
  })

  addPdfFooter(pdf, {
    cursorY: cursorY + 10,
    margin,
    maxWidth,
    pageHeight,
    text: 'This template is a planning aid only. Final work controls must match the active permit, client requirements, and company safety procedures.',
  })

  pdf.save(`${template.id}-daily-safety-template.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Daily Safety Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          The first safety check is whether the team is actually ready to start
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Daily use</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This page is meant for pre-shift, pre-task, and changed-condition checks before production pressure starts to take over.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Best use case</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use the scope filter to match the day’s work context, complete the checklist, then jump into standards or emergency references when a risk needs deeper review.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this prevents</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Missed permits, wrong PPE, poor handoff communication, incomplete isolation, rushed starts, and “we thought it was covered” failures.
          </p>
        </div>
      </div>
    </section>
  )
}

function DailyChecklistHub({
  activeScope,
  setActiveScope,
  checkedIds,
  setCheckedIds,
  selectedHazards,
  onClearSavedProgress,
}) {
  const hazardDrivenItems = useMemo(
    () => hazardOptions.flatMap((hazard) => (selectedHazards.includes(hazard.id) ? hazard.checklistItems : [])),
    [selectedHazards]
  )

  const combinedItems = useMemo(() => [...checklistItems, ...hazardDrivenItems], [hazardDrivenItems])

  const visibleItems = useMemo(() => {
    if (activeScope === 'All') {
      return combinedItems
    }

    return combinedItems.filter((item) => item.scopes.includes(activeScope))
  }, [activeScope, combinedItems])

  const groupedItems = useMemo(() => {
    return visibleItems.reduce((accumulator, item) => {
      accumulator[item.group] = accumulator[item.group] || []
      accumulator[item.group].push(item)
      return accumulator
    }, {})
  }, [visibleItems])

  const completedCount = visibleItems.filter((item) => checkedIds.includes(item.id)).length

  const toggleItem = (id) => {
    setCheckedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  const clearVisible = () => {
    setCheckedIds((current) => current.filter((id) => !visibleItems.some((item) => item.id === id)))
  }

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Interactive Checklist ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Scope-based pre-start checklist</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Filter the checklist by the type of work you are starting, then use the completion count as a quick readiness check before the shift gets moving.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/65">
          {completedCount} of {visibleItems.length} items completed
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {checklistScopes.map((scope) => (
          <button
            key={scope}
            type="button"
            onClick={() => setActiveScope(scope)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeScope === scope
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {scope}
          </button>
        ))}

        <button
          type="button"
          onClick={clearVisible}
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/60 transition hover:border-green-400/25 hover:text-white"
        >
          Reset Visible Items
        </button>

        <button
          type="button"
          onClick={onClearSavedProgress}
          className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:border-red-400/35 hover:bg-red-500/15"
        >
          Clear Saved Progress
        </button>
      </div>

      <div className="grid gap-5">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-xl font-bold text-white">{group}</h3>
            <div className="mt-4 grid gap-3">
              {items.map((item) => {
                const checked = checkedIds.includes(item.id)

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 text-left transition hover:border-green-400/25 hover:bg-black/50"
                  >
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                        checked
                          ? 'border-green-400 bg-green-400/20'
                          : 'border-white/30 bg-transparent group-hover:border-green-400/50'
                      }`}
                    >
                      {checked ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : null}
                    </div>
                    <div>
                      <div className={`text-base ${checked ? 'text-white/55 line-through' : 'text-white/82'}`}>
                        {item.item}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        {item.scopes.join(' / ')}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function JobInfoPanel({ jobDetails, setJobDetails, selectedHazards }) {
  const updateField = (field, value) => {
    setJobDetails((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Job Setup ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Today’s top hazards and job details</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Select the biggest hazards for today so the checklist expands automatically, and fill in the company-specific details that should appear on downloaded planning sheets.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {hazardOptions.map((hazard) => {
          const active = selectedHazards.includes(hazard.id)

          return (
            <button
              key={hazard.id}
              type="button"
              onClick={() =>
                setJobDetails((current) => ({
                  ...current,
                  selectedHazards: active
                    ? current.selectedHazards.filter((value) => value !== hazard.id)
                    : [...current.selectedHazards, hazard.id],
                }))
              }
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? 'border-green-400/40 bg-green-500/15 text-green-300'
                  : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
              }`}
            >
              {hazard.title}
            </button>
          )
        })}
      </div>

      {selectedHazards.length > 0 ? (
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {hazardOptions
            .filter((hazard) => selectedHazards.includes(hazard.id))
            .map((hazard) => (
              <div key={hazard.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <h3 className="text-lg font-bold text-white">{hazard.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{hazard.description}</p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    to={hazard.standardsTo}
                    className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                  >
                    Open Standards
                  </Link>
                  <Link
                    to={hazard.emergencyTo}
                    className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-green-400/25 hover:text-white"
                  >
                    Open Emergency Guidance
                  </Link>
                </div>
              </div>
            ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['company', 'Company'],
          ['siteName', 'Project / Site Name'],
          ['supervisor', 'Supervisor'],
          ['musterPoint', 'Muster Point'],
          ['permitNumbers', 'Permit Numbers'],
          ['shiftLabel', 'Date / Shift'],
          ['crewName', 'Crew / Department'],
        ].map(([field, label]) => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">{label}</span>
            <input
              type="text"
              value={jobDetails[field]}
              onChange={(event) => updateField(field, event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </label>
        ))}
      </div>
    </section>
  )
}

function ChecklistTemplatesPanel({ jobDetails }) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Printable Templates ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Printable daily safety sheets</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Download PDF-style planning sheets for toolbox meetings, field starts, and maintenance work packets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {checklistTemplates.map((template) => (
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
              onClick={() => downloadSafetyTemplate(template, jobDetails)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              <Printer className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function HazardFocusPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Hazard Focus ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">What to actively look for before work starts</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {hazardFocus.map((section) => (
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
        <h2 className="mt-4 text-3xl font-bold text-white">Go deeper when the checklist surfaces a risk</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/knowledge-library/industry-standards?scope=Field&query=fall"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <h3 className="text-xl font-bold text-white">Industry Standards Hub</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Jump into the standards library when the checklist reveals a compliance, PPE, LOTO, rigging, or access question.
          </p>
        </Link>

        <Link
          to="/knowledge-library/emergency-protocols?query=injury"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <h3 className="text-xl font-bold text-white">Emergency Response Protocols</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Move directly into emergency response guidance when the pre-start discussion exposes gaps in rescue, reporting, or incident readiness.
          </p>
        </Link>

        <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.08] p-5">
          <h3 className="text-xl font-bold text-green-400">Daily reminder</h3>
          <p className="mt-3 text-sm leading-7 text-white/72">
            If the checklist reveals unclear scope, missing permits, questionable access, damaged equipment, or unplanned exposures, the correct response is to stop and reset the plan before starting work.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function DailySafety() {
  const [activeScope, setActiveScope] = useState('All')
  const [checkedIds, setCheckedIds] = useState([])
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [jobDetails, setJobDetails] = useState({
    company: '',
    siteName: '',
    supervisor: '',
    musterPoint: '',
    permitNumbers: '',
    shiftLabel: '',
    crewName: '',
    selectedHazards: [],
  })

  useEffect(() => {
    const rawState = window.localStorage.getItem(SAFETY_STORAGE_KEY)

    if (!rawState) {
      return
    }

    try {
      const parsed = JSON.parse(rawState)
      setActiveScope(parsed.activeScope ?? 'All')
      setCheckedIds(Array.isArray(parsed.checkedIds) ? parsed.checkedIds : [])
      setJobDetails((current) => ({
        ...current,
        ...parsed.jobDetails,
        selectedHazards: Array.isArray(parsed.jobDetails?.selectedHazards)
          ? parsed.jobDetails.selectedHazards
          : [],
      }))
    } catch {
      window.localStorage.removeItem(SAFETY_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      SAFETY_STORAGE_KEY,
      JSON.stringify({
        activeScope,
        checkedIds,
        jobDetails,
      })
    )
    setLastSavedAt(Date.now())
  }, [activeScope, checkedIds, jobDetails])

  const clearSavedProgress = () => {
    window.localStorage.removeItem(SAFETY_STORAGE_KEY)
    setActiveScope('All')
    setCheckedIds([])
    setLastSavedAt(null)
    setJobDetails({
      company: '',
      siteName: '',
      supervisor: '',
      musterPoint: '',
      permitNumbers: '',
      shiftLabel: '',
      crewName: '',
      selectedHazards: [],
    })
  }

  return (
    <LibraryPageLayout
      eyebrow="― Daily Professional Resources ―"
      title="Daily Safety Checklist"
      description="A stronger pre-shift safety hub for field teams, shop crews, maintenance work, shipping activity, and office-based planning support."
      intro="Use this page at the start of the shift, before task changes, and any time conditions move faster than the plan. The goal is simple: catch the misses before they become the problem."
      customContent={
        <div className="space-y-12">
          <div className="flex justify-center">
            <div className="rounded-full border border-green-400/20 bg-green-500/10 px-5 py-2 text-sm text-green-200">
              {lastSavedAt
                ? `Saved locally in this browser at ${new Date(lastSavedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : 'Auto-saves locally in this browser while you work'}
            </div>
          </div>
          <OverviewPanel />
          <JobInfoPanel
            jobDetails={jobDetails}
            setJobDetails={setJobDetails}
            selectedHazards={jobDetails.selectedHazards}
          />
          <DailyChecklistHub
            activeScope={activeScope}
            setActiveScope={setActiveScope}
            checkedIds={checkedIds}
            setCheckedIds={setCheckedIds}
            selectedHazards={jobDetails.selectedHazards}
            onClearSavedProgress={clearSavedProgress}
          />
          <ChecklistTemplatesPanel jobDetails={jobDetails} />
          <HazardFocusPanel />
          <RelatedResourcesPanel />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}
