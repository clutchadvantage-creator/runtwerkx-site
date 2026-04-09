import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Star,
  TimerReset,
} from 'lucide-react'
import LibraryPageLayout from './LibraryPageLayout'
import {
  addPdfChecklistSection,
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  toPdfFileName,
} from '../../utils/pdfExport'

const PROFESSIONAL_TIPS_STORAGE_KEY = 'runtwerkx-professional-tips-state'

const roleFilters = ['All', 'Supervisor', 'Lead hand', 'Operator', 'Fabricator', 'Maintenance', 'Project support']
const topicFilters = ['All', 'Planning', 'Communication', 'Execution', 'Quality', 'Safety', 'Professionalism']

function toSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const professionalTips = [
  {
    title: 'Walk the job before you talk the job',
    role: 'Supervisor',
    topic: 'Planning',
    situation: 'Pre-shift setup and job kickoff',
    tip: 'Do a physical walkdown before the briefing so the crew hears the actual conditions, not yesterday’s assumptions.',
    whyItWorks: 'The fastest way to lose credibility is to brief a job from memory while the field has already changed.',
    watchFor: 'Material stacks moved, access changed, permits lagging, another trade entered the space, or weather altered the exposure.',
  },
  {
    title: 'Repeat back the handoff when the task is critical',
    role: 'Lead hand',
    topic: 'Communication',
    situation: 'Shift handoff or task transfer',
    tip: 'When the work has real consequence, repeat the key details back out loud instead of assuming the handoff was clear enough.',
    whyItWorks: 'People hear what they expect. Repeat-back closes the gap between what was said and what was actually understood.',
    watchFor: 'Isolation status, measurements, unfinished checks, lift path changes, or client hold points that were mentioned once and forgotten.',
  },
  {
    title: 'Stage the next 15 minutes, not the whole day',
    role: 'Operator',
    topic: 'Execution',
    situation: 'Fast-paced production work',
    tip: 'When the day is moving fast, focus on staging the immediate next block of work cleanly instead of trying to mentally run the entire shift at once.',
    whyItWorks: 'Short-horizon discipline keeps quality and safety intact when pace increases and interruptions start stacking up.',
    watchFor: 'Tools drifting out of place, material mix-ups, wrong consumables, or rushing because the entire day feels urgent at once.',
  },
  {
    title: 'Mark what changed, not just what is complete',
    role: 'Project support',
    topic: 'Professionalism',
    situation: 'Documentation and coordination',
    tip: 'Good updates call out what changed since the last check, not just that work is still happening.',
    whyItWorks: 'Decision-makers usually need delta information more than status language.',
    watchFor: 'Revised dimensions, schedule shifts, missing material, changed risk level, or inspection outcomes that affect the next crew.',
  },
  {
    title: 'If the fit-up looks forced, stop forcing it',
    role: 'Fabricator',
    topic: 'Quality',
    situation: 'Fit-up, layout, and fabrication',
    tip: 'When pieces need more persuasion than expected, assume something upstream is wrong until proven otherwise.',
    whyItWorks: 'Forcing parts together can hide layout, cut, or drawing errors that multiply downstream.',
    watchFor: 'Wrong revision, heat distortion, inaccurate prep, reversed orientation, or a tolerance issue that will show up worse after welding.',
  },
  {
    title: 'The cleanest tool crib usually belongs to the strongest crew',
    role: 'Lead hand',
    topic: 'Professionalism',
    situation: 'Daily discipline and team standards',
    tip: 'Organization is not cosmetic. The crews with repeatable work habits usually have repeatable equipment control too.',
    whyItWorks: 'Order reduces delay, finger-pointing, damage, and the half-hidden defects that show up at the worst moment.',
    watchFor: 'Borrowed tools with no owner, mixed consumables, damaged cords, empty batteries, or “somebody had it last” culture.',
  },
  {
    title: 'Do the unsafe thing slower is not a control',
    role: 'Operator',
    topic: 'Safety',
    situation: 'Workarounds and production pressure',
    tip: 'If the method is wrong, slowing it down does not make it acceptable. Reset the plan instead of trying to carefully do the unsafe version.',
    whyItWorks: 'Experience can make a bad shortcut look manageable right up until the moment it fails.',
    watchFor: 'Bypassed guards, improvised lifting, partial lockout, unstable access, damaged rigging, or “we only need one quick move.”',
  },
  {
    title: 'Fix recurring delays at the source, not with heroics',
    role: 'Supervisor',
    topic: 'Execution',
    situation: 'Workflow bottlenecks',
    tip: 'When the same delay shows up every week, stop praising the people who keep saving it and fix the root cause.',
    whyItWorks: 'Heroic recovery hides weak systems and makes the operation dependent on a few people absorbing the failure.',
    watchFor: 'Late drawings, missing parts, bad staging, repeated approvals lag, and equipment that is always “almost ready.”',
  },
  {
    title: 'A quiet crew is not always a coordinated crew',
    role: 'Supervisor',
    topic: 'Communication',
    situation: 'Crew oversight',
    tip: 'Low noise can mean smooth execution, but it can also mean people stopped asking questions because they think nobody wants to hear them.',
    whyItWorks: 'Good crews communicate clearly. Silent confusion usually surfaces later as rework, missed hazards, or bad handoffs.',
    watchFor: 'No clarifying questions, vague nods, tasks starting before the full brief is done, or one person carrying all the real context.',
  },
  {
    title: 'Maintenance starts with how people operate the asset',
    role: 'Maintenance',
    topic: 'Safety',
    situation: 'Equipment reliability',
    tip: 'If a machine keeps getting repaired for the same failure, look at operating habits and setup discipline, not just the parts list.',
    whyItWorks: 'A strong PM program gets erased fast by poor startup, poor shutdown, or abuse that nobody calls out.',
    watchFor: 'Hot starts, dry starts, overload, bypassed alarms, dirty cooling paths, or repeated nuisance resets.',
  },
  {
    title: 'Write the note the next shift actually needs',
    role: 'Project support',
    topic: 'Communication',
    situation: 'Logs, reports, and turnover notes',
    tip: 'Good notes explain what the next person needs to do, what is risky, and what changed, not just that work occurred.',
    whyItWorks: 'A short useful note beats a long vague one every time in operations.',
    watchFor: 'Missing dimensions, no location reference, no pending decision, no owner, or no mention of what is blocked.',
  },
  {
    title: 'Respect the setup because the setup determines the finish',
    role: 'Fabricator',
    topic: 'Quality',
    situation: 'Layout and build preparation',
    tip: 'The finish rarely saves a poor setup. Most final quality problems were visible much earlier if somebody was looking for them.',
    whyItWorks: 'Preparation controls consistency more than late-stage inspection ever can.',
    watchFor: 'Skipped squareness checks, wrong consumable staging, missing reference marks, poor cleanliness, or assumed tolerances.',
  },
].map((tip) => ({ ...tip, id: toSlug(tip.title) }))

const coachingSheets = [
  {
    id: 'pre-shift-coaching',
    title: 'Pre-Shift Coaching Sheet',
    audience: 'Supervisors and crew leads',
    items: ['Top condition changes reviewed', 'Crew questions answered', 'Critical handoff points repeated back', 'Main quality risk identified', 'Main safety risk identified'],
  },
  {
    id: 'handoff-discipline',
    title: 'Shift Handoff Discipline Sheet',
    audience: 'Leads, operators, project support',
    items: ['What changed documented', 'What remains incomplete noted', 'Isolation or permit status confirmed', 'Hold points listed', 'Next owner named'],
  },
  {
    id: 'crew-habits',
    title: 'Crew Habits Review Sheet',
    audience: 'Supervisors and managers',
    items: ['Repeat delay identified', 'Repeat rework identified', 'Tool and staging discipline reviewed', 'Shortcut pressure discussed', 'One process fix assigned'],
  },
]

const selectorThemes = {
  kickoff: {
    title: 'Kickoff and pre-start',
    focus: ['Walk the area before the brief', 'Clarify scope, ownership, and changed conditions', 'Set quality and safety expectations before pace increases'],
    recommendedRole: 'Supervisor',
    recommendedTopic: 'Planning',
    recommendedTipId: 'walk-the-job-before-you-talk-the-job',
  },
  handoff: {
    title: 'Shift handoff and coordination',
    focus: ['Use repeat-back for critical details', 'Highlight what changed, not just what happened', 'Leave the next crew useful notes, not vague updates'],
    recommendedRole: 'Lead hand',
    recommendedTopic: 'Communication',
    recommendedTipId: 'repeat-back-the-handoff-when-the-task-is-critical',
  },
  production: {
    title: 'Fast production rhythm',
    focus: ['Stage the next immediate work block', 'Keep tools and consumables controlled', 'Treat recurring delay as a systems problem, not a personality problem'],
    recommendedRole: 'Operator',
    recommendedTopic: 'Execution',
    recommendedTipId: 'stage-the-next-15-minutes-not-the-whole-day',
  },
  quality: {
    title: 'Quality and fit-up discipline',
    focus: ['Stop forcing mismatched parts', 'Respect setup and reference checks', 'Catch the defect upstream before finish work hides it'],
    recommendedRole: 'Fabricator',
    recommendedTopic: 'Quality',
    recommendedTipId: 'if-the-fit-up-looks-forced-stop-forcing-it',
  },
}

const focusPanels = [
  {
    title: 'What experienced people do differently',
    points: [
      'They look for what changed before they look for what should be happening.',
      'They solve recurring problems upstream instead of getting emotionally attached to last-minute recoveries.',
      'They communicate in a way the next person can actually use, not in a way that only sounds complete.',
    ],
  },
  {
    title: 'What they avoid',
    points: [
      'Using familiarity as a substitute for confirmation.',
      'Treating cleanup, staging, and note-taking like low-value work.',
      'Confusing speed with control when the plan is already wrong.',
    ],
  },
  {
    title: 'How to use this page well',
    points: [
      'Use the filters to match the role or moment you are in, then turn the tip into a quick crew conversation or self-check.',
      'Download the coaching sheets for pre-shift briefings, handoffs, or crew-habit reviews.',
      'Jump into the standards, safety, or maintenance hubs when a tip surfaces a more technical issue that needs formal guidance.',
    ],
  },
]

const officialLinks = [
  {
    title: 'OSHA Recommended Practices for Safety and Health Programs',
    description: 'Management, communication, worker involvement, and continuous-improvement practices that support disciplined daily work.',
    href: 'https://www.osha.gov/safety-management',
  },
  {
    title: 'NIOSH Workplace Safety Topics',
    description: 'Research-backed operational and hazard-control guidance that supports better work habits and safer field decisions.',
    href: 'https://www.cdc.gov/niosh/topics/default.html',
  },
  {
    title: 'Lean Construction Institute',
    description: 'Operational-improvement concepts relevant to planning, handoffs, waste reduction, and field execution discipline.',
    href: 'https://www.leanconstruction.org',
  },
  {
    title: 'SME Manufacturing Resource Center',
    description: 'General manufacturing process-improvement and workforce-development resources for production environments.',
    href: 'https://www.sme.org',
  },
]

function isValidRole(value) {
  return roleFilters.includes(value)
}

function isValidTopic(value) {
  return topicFilters.includes(value)
}

function findTipById(id) {
  return professionalTips.find((tip) => tip.id === id) ?? null
}

function downloadCoachingSheet(template) {
  const { pdf, margin, pageWidth, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'PROFESSIONAL COACHING SHEET',
    title: template.title,
    subtitle: `Audience: ${template.audience}`,
  })

  cursorY = addPdfChecklistSection(pdf, {
    cursorY: cursorY + 12,
    margin,
    maxWidth,
    pageWidth,
    pageHeight,
    label: 'DISCUSSION POINTS',
    items: template.items,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 8,
    margin,
    maxWidth,
    pageHeight,
    label: 'SHIFT NOTES',
    body: 'Crew / Area: ____________________\nCondition changes: ____________________\nMain risk or delay: ____________________\nAssigned follow-up: ____________________\nOwner: ____________________',
    minHeight: 92,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This sheet is a coaching and coordination aid. Final work decisions should still follow the active procedures, permits, drawings, and safety requirements for the job.',
  })

  pdf.save(`${toPdfFileName(template.id)}-professional-coaching-sheet.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Professional Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          The best daily tips are the ones that make the next decision cleaner, not louder
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this page is</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            A curated working reference built around repeatable habits, field judgment, and coordination discipline from experienced industrial environments.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What it is not</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This is not a quote feed, opinion wall, or social stream. Every section is organized around practical use at work.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Best use</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use the selector for the moment you are in, filter the tip library by role or topic, and turn the strongest point into a short briefing or self-check.
          </p>
        </div>
      </div>
    </section>
  )
}

function QuickSelector({ selection, setSelection, onApplyRecommendation }) {
  const current = selectorThemes[selection]

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Quick Selector ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">What kind of moment are you in?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Choose the work moment first to surface the habits that matter most right now.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {Object.entries(selectorThemes).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelection(key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selection === key
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/75 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {value.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-green-400/20 bg-black/60 p-5">
        <h3 className="text-lg font-semibold text-green-400">{current.title}</h3>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-white/80">
          {current.focus.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="font-bold text-green-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onApplyRecommendation(current)}
          className="mt-5 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
        >
          Open Recommended Tip View
        </button>
      </div>
    </section>
  )
}

function SavedViewsPanel({
  favoriteTips,
  savedViews,
  viewName,
  setViewName,
  onSaveView,
  onApplyView,
  onDeleteView,
  onOpenToolboxTalk,
}) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Saved Views ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Saved filter views for supervisors and leads</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Save the filter combinations you return to most often so kickoff, handoff, and coaching views are one click away in this browser.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={viewName}
              onChange={(event) => setViewName(event.target.value)}
              placeholder="Name this saved view"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={onSaveView}
              className="rounded-2xl border border-green-400/25 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              Save Current View
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {savedViews.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/60">
                No saved filter views yet. Save one for a supervisor kickoff, lead handoff, or quality coaching pattern you use often.
              </div>
            ) : (
              savedViews.map((view) => (
                <div key={view.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{view.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/70">
                        {view.role} / {view.topic}
                        {view.search ? ` / ${view.search}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => onApplyView(view)}
                        className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                      >
                        Open View
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteView(view.id)}
                        className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/25 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Favorites ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Favorite tips saved in this browser</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Keep the strongest briefing and coaching points close without turning the page into a feed or timeline.
          </p>

          <div className="mt-6 grid gap-3">
            {favoriteTips.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/60">
                No favorites saved yet. Star a tip in the library to keep it handy for shift starts and lead conversations.
              </div>
            ) : (
              favoriteTips.map((tip) => (
                <div key={tip.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
                    {tip.role} / {tip.topic}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{tip.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{tip.situation}</p>
                  <button
                    type="button"
                    onClick={() => onOpenToolboxTalk(tip.id)}
                    className="mt-4 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                  >
                    Open Toolbox Talk
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ToolboxTalkPanel({ tip, onClose }) {
  if (!tip) {
    return null
  }

  return (
    <section className="rounded-[1.75rem] border border-green-400/20 bg-green-500/[0.08] p-8 shadow-[0_0_35px_rgba(34,197,94,0.10)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">
            ― Toolbox Talk Mode ―
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">{tip.title}</h2>
          <p className="mt-3 text-base leading-8 text-white/75">
            {tip.role} / {tip.topic} / {tip.situation}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/25 hover:text-white"
        >
          Close Talk Mode
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">Core message</p>
          <p className="mt-4 text-lg leading-8 text-white">{tip.tip}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">Why it matters</p>
          <p className="mt-4 text-lg leading-8 text-white/85">{tip.whyItWorks}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">Ask the crew</p>
          <ul className="mt-4 space-y-3 text-base leading-8 text-white/85">
            <li>Where could this show up on today’s job?</li>
            <li>What is the easiest way we could miss it?</li>
            <li>Who owns the check before we keep moving?</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function CoachingSheetsPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Coaching Sheets ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Downloadable daily-discipline sheets</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Use these printable PDFs to guide short crew conversations without turning the page into a quote board or social feed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coachingSheets.map((template) => (
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
              onClick={() => downloadCoachingSheet(template)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              <ClipboardList className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function TipsLibrary({
  search,
  setSearch,
  activeRole,
  setActiveRole,
  activeTopic,
  setActiveTopic,
  filteredTips,
  favoriteIds,
  onToggleFavorite,
  onOpenToolboxTalk,
}) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Searchable Library ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Curated professional tips and field habits</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Filter by role or topic and search by situation, habit, or recurring problem to find the right tip for the moment.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search handoff, fit-up, staging, delay, guard..."
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-2 text-white transition placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400 sm:w-96"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {roleFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveRole(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeRole === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {topicFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveTopic(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeTopic === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredTips.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
            No professional tips matched that search. Try broader terms like handoff, delay, fit-up, note, staging, or safety.
          </div>
        ) : (
          filteredTips.map((entry) => {
            const isFavorite = favoriteIds.includes(entry.id)

            return (
              <article
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-black/40 p-6 transition hover:border-green-400/25 hover:bg-black/50"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
                      <span>{entry.role}</span>
                      <span className="text-white/35">/</span>
                      <span>{entry.topic}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold text-white">{entry.title}</h3>
                    <div className="mt-3 inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
                      {entry.situation}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(entry.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isFavorite
                          ? 'border-green-400/30 bg-green-500/15 text-green-200'
                          : 'border-white/10 bg-black/50 text-white/70 hover:border-green-400/25 hover:text-white'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Favorited' : 'Favorite'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenToolboxTalk(entry.id)}
                      className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                    >
                      Toolbox Talk Mode
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_1.85fr]">
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                      Practical tip
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/75">{entry.tip}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                      Why it works
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/75">{entry.whyItWorks}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                      Watch for
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/80">{entry.watchFor}</p>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

function FocusPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Daily Discipline ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">The habits that usually separate strong crews from stressed crews</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {focusPanels.map((section) => (
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
        <h2 className="mt-4 text-3xl font-bold text-white">Move from good habits into formal controls when needed</h2>
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
            Turn the best habits on this page into pre-start checks and hazard conversations when the work has real risk exposure.
          </p>
        </Link>

        <Link
          to="/knowledge-library/industry-standards"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Industry Standards</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Jump into the standards hub when a “good habit” crosses into a code, permit, or formal compliance question.
          </p>
        </Link>

        <Link
          to="/knowledge-library/maintenance-schedules"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="flex items-center gap-3">
            <TimerReset className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Maintenance</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use the maintenance hub when crew habits, staging, or repeated operating shortcuts are clearly driving reliability problems.
          </p>
        </Link>

        <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.08] p-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-green-300">Professional reminder</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/72">
            The strongest practical tip is usually the one that lowers confusion, lowers rework, and lowers the chance that somebody has to guess.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function ProfessionalTips() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('All')
  const [activeTopic, setActiveTopic] = useState('All')
  const [selection, setSelection] = useState('kickoff')
  const [favoriteIds, setFavoriteIds] = useState([])
  const [savedViews, setSavedViews] = useState([])
  const [viewName, setViewName] = useState('')
  const [selectedTipId, setSelectedTipId] = useState('')
  const [toolboxTalkMode, setToolboxTalkMode] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(null)

  useEffect(() => {
    const rawState = window.localStorage.getItem(PROFESSIONAL_TIPS_STORAGE_KEY)

    if (!rawState) {
      return
    }

    try {
      const parsed = JSON.parse(rawState)
      setSearch(typeof parsed.search === 'string' ? parsed.search : '')
      setActiveRole(isValidRole(parsed.activeRole) ? parsed.activeRole : 'All')
      setActiveTopic(isValidTopic(parsed.activeTopic) ? parsed.activeTopic : 'All')
      setSelection(Object.hasOwn(selectorThemes, parsed.selection) ? parsed.selection : 'kickoff')
      setFavoriteIds(
        Array.isArray(parsed.favoriteIds)
          ? parsed.favoriteIds.filter((id) => findTipById(id))
          : []
      )
      setSavedViews(
        Array.isArray(parsed.savedViews)
          ? parsed.savedViews.filter(
              (view) => typeof view?.name === 'string' && isValidRole(view.role) && isValidTopic(view.topic)
            )
          : []
      )
      setSelectedTipId(findTipById(parsed.selectedTipId)?.id ?? '')
      setToolboxTalkMode(Boolean(parsed.toolboxTalkMode && findTipById(parsed.selectedTipId)))
      setLastSavedAt(parsed.lastSavedAt ?? null)
    } catch {
      window.localStorage.removeItem(PROFESSIONAL_TIPS_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nextRole = params.get('role')
    const nextTopic = params.get('topic')
    const nextSearch = params.get('search')
    const nextTip = params.get('tip')
    const nextToolbox = params.get('toolbox') === '1'
    const nextTheme = params.get('theme')

    if (nextRole && isValidRole(nextRole)) {
      setActiveRole(nextRole)
    }

    if (nextTopic && isValidTopic(nextTopic)) {
      setActiveTopic(nextTopic)
    }

    if (nextSearch !== null) {
      setSearch(nextSearch)
    }

    if (nextTheme && Object.hasOwn(selectorThemes, nextTheme)) {
      setSelection(nextTheme)
    }

    if (nextTip && findTipById(nextTip)) {
      setSelectedTipId(nextTip)
      setToolboxTalkMode(nextToolbox)
    }
  }, [location.search])

  useEffect(() => {
    const nextSavedAt = Date.now()
    window.localStorage.setItem(
      PROFESSIONAL_TIPS_STORAGE_KEY,
      JSON.stringify({
        search,
        activeRole,
        activeTopic,
        selection,
        favoriteIds,
        savedViews,
        selectedTipId,
        toolboxTalkMode,
        lastSavedAt: nextSavedAt,
      })
    )
    setLastSavedAt(nextSavedAt)
  }, [search, activeRole, activeTopic, selection, favoriteIds, savedViews, selectedTipId, toolboxTalkMode])

  useEffect(() => {
    const params = new URLSearchParams()

    if (activeRole !== 'All') {
      params.set('role', activeRole)
    }

    if (activeTopic !== 'All') {
      params.set('topic', activeTopic)
    }

    if (search.trim()) {
      params.set('search', search.trim())
    }

    if (selection !== 'kickoff') {
      params.set('theme', selection)
    }

    if (selectedTipId) {
      params.set('tip', selectedTipId)
      if (toolboxTalkMode) {
        params.set('toolbox', '1')
      }
    }

    const nextUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname
    window.history.replaceState({}, '', nextUrl)
  }, [activeRole, activeTopic, search, selection, selectedTipId, toolboxTalkMode, location.pathname])

  const filteredTips = useMemo(() => {
    const query = search.trim().toLowerCase()

    return professionalTips.filter((tip) => {
      const roleMatches = activeRole === 'All' || tip.role === activeRole
      const topicMatches = activeTopic === 'All' || tip.topic === activeTopic
      const haystack = [
        tip.title,
        tip.role,
        tip.topic,
        tip.situation,
        tip.tip,
        tip.whyItWorks,
        tip.watchFor,
      ]
        .join(' ')
        .toLowerCase()

      return roleMatches && topicMatches && (!query || haystack.includes(query))
    })
  }, [activeRole, activeTopic, search])

  const selectedTip = useMemo(() => findTipById(selectedTipId), [selectedTipId])

  const favoriteTips = useMemo(
    () => favoriteIds.map((id) => findTipById(id)).filter(Boolean),
    [favoriteIds]
  )

  const toggleFavorite = (tipId) => {
    setFavoriteIds((current) =>
      current.includes(tipId) ? current.filter((id) => id !== tipId) : [...current, tipId]
    )
  }

  const openToolboxTalk = (tipId) => {
    setSelectedTipId(tipId)
    setToolboxTalkMode(true)
  }

  const saveCurrentView = () => {
    const trimmedName = viewName.trim()

    if (!trimmedName) {
      return
    }

    const nextView = {
      id: `${toSlug(trimmedName)}-${Date.now()}`,
      name: trimmedName,
      role: activeRole,
      topic: activeTopic,
      search: search.trim(),
    }

    setSavedViews((current) => [nextView, ...current].slice(0, 8))
    setViewName('')
  }

  const applySavedView = (view) => {
    setActiveRole(view.role)
    setActiveTopic(view.topic)
    setSearch(view.search)
    setToolboxTalkMode(false)
  }

  const applyRecommendation = (theme) => {
    setActiveRole(theme.recommendedRole)
    setActiveTopic(theme.recommendedTopic)
    setSearch('')
    openToolboxTalk(theme.recommendedTipId)
  }

  return (
    <LibraryPageLayout
      eyebrow="― Daily Guidance ―"
      title="Daily Professional Tips"
      description="A curated working reference of practical habits, short coaching points, and experienced field judgment for industrial teams."
      intro="Built to strengthen real work instead of becoming a content feed. Use it for shift starts, handoffs, coaching moments, and quick resets when the job is moving faster than the team’s communication."
      customContent={
        <div className="space-y-12">
          <div className="flex justify-center">
            <div className="rounded-full border border-green-400/20 bg-green-500/10 px-5 py-2 text-sm text-green-200">
              {lastSavedAt
                ? `Favorites and views saved locally at ${new Date(lastSavedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : 'Favorites and saved views stay in this browser'}
            </div>
          </div>
          <OverviewPanel />
          <QuickSelector
            selection={selection}
            setSelection={setSelection}
            onApplyRecommendation={applyRecommendation}
          />
          <SavedViewsPanel
            favoriteTips={favoriteTips}
            savedViews={savedViews}
            viewName={viewName}
            setViewName={setViewName}
            onSaveView={saveCurrentView}
            onApplyView={applySavedView}
            onDeleteView={(viewId) =>
              setSavedViews((current) => current.filter((view) => view.id !== viewId))
            }
            onOpenToolboxTalk={openToolboxTalk}
          />
          {toolboxTalkMode ? (
            <ToolboxTalkPanel tip={selectedTip} onClose={() => setToolboxTalkMode(false)} />
          ) : null}
          <CoachingSheetsPanel />
          <TipsLibrary
            search={search}
            setSearch={setSearch}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
            filteredTips={filteredTips}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onOpenToolboxTalk={openToolboxTalk}
          />
          <FocusPanel />
          <RelatedResourcesPanel />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}
