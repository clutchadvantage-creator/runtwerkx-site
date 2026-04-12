import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PAGE_URL =
  'https://runtwerkx.com/knowledge-library/calculators-charts-conversions/field-reference-charts'

const SLOPE_ROWS = [
  { degrees: '1°', percent: '1.75%', inchesPerFoot: '0.210', ratio: '1:57.3', useCase: 'Very slight drainage and long-run layout checks' },
  { degrees: '2°', percent: '3.49%', inchesPerFoot: '0.419', ratio: '1:28.6', useCase: 'Low-slope run where only modest fall is needed' },
  { degrees: '3°', percent: '5.24%', inchesPerFoot: '0.629', ratio: '1:19.1', useCase: 'Drainage and gentle install pitch reference' },
  { degrees: '5°', percent: '8.75%', inchesPerFoot: '1.050', ratio: '1:11.4', useCase: 'Common visible slope without becoming steep' },
  { degrees: '7.5°', percent: '13.16%', inchesPerFoot: '1.579', ratio: '1:7.6', useCase: 'Steeper ramps and framed transitions' },
  { degrees: '10°', percent: '17.63%', inchesPerFoot: '2.116', ratio: '1:5.7', useCase: 'Field-fit supports and moderate incline work' },
  { degrees: '12°', percent: '21.26%', inchesPerFoot: '2.551', ratio: '1:4.7', useCase: 'Fast roof-pitch and incline visual check' },
  { degrees: '15°', percent: '26.79%', inchesPerFoot: '3.215', ratio: '1:3.7', useCase: 'Aggressive incline and support framing' },
  { degrees: '18°', percent: '32.49%', inchesPerFoot: '3.899', ratio: '1:3.1', useCase: 'Common stair and incline comparison point' },
  { degrees: '22.5°', percent: '41.42%', inchesPerFoot: '4.970', ratio: '1:2.4', useCase: 'Miter, offset, and angled frame work' },
  { degrees: '30°', percent: '57.74%', inchesPerFoot: '6.928', ratio: '1:1.7', useCase: 'High-visibility angled work and supports' },
  { degrees: '45°', percent: '100.00%', inchesPerFoot: '12.000', ratio: '1:1', useCase: 'Square corner diagonal and equal-rise-run work' },
]

const RIGGING_ROWS = [
  { angle: '90°', factor: '1.000', example: '1,000 lb per leg on a 2,000 lb balanced lift', note: 'Legs vertical. Lowest sling-leg tension.' },
  { angle: '75°', factor: '1.035', example: '1,035 lb per leg on a 2,000 lb balanced lift', note: 'Very efficient angle with minimal tension increase.' },
  { angle: '60°', factor: '1.155', example: '1,155 lb per leg on a 2,000 lb balanced lift', note: 'Common planning reference for two-leg lifts.' },
  { angle: '50°', factor: '1.305', example: '1,305 lb per leg on a 2,000 lb balanced lift', note: 'Tension starts climbing faster than many crews expect.' },
  { angle: '45°', factor: '1.414', example: '1,414 lb per leg on a 2,000 lb balanced lift', note: 'Important threshold where leg load rises quickly.' },
  { angle: '40°', factor: '1.556', example: '1,556 lb per leg on a 2,000 lb balanced lift', note: 'A small drop in angle creates a meaningful load jump.' },
  { angle: '30°', factor: '2.000', example: '2,000 lb per leg on a 2,000 lb balanced lift', note: 'Low-angle lift geometry becomes demanding fast.' },
  { angle: '20°', factor: '2.924', example: '2,924 lb per leg on a 2,000 lb balanced lift', note: 'Usually a warning sign to reconsider the lift plan.' },
  { angle: '15°', factor: '3.864', example: '3,864 lb per leg on a 2,000 lb balanced lift', note: 'Very high sling tension. Do not treat as routine.' },
]

const ACCESS_ROWS = [
  { ladderLength: '8 ft', baseSetback: '2 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Simple 4:1 setup check for short access ladders.' },
  { ladderLength: '12 ft', baseSetback: '3 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Common service and maintenance access length.' },
  { ladderLength: '16 ft', baseSetback: '4 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Frequent job trailer, mezzanine, and roof edge setup.' },
  { ladderLength: '20 ft', baseSetback: '5 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Longer access ladder where footing matters more.' },
  { ladderLength: '24 ft', baseSetback: '6 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Good quick-check length for exterior access setups.' },
  { ladderLength: '28 ft', baseSetback: '7 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Setup drift becomes easier to miss at this length.' },
  { ladderLength: '32 ft', baseSetback: '8 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Footing and tie-off planning become more critical.' },
  { ladderLength: '36 ft', baseSetback: '9 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Long access setup where ground condition must be checked carefully.' },
  { ladderLength: '40 ft', baseSetback: '10 ft', topReach: 'At least 3 ft above landing if used for access', note: 'Use only where the ladder class and site conditions fit the task.' },
]

const LAYOUT_ROWS = [
  { angle: '11.25°', travelMultiplier: '5.126', risePer12: '2.39 in', note: 'Light directional shift and trim layout reference.' },
  { angle: '15°', travelMultiplier: '3.864', risePer12: '3.22 in', note: 'Useful for light angle framing and approach transitions.' },
  { angle: '22.5°', travelMultiplier: '2.613', risePer12: '4.97 in', note: 'Common offset and miter angle in field layout.' },
  { angle: '30°', travelMultiplier: '2.000', risePer12: '6.93 in', note: 'Clean field angle that is easy to stage and verify.' },
  { angle: '37.5°', travelMultiplier: '1.643', risePer12: '9.21 in', note: 'Useful when offsets steepen but are not yet 45°.' },
  { angle: '45°', travelMultiplier: '1.414', risePer12: '12.00 in', note: 'Most common equal offset and square-corner diagonal reference.' },
  { angle: '60°', travelMultiplier: '1.155', risePer12: '20.78 in', note: 'Steep directional change where travel stays close to offset.' },
]

const METRIC_ROWS = [
  { metric: '5 mm', imperial: '0.197 in', fieldUse: 'Shim stack, panel gap, fine fit-up', slopePerMeter: '5 mm/m = 0.5%' },
  { metric: '10 mm', imperial: '0.394 in', fieldUse: 'Small setback, trim reveal, anchor adjustment', slopePerMeter: '10 mm/m = 1.0%' },
  { metric: '12 mm', imperial: '0.472 in', fieldUse: 'Near 1/2 in reference for mixed-dimension work', slopePerMeter: '12 mm/m = 1.2%' },
  { metric: '25 mm', imperial: '0.984 in', fieldUse: 'Near 1 in standoff or hardware spacing', slopePerMeter: '25 mm/m = 2.5%' },
  { metric: '38 mm', imperial: '1.496 in', fieldUse: 'Near 1-1/2 in offset and framing dimension', slopePerMeter: '38 mm/m = 3.8%' },
  { metric: '50 mm', imperial: '1.969 in', fieldUse: 'Near 2 in field spacing and penetration check', slopePerMeter: '50 mm/m = 5.0%' },
  { metric: '75 mm', imperial: '2.953 in', fieldUse: 'Near 3 in clearance, curb, and support callout', slopePerMeter: '75 mm/m = 7.5%' },
  { metric: '100 mm', imperial: '3.937 in', fieldUse: 'Near 4 in opening and curb reference', slopePerMeter: '100 mm/m = 10.0%' },
  { metric: '150 mm', imperial: '5.906 in', fieldUse: 'Near 6 in layout and embed spacing', slopePerMeter: '150 mm/m = 15.0%' },
  { metric: '300 mm', imperial: '11.811 in', fieldUse: 'Near 12 in module and spacing check', slopePerMeter: '300 mm/m = 30.0%' },
  { metric: '600 mm', imperial: '23.622 in', fieldUse: 'Near 24 in framing and support pattern', slopePerMeter: '600 mm/m = 60.0%' },
  { metric: '900 mm', imperial: '35.433 in', fieldUse: 'Near 36 in guard, rail, and access geometry', slopePerMeter: '900 mm/m = 90.0%' },
  { metric: '1200 mm', imperial: '47.244 in', fieldUse: 'Near 48 in module and platform planning', slopePerMeter: '1200 mm/m = 120.0%' },
  { metric: '2400 mm', imperial: '94.488 in', fieldUse: 'Near 8 ft sheet and field module reference', slopePerMeter: '2400 mm/m = 240.0%' },
]

const LOAD_SPAN_ROWS = [
  { check: 'Simple support reactions', formula: 'Center load P -> P/2 at each support', quickUse: 'Fast support check for a centered hoist, pallet, or equipment load', caution: 'Assumes a centered point load on a simple span only.' },
  { check: 'Uniform load reactions', formula: 'Uniform load w over span L -> wL/2 at each support', quickUse: 'Useful for trays, platforms, staging, and distributed material stacks', caution: 'Load must be reasonably uniform across the span.' },
  { check: 'Center-load moment', formula: 'Mmax = PL/4', quickUse: 'Quick moment sanity check when a single heavy item lands midspan', caution: 'Only valid for a centered point load on a simple span.' },
  { check: 'Uniform-load moment', formula: 'Mmax = wL²/8', quickUse: 'Useful for rough beam or plank demand comparison', caution: 'Not a substitute for design tables or engineered review.' },
  { check: 'Deflection screen', formula: 'Utility L/240 | finish-sensitive L/360 | strict L/480', quickUse: 'Fast conversation starter when a member feels too soft across the span', caution: 'A rule-of-thumb screen only, not approval criteria by itself.' },
  { check: 'Walk plank span', formula: '2x10 scaffold plank quick check: keep span conservative around 6 ft or less unless rated otherwise', quickUse: 'Field reminder to verify plank rating before spanning casually', caution: 'Always defer to stamped plank rating and site rules.' },
  { check: 'Unistrut / light channel', formula: 'Longer span means sharply higher deflection even when load seems small', quickUse: 'Use when deciding whether a support row can be skipped', caution: 'Manufacturer tables govern actual span and load limits.' },
  { check: 'Midspan placement penalty', formula: 'Point load at midspan is usually the harshest simple-span placement', quickUse: 'Helps crews reposition equipment closer to support when possible', caution: 'Actual worst case changes with load type and framing condition.' },
]

const QUICK_NOTE_ROWS = [
  { topic: 'Slope conversions', summary: 'Grade percent, inches per foot, and degrees are all describing the same geometry.', note: 'Use one chart to avoid redoing the same trig on the tailgate or in the lift.' },
  { topic: 'Rigging angles', summary: 'As sling angle drops, leg tension rises fast.', note: 'A lift that looks reasonable at a glance can overload the rigging once the angle gets shallow.' },
  { topic: 'Access ladders', summary: 'The 4:1 ladder setup rule is a fast field check, not permission to ignore footing or tie-off requirements.', note: 'Length, surface condition, ladder class, and securement still matter.' },
  { topic: 'Offset multipliers', summary: 'Travel is always longer than offset unless the run is perfectly vertical.', note: 'Quick multipliers reduce layout mistakes on supports, conduit paths, and field-fit framing.' },
  { topic: 'Metric field work', summary: 'Mixed imperial and metric jobs lose time when crews keep converting the same common dimensions by memory.', note: 'One quick lookup sheet reduces avoidable conversion misses in layout, embeds, and fit-up.' },
  { topic: 'Load and span checks', summary: 'A quick support or span screen is useful, but it is not the same thing as capacity verification.', note: 'Use the quick-check tab to spot problems early, then confirm against the actual member, rating, or engineered requirement.' },
  { topic: 'Daily use intent', summary: 'This page is built for quick confirmation, not deep design calculations.', note: 'Use it to speed up common decisions, then step into the governing procedure when the task demands it.' },
]

const QUICK_PILLS = ['45°', '30°', '4:1', '3 ft', '2.000', '1.414', '25 mm', 'L/360']

const NOTEBOOK_TABS = [
  { key: 'slope', label: 'Slope / Grade', activeClass: 'bg-emerald-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'rigging', label: 'Rigging Angles', activeClass: 'bg-blue-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'access', label: 'Access / Ladder', activeClass: 'bg-amber-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'layout', label: 'Layout Offsets', activeClass: 'bg-zinc-700 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'metric', label: 'Metric Quick Ref', activeClass: 'bg-cyan-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'loadspan', label: 'Load / Span Checks', activeClass: 'bg-rose-600 text-white', idleClass: 'bg-white/80 text-black/70' },
]

function GraphBackdrop() {
  const horizontal = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({ id: i, top: `${8 + i * 6.6}%`, delay: `${(i % 6) * 0.35}s` })),
    []
  )

  const vertical = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({ id: i, left: `${6 + i * 7.8}%`, delay: `${(i % 5) * 0.45}s` })),
    []
  )

  const points = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${8 + i * 4.6}%`,
        top: `${18 + ((i * 11) % 36)}%`,
        delay: `${(i % 8) * 0.3}s`,
      })),
    []
  )

  const labels = useMemo(
    () =>
      ['field', 'grade', '4:1', 'lift', '45deg', 'travel', 'sling', 'offset'].map((value, i) => ({
        id: i,
        value,
        left: `${10 + i * 10.2}%`,
        top: `${14 + (i % 2) * 8}%`,
        delay: `${i * 0.32}s`,
      })),
    []
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_42%),linear-gradient(to_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(16,185,129,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.14)_1px,transparent_1px)] [background-size:42px_42px]" />

      {horizontal.map((line) => (
        <span key={`h-${line.id}`} className="absolute left-0 right-0 h-px bg-emerald-400/20 animate-pulse" style={{ top: line.top, animationDelay: line.delay }} />
      ))}

      {vertical.map((line) => (
        <span key={`v-${line.id}`} className="absolute top-0 bottom-0 w-px bg-emerald-400/15 animate-pulse" style={{ left: line.left, animationDelay: line.delay }} />
      ))}

      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M40 610 C170 590, 300 540, 430 480 S700 360, 850 320 S1030 260, 1160 220" fill="none" stroke="rgba(52,211,153,0.34)" strokeWidth="2" />
        <path d="M40 665 C180 650, 330 620, 480 600 S760 550, 920 500 S1060 470, 1170 450" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      </svg>

      {points.map((point) => (
        <span key={`p-${point.id}`} className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400/55 shadow-[0_0_14px_rgba(16,185,129,0.45)] animate-pulse" style={{ left: point.left, top: point.top, animationDelay: point.delay }} />
      ))}

      {labels.map((label) => (
        <span key={`l-${label.id}`} className="absolute text-[10px] uppercase tracking-[0.24em] text-emerald-300/35 animate-[fadeFloat_5s_ease-in-out_infinite]" style={{ left: label.left, top: label.top, animationDelay: label.delay }}>
          {label.value}
        </span>
      ))}
    </div>
  )
}

function QuickRefPill({ value, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        isActive ? 'border-emerald-400 bg-emerald-500/15 text-white' : 'border-emerald-500/20 bg-emerald-500/8 text-zinc-200 hover:border-emerald-400'
      }`}
    >
      {value}
    </button>
  )
}

function NotebookTab({ tab, activeTab, onClick }) {
  const isActive = activeTab === tab.key

  return (
    <button
      onClick={() => onClick(tab.key)}
      className={`rounded-t-xl border border-black/20 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
        isActive ? `${tab.activeClass} translate-y-[2px] shadow-[0_8px_18px_rgba(0,0,0,0.20)]` : `${tab.idleClass} hover:-translate-y-[1px]`
      }`}
    >
      {tab.label}
    </button>
  )
}

function NotebookPanel({ activeTab, children }) {
  return <div key={activeTab} className="animate-[pageFlip_340ms_ease] will-change-transform">{children}</div>
}

function FooterStatusPanel({ activeTab, searchTerm }) {
  const tabLabel =
    activeTab === 'slope'
      ? 'Slope and Grade Reference'
      : activeTab === 'rigging'
        ? 'Rigging Angle Factors'
        : activeTab === 'access'
          ? 'Access and Ladder Checks'
          : activeTab === 'layout'
            ? 'Layout Offset Multipliers'
            : activeTab === 'metric'
              ? 'Metric Field Reference'
              : 'Load and Span Quick Checks'

  return (
    <section className="mt-24">
      <div className="rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-6 backdrop-blur-sm">
        <div className="mb-4 border-b border-zinc-800 pb-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">― Reference Footer ―</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Chart Environment Status</h3>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-zinc-300">Reference Sheet Online</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Reference Type</p>
            <p className="mt-3 text-xl font-semibold text-white">Field Reference Charts</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Active Tab</p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Primary Use</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Quick geometry, metric conversion, and load-span screening reference for daily installs, lift planning conversations, and field layout checks.</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Search Filter</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{searchTerm ? `Active: ${searchTerm}` : 'No filter active'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FieldReferenceCharts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('slope')

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes fadeFloat {
        0% { opacity: 0; transform: translateY(10px); }
        25% { opacity: .55; }
        70% { opacity: .18; }
        100% { opacity: 0; transform: translateY(-10px); }
      }
      @keyframes notebookDrift {
        0% { opacity: .04; transform: translateX(-8px); }
        50% { opacity: .08; transform: translateX(8px); }
        100% { opacity: .04; transform: translateX(-8px); }
      }
      @keyframes pageFlip {
        0% { opacity: 0; transform: perspective(1000px) rotateY(-8deg) translateX(18px); }
        100% { opacity: 1; transform: perspective(1000px) rotateY(0deg) translateX(0); }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const filteredSlopeRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return SLOPE_ROWS
    return SLOPE_ROWS.filter((row) => [row.degrees, row.percent, row.inchesPerFoot, row.ratio, row.useCase].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredRiggingRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return RIGGING_ROWS
    return RIGGING_ROWS.filter((row) => [row.angle, row.factor, row.example, row.note].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredAccessRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return ACCESS_ROWS
    return ACCESS_ROWS.filter((row) => [row.ladderLength, row.baseSetback, row.topReach, row.note].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredLayoutRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return LAYOUT_ROWS
    return LAYOUT_ROWS.filter((row) => [row.angle, row.travelMultiplier, row.risePer12, row.note].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredMetricRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return METRIC_ROWS
    return METRIC_ROWS.filter((row) => [row.metric, row.imperial, row.fieldUse, row.slopePerMeter].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredLoadSpanRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return LOAD_SPAN_ROWS
    return LOAD_SPAN_ROWS.filter((row) => [row.check, row.formula, row.quickUse, row.caution].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const filteredQuickNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return QUICK_NOTE_ROWS
    return QUICK_NOTE_ROWS.filter((row) => [row.topic, row.summary, row.note].join(' ').toLowerCase().includes(term))
  }, [searchTerm])

  const tabTitle =
    activeTab === 'slope'
      ? 'Slope, Grade, and Pitch Reference'
      : activeTab === 'rigging'
        ? 'Rigging Angle Factor Reference'
        : activeTab === 'access'
          ? 'Access and Ladder Setup Reference'
          : activeTab === 'layout'
            ? 'Layout Offset Multiplier Reference'
            : activeTab === 'metric'
              ? 'Metric Field Conversion Reference'
              : 'Load and Span Quick-Check Reference'

  const tabDescription =
    activeTab === 'slope'
      ? 'Use this sheet to move between degrees, percent grade, inches per foot, and quick visual slope ratios without doing field math twice.'
      : activeTab === 'rigging'
        ? 'Use this tab when teams need a fast reminder that sling tension rises fast as the leg angle gets lower.'
        : activeTab === 'access'
          ? 'Quick ladder setback reference built around the 4:1 setup check and practical access reminders.'
          : activeTab === 'layout'
            ? 'Quick angle multipliers for field offsets, directional changes, and diagonal layout work where travel is longer than the raw offset.'
            : activeTab === 'metric'
              ? 'Use this tab for fast mixed-unit field work, common mm-to-inch conversions, and quick grade-per-meter checks.'
              : 'Use this tab for fast support-reaction, moment, deflection-screen, and span sanity checks before small field assumptions turn into bad decisions.'

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Field Reference Charts | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Field Reference Charts for slope and grade lookup, rigging angle factors, ladder setup checks, metric field conversions, load/span quick checks, and daily layout multipliers."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Field Reference Charts | RuntWerkx" />
        <meta
          property="og:description"
          content="Notebook-style field reference page for grade conversion, rigging-angle review, ladder checks, metric quick reference, load/span screening, and layout multipliers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Field Reference Charts | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Daily-use field notebook for slope, rigging, access, metric conversion, load/span, and layout reference checks."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: 'RuntWerkx Field Reference Charts',
            url: PAGE_URL,
            description:
              'Field reference notebook for slope conversions, ladder setup checks, rigging-angle factors, metric field conversions, load/span quick checks, and common offset multipliers.',
            publisher: {
              '@type': 'Organization',
              name: 'RuntWerkx',
              url: 'https://runtwerkx.com',
            },
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-10 lg:px-14">
        <GraphBackdrop />

        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="mb-8">
            <Link to="/knowledge-library/calculators-charts-conversions" className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">
              ← Back to Calculators, Charts & Conversions
            </Link>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-emerald-400">― Current Location ―</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">Field Reference Charts</h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              A daily-use field notebook for quick geometry, access, and layout checks when the crew needs a reliable answer without stopping to rebuild the math.
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              This page is aimed at the kind of questions that show up constantly on site: how much fall per foot, what the sling-angle penalty looks like, where the ladder base should land, how common metric dimensions translate in the field, and whether a span or support assumption looks wrong before work keeps moving.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {QUICK_PILLS.map((item) => (
                <QuickRefPill key={item} value={item} isActive={searchTerm.toLowerCase() === item.toLowerCase()} onClick={() => setSearchTerm((prev) => prev.toLowerCase() === item.toLowerCase() ? '' : item)} />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="mx-auto max-w-5xl">
              <div className="mb-14 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">― Reference Sheet ―</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{tabTitle}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">{tabDescription}</p>
              </div>

              <div className="relative overflow-visible rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="absolute -top-10 left-10 z-20 flex flex-wrap gap-2">
                  {NOTEBOOK_TABS.map((tab) => <NotebookTab key={tab.key} tab={tab} activeTab={activeTab} onClick={setActiveTab} />)}
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-6 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">RuntWerkx Reference</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">Daily Field Notebook</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Built for crews, foremen, and installers who need quick answers on slopes, angles, access geometry, and field-fit layout without bouncing between four different reference sources.
                        </p>
                      </div>

                      <div className="w-full xl:w-[420px]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            activeTab === 'slope'
                              ? 'Try 5°, 1:1, 3.215, or 100%'
                              : activeTab === 'rigging'
                                ? 'Try 45°, 2.000, or balanced lift'
                                : activeTab === 'access'
                                  ? 'Try 24 ft, 6 ft, or 3 ft above landing'
                                  : activeTab === 'layout'
                                    ? 'Try 22.5°, 1.414, or rise per 12'
                                    : activeTab === 'metric'
                                      ? 'Try 25 mm, 600 mm, 1.0%, or near 1 in'
                                      : 'Try PL/4, L/360, plank, or midspan'
                          }
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      {activeTab === 'slope' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-5 border-b border-black/10 bg-emerald-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Degrees</div>
                              <div>Grade</div>
                              <div>In / Ft</div>
                              <div>Ratio</div>
                              <div>Use Case</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredSlopeRows.map((row, index) => (
                                <div key={`slope-${row.degrees}`} className={`grid grid-cols-5 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.degrees}</div>
                                  <div>{row.percent}</div>
                                  <div>{row.inchesPerFoot}</div>
                                  <div>{row.ratio}</div>
                                  <div>{row.useCase}</div>
                                </div>
                              ))}
                              {filteredSlopeRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Why This Tab Helps</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Field teams often hear slope described three different ways in one conversation. This keeps those forms aligned.</p>
                                <p>It is especially useful when layout marks, drainage assumptions, and install language are not all using the same format.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Practical Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Very small grade changes over long runs become meaningful quickly.</p>
                                <p>A half inch missed every ten feet becomes a real install problem by the end of the run.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'rigging' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-blue-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Angle</div>
                              <div>Factor</div>
                              <div>2-Leg Example</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredRiggingRows.map((row, index) => (
                                <div key={`rig-${row.angle}`} className={`grid grid-cols-4 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.angle}</div>
                                  <div>{row.factor}</div>
                                  <div>{row.example}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredRiggingRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">Read It Correctly</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>This factor assumes a balanced two-leg lift and is used to see how leg load rises as the sling angle drops.</p>
                                <p>It is a planning reminder, not a replacement for the full lift plan, rigging inspection, or site procedure.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">Daily Use Warning</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Crews routinely underestimate what happens below 45°.</p>
                                <p>If a low-angle connection is showing up in the plan, that is usually the moment to stop and review the lift geometry carefully.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'access' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-amber-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Ladder</div>
                              <div>Base Setback</div>
                              <div>Top Extension</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredAccessRows.map((row, index) => (
                                <div key={`acc-${row.ladderLength}`} className={`grid grid-cols-4 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.ladderLength}</div>
                                  <div>{row.baseSetback}</div>
                                  <div>{row.topReach}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredAccessRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">Use It Fast</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>The 4:1 setup check is one of the simplest field geometry references and one of the easiest to drift away from.</p>
                                <p>This tab gives fast base-setback values so crews do not have to estimate by eye.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">Scope Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Ladder duty rating, condition, surface stability, tie-off, and site rules still control the actual setup.</p>
                                <p>This reference is there to support fast geometry checks, not to replace those requirements.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'layout' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-zinc-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Angle</div>
                              <div>Travel Multiplier</div>
                              <div>Rise / 12</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredLayoutRows.map((row, index) => (
                                <div key={`lay-${row.angle}`} className={`grid grid-cols-4 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.angle}</div>
                                  <div>{row.travelMultiplier}</div>
                                  <div>{row.risePer12}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredLayoutRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">Why Travel Matters</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Offset work almost always needs more material or path length than the straight-line offset dimension suggests.</p>
                                <p>These multipliers help crews price, cut, and layout angled runs without stopping for fresh trig every time.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">Common Miss</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Teams often remember the angle but forget the path length change.</p>
                                <p>That is where the wrong cut length, wrong support spacing, or wrong material quantity starts showing up.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'metric' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-cyan-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Metric</div>
                              <div>Imperial</div>
                              <div>Field Use</div>
                              <div>Grade / m</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredMetricRows.map((row, index) => (
                                <div key={`metric-${row.metric}`} className={`grid grid-cols-4 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.metric}</div>
                                  <div>{row.imperial}</div>
                                  <div>{row.fieldUse}</div>
                                  <div>{row.slopePerMeter}</div>
                                </div>
                              ))}
                              {filteredMetricRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Where It Helps</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Mixed-unit jobs waste time when crews keep converting the same dimensions in their head during layout and fit-up.</p>
                                <p>This tab keeps the most common field-size translations visible so the team can confirm and keep moving.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Metric Grade Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>In metric field language, millimeters per meter is just another expression of percent grade.</p>
                                <p>That makes drainage and install fall easier to communicate when one trade is speaking mm/m and another is speaking percent.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'loadspan' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-rose-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Check</div>
                              <div>Formula / Rule</div>
                              <div>Quick Use</div>
                              <div>Caution</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredLoadSpanRows.map((row, index) => (
                                <div key={`load-${row.check}`} className={`grid grid-cols-4 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.check}</div>
                                  <div>{row.formula}</div>
                                  <div>{row.quickUse}</div>
                                  <div>{row.caution}</div>
                                </div>
                              ))}
                              {filteredLoadSpanRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-rose-700">What This Tab Is For</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>This is a fast screening tab for daily work conversations about supports, spans, planks, trays, platforms, and midspan loading.</p>
                                <p>It helps catch obviously bad assumptions early, before someone decides a member can probably take it.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-rose-700">What It Is Not</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>These checks are not load ratings, engineered approvals, or manufacturer span tables.</p>
                                <p>If the decision affects safety, capacity, or compliance, the actual product data, design basis, or competent review still controls.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </NotebookPanel>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Daily Field Notes</p>
                      <div className="mt-4 space-y-4">
                        {filteredQuickNotes.map((row) => (
                          <div key={row.topic} className="rounded-2xl border border-black/10 bg-white/60 p-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/75">{row.topic}</p>
                            <p className="mt-2 text-sm leading-7 text-black/75">{row.summary}</p>
                            <p className="mt-2 text-sm leading-7 text-black/60">{row.note}</p>
                          </div>
                        ))}
                        {filteredQuickNotes.length === 0 && <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-black/60">No notes matched that search.</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-6xl">
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">― Quick Notes ―</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Reference Companion</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">Short reminders for the kind of geometry and access decisions crews make every day.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Most Used Checks</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Check slope in the same language the install team is using.</p>
                    <p>Check rigging angle before assuming each leg only sees half the load.</p>
                    <p>Check ladder setback before the setup drifts into a guess.</p>
                    <p>Check metric dimensions and span assumptions before the crew starts cutting or staging material.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Why This Page Exists</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Field work burns time when geometry has to be re-derived from memory over and over.</p>
                    <p>This page compresses the most common answers into one place so the crew can confirm and move, even when the conversation jumps between units, angles, and span concerns.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Practical Warning</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>This is a field reference, not a substitute for a lift plan, site-specific procedure, or competent-person review.</p>
                    <p>Use it to speed up common decisions, then step into the governing process whenever the task crosses into formal planning or safety control.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">― What This Chart Covers ―</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Built around fast field geometry decisions</h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This notebook is built to help with the kinds of checks that show up on site constantly: slope conversion, angled lift discussion, ladder placement, offset travel, mixed metric-imperial dimensions, and fast load or span screening. It is meant to reduce friction during real work, not just look complete on the library page.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-500/15 bg-black/40 p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">― Related Tools & References ―</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Continue through the RuntWerkx reference system</h3>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/knowledge-library/calculators-charts-conversions" className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">Calculators, Charts & Conversions</Link>
                <Link to="/knowledge-library/calculators-charts-conversions/tap-drill-chart" className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">Tap & Drill Chart</Link>
                <Link to="/knowledge-library/calculators-charts-conversions/fastener-hardware-reference" className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">Fastener / Hardware Reference</Link>
                <Link to="/knowledge-library/calculators-charts-conversions/common-material-reference-charts" className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">Common Material Reference Charts</Link>
              </div>
            </div>
          </section>

          <FooterStatusPanel activeTab={activeTab} searchTerm={searchTerm} />
        </div>
      </section>
    </div>
  )
}