import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PAGE_URL =
  'https://runtwerkx.com/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart'

const SHEET_GAUGE_ROWS = [
  { gauge: '3', inches: '0.2391', mm: '6.073', approxFraction: '15/64', weightSqFt: '9.76' },
  { gauge: '4', inches: '0.2242', mm: '5.695', approxFraction: '7/32', weightSqFt: '9.15' },
  { gauge: '5', inches: '0.2092', mm: '5.314', approxFraction: '13/64', weightSqFt: '8.54' },
  { gauge: '6', inches: '0.1943', mm: '4.935', approxFraction: '3/16', weightSqFt: '7.93' },
  { gauge: '7', inches: '0.1793', mm: '4.554', approxFraction: '11/64', weightSqFt: '7.32' },
  { gauge: '8', inches: '0.1644', mm: '4.176', approxFraction: '5/32', weightSqFt: '6.71' },
  { gauge: '9', inches: '0.1495', mm: '3.797', approxFraction: '5/32 light', weightSqFt: '6.10' },
  { gauge: '10', inches: '0.1345', mm: '3.416', approxFraction: '1/8 heavy', weightSqFt: '5.49' },
  { gauge: '11', inches: '0.1196', mm: '3.038', approxFraction: '1/8 light', weightSqFt: '4.88' },
  { gauge: '12', inches: '0.1046', mm: '2.657', approxFraction: '7/64', weightSqFt: '4.27' },
  { gauge: '13', inches: '0.0897', mm: '2.278', approxFraction: '3/32 light', weightSqFt: '3.66' },
  { gauge: '14', inches: '0.0747', mm: '1.897', approxFraction: '5/64', weightSqFt: '3.05' },
  { gauge: '15', inches: '0.0673', mm: '1.709', approxFraction: '1/16 heavy', weightSqFt: '2.75' },
  { gauge: '16', inches: '0.0598', mm: '1.519', approxFraction: '1/16 light', weightSqFt: '2.44' },
  { gauge: '17', inches: '0.0538', mm: '1.367', approxFraction: '3/64 heavy', weightSqFt: '2.20' },
  { gauge: '18', inches: '0.0478', mm: '1.214', approxFraction: '3/64', weightSqFt: '1.95' },
  { gauge: '19', inches: '0.0418', mm: '1.062', approxFraction: '1/24 approx', weightSqFt: '1.71' },
  { gauge: '20', inches: '0.0359', mm: '0.912', approxFraction: '1/32 heavy', weightSqFt: '1.46' },
  { gauge: '21', inches: '0.0329', mm: '0.836', approxFraction: '1/32', weightSqFt: '1.34' },
  { gauge: '22', inches: '0.0299', mm: '0.759', approxFraction: '1/32 light', weightSqFt: '1.22' },
  { gauge: '23', inches: '0.0269', mm: '0.683', approxFraction: '1/36 approx', weightSqFt: '1.10' },
  { gauge: '24', inches: '0.0239', mm: '0.607', approxFraction: '1/40 approx', weightSqFt: '0.98' },
  { gauge: '25', inches: '0.0209', mm: '0.531', approxFraction: '1/48 approx', weightSqFt: '0.85' },
  { gauge: '26', inches: '0.0179', mm: '0.455', approxFraction: '1/56 approx', weightSqFt: '0.73' },
  { gauge: '27', inches: '0.0164', mm: '0.417', approxFraction: '1/64 heavy', weightSqFt: '0.67' },
  { gauge: '28', inches: '0.0149', mm: '0.378', approxFraction: '1/64', weightSqFt: '0.61' },
  { gauge: '29', inches: '0.0135', mm: '0.343', approxFraction: '1/74 approx', weightSqFt: '0.55' },
  { gauge: '30', inches: '0.0120', mm: '0.305', approxFraction: '1/83 approx', weightSqFt: '0.49' },
]

const PLATE_ROWS = [
  { nominal: '1/8', inches: '0.1250', mm: '3.175', weightSqFt: '5.10', compare: 'Slightly thicker than 11 ga' },
  { nominal: '3/16', inches: '0.1875', mm: '4.763', weightSqFt: '7.65', compare: 'Near 6 to 7 ga range' },
  { nominal: '1/4', inches: '0.2500', mm: '6.350', weightSqFt: '10.20', compare: 'Heavier than common sheet-gauge range' },
  { nominal: '5/16', inches: '0.3125', mm: '7.938', weightSqFt: '12.75', compare: 'Common structural plate step' },
  { nominal: '3/8', inches: '0.3750', mm: '9.525', weightSqFt: '15.30', compare: 'Standard heavy fabrication plate' },
  { nominal: '1/2', inches: '0.5000', mm: '12.700', weightSqFt: '20.40', compare: 'Frequent base-plate and support thickness' },
  { nominal: '5/8', inches: '0.6250', mm: '15.875', weightSqFt: '25.50', compare: 'Heavy-duty plate and gusset work' },
  { nominal: '3/4', inches: '0.7500', mm: '19.050', weightSqFt: '30.60', compare: 'Common for larger base plates and wear plates' },
  { nominal: '7/8', inches: '0.8750', mm: '22.225', weightSqFt: '35.70', compare: 'Heavy section plate' },
  { nominal: '1', inches: '1.0000', mm: '25.400', weightSqFt: '40.80', compare: 'One-inch plate benchmark' },
]

const QUICK_COMPARE_ROWS = [
  { callout: '7 ga', decimal: '0.1793', commonMatch: 'Around 11/64 to just under 3/16', note: 'Often used where sheet needs more rigidity without jumping to true plate.' },
  { callout: '10 ga', decimal: '0.1345', commonMatch: 'Just over 1/8', note: 'One of the most common shop callouts for formed parts, brackets, and covers.' },
  { callout: '11 ga', decimal: '0.1196', commonMatch: 'Just under 1/8', note: 'Useful to compare directly against plate callouts when prints mix fraction and gauge language.' },
  { callout: '14 ga', decimal: '0.0747', commonMatch: 'Close to 5/64', note: 'Common for lighter formed parts, guards, and enclosures.' },
  { callout: '16 ga', decimal: '0.0598', commonMatch: 'Around 1/16 light', note: 'A frequent light-fabrication and enclosure thickness.' },
  { callout: '1/8 plate', decimal: '0.1250', commonMatch: 'Between 11 ga and 10 ga', note: 'Do not assume 1/8 plate and 11 ga are interchangeable.' },
  { callout: '3/16 plate', decimal: '0.1875', commonMatch: 'Heavier than 7 ga', note: 'A common jump point where shops move from gauge language into plate language.' },
  { callout: '1/4 plate', decimal: '0.2500', commonMatch: 'Outside normal sheet gauge range', note: 'Use direct plate thickness, not gauge, for clear fabrication communication.' },
]

const QUICK_PILLS = ['7 ga', '10 ga', '11 ga', '14 ga', '16 ga', '1/8', '3/16', '1/4']

const NOTEBOOK_TABS = [
  { key: 'sheet', label: 'Sheet Gauge', activeClass: 'bg-emerald-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'plate', label: 'Plate Quick Ref', activeClass: 'bg-blue-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'compare', label: 'Compare Notes', activeClass: 'bg-amber-600 text-white', idleClass: 'bg-white/80 text-black/70' },
]

function GraphBackdrop() {
  const horizontal = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        top: `${8 + i * 6.6}%`,
        delay: `${(i % 6) * 0.35}s`,
      })),
    []
  )

  const vertical = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${6 + i * 7.8}%`,
        delay: `${(i % 5) * 0.45}s`,
      })),
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
      ['7ga', '10ga', '11ga', '14ga', '1/8', '3/16', '1/4', 'lbs/ft2'].map((value, i) => ({
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
        <span
          key={`h-${line.id}`}
          className="absolute left-0 right-0 h-px bg-emerald-400/20 animate-pulse"
          style={{ top: line.top, animationDelay: line.delay }}
        />
      ))}

      {vertical.map((line) => (
        <span
          key={`v-${line.id}`}
          className="absolute top-0 bottom-0 w-px bg-emerald-400/15 animate-pulse"
          style={{ left: line.left, animationDelay: line.delay }}
        />
      ))}

      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path
          d="M40 590 C180 540, 260 460, 400 420 S700 330, 890 290 S1030 250, 1160 220"
          fill="none"
          stroke="rgba(52,211,153,0.34)"
          strokeWidth="2"
        />
        <path
          d="M40 650 C180 640, 320 620, 460 590 S770 500, 920 460 S1040 420, 1170 390"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      </svg>

      {points.map((point) => (
        <span
          key={`p-${point.id}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400/55 shadow-[0_0_14px_rgba(16,185,129,0.45)] animate-pulse"
          style={{ left: point.left, top: point.top, animationDelay: point.delay }}
        />
      ))}

      {labels.map((label) => (
        <span
          key={`l-${label.id}`}
          className="absolute text-[10px] uppercase tracking-[0.24em] text-emerald-300/35 animate-[fadeFloat_5s_ease-in-out_infinite]"
          style={{ left: label.left, top: label.top, animationDelay: label.delay }}
        >
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
        isActive
          ? 'border-emerald-400 bg-emerald-500/15 text-white'
          : 'border-emerald-500/20 bg-emerald-500/8 text-zinc-200 hover:border-emerald-400'
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
        isActive
          ? `${tab.activeClass} translate-y-[2px] shadow-[0_8px_18px_rgba(0,0,0,0.20)]`
          : `${tab.idleClass} hover:-translate-y-[1px]`
      }`}
    >
      {tab.label}
    </button>
  )
}

function NotebookPanel({ activeTab, children }) {
  return (
    <div key={activeTab} className="animate-[pageFlip_340ms_ease] will-change-transform">
      {children}
    </div>
  )
}

function MobileScrollHint() {
  return (
    <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-black/45 md:hidden">
      ← Swipe to view full chart →
    </p>
  )
}

function FooterStatusPanel({ activeTab, searchTerm }) {
  const tabLabel =
    activeTab === 'sheet'
      ? 'Sheet Gauge Lookup'
      : activeTab === 'plate'
        ? 'Plate Thickness Reference'
        : 'Gauge / Plate Comparison Notes'

  return (
    <section className="mt-24">
      <div className="rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-6 backdrop-blur-sm">
        <div className="mb-4 border-b border-zinc-800 pb-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
              ― Reference Footer ―
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Chart Environment Status
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-zinc-300">Reference Sheet Online</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Reference Type</p>
            <p className="mt-3 text-xl font-semibold text-white">Steel Gauge / Thickness</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Active Tab</p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Weight Basis</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Approximate carbon steel weight per square foot</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Search Filter</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {searchTerm ? `Active: ${searchTerm}` : 'No filter active'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SteelGaugeThicknessChart() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('sheet')

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

  const filteredSheetRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return SHEET_GAUGE_ROWS

    return SHEET_GAUGE_ROWS.filter(
      (row) =>
        row.gauge.toLowerCase().includes(term) ||
        row.inches.toLowerCase().includes(term) ||
        row.mm.toLowerCase().includes(term) ||
        row.approxFraction.toLowerCase().includes(term) ||
        row.weightSqFt.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredPlateRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return PLATE_ROWS

    return PLATE_ROWS.filter(
      (row) =>
        row.nominal.toLowerCase().includes(term) ||
        row.inches.toLowerCase().includes(term) ||
        row.mm.toLowerCase().includes(term) ||
        row.weightSqFt.toLowerCase().includes(term) ||
        row.compare.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredCompareRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return QUICK_COMPARE_ROWS

    return QUICK_COMPARE_ROWS.filter(
      (row) =>
        row.callout.toLowerCase().includes(term) ||
        row.decimal.toLowerCase().includes(term) ||
        row.commonMatch.toLowerCase().includes(term) ||
        row.note.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const tabTitle =
    activeTab === 'sheet'
      ? 'Sheet Steel Gauge Lookup'
      : activeTab === 'plate'
        ? 'Plate Thickness Quick Reference'
        : 'Gauge and Plate Comparison Notes'

  const tabDescription =
    activeTab === 'sheet'
      ? 'Search steel gauge numbers by thickness, millimeters, approximate fraction, or approximate pounds per square foot.'
      : activeTab === 'plate'
        ? 'Quick-reference common plate thicknesses with decimal, millimeter, and approximate weight-per-square-foot values.'
        : 'Use comparison notes when drawings, estimators, and shop callouts mix gauge language with fractional plate language.'

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Steel Gauge / Thickness Chart | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Steel Gauge / Thickness Chart for quick steel sheet gauge lookup, common plate thickness reference, millimeter conversions, and approximate weight-per-square-foot checks."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Steel Gauge / Thickness Chart | RuntWerkx" />
        <meta
          property="og:description"
          content="Notebook-style steel gauge and thickness reference with sheet gauge lookup, plate reference, and quick comparison notes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steel Gauge / Thickness Chart | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Steel sheet gauge and plate thickness notebook reference built for fabrication, estimating, and shop planning."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: 'RuntWerkx Steel Gauge / Thickness Chart',
            url: PAGE_URL,
            description:
              'Steel gauge and thickness reference notebook with sheet gauge lookup, plate thickness comparisons, and quick weight-per-square-foot checks.',
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
            <Link
              to="/knowledge-library/calculators-charts-conversions"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
            >
              ← Back to Calculators, Charts & Conversions
            </Link>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-emerald-400">
              ― Current Location ―
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
              Steel Gauge / Thickness Chart
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Notebook-style reference for sheet steel gauge, common plate thickness,
              millimeter conversions, and quick weight-per-square-foot checks.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page when drawings, shop callouts, estimating notes, or customer specs move between gauge language and thickness language. It is built to give fabrication and planning teams a faster way to compare sheet gauge, plate size, decimal thickness, and approximate material weight.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {QUICK_PILLS.map((item) => (
                <QuickRefPill
                  key={item}
                  value={item}
                  isActive={searchTerm.toLowerCase() === item.toLowerCase()}
                  onClick={() =>
                    setSearchTerm((prev) =>
                      prev.toLowerCase() === item.toLowerCase() ? '' : item
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="mx-auto max-w-5xl">
              <div className="mb-14 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Reference Sheet ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{tabTitle}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">{tabDescription}</p>
              </div>

              <div className="relative overflow-visible rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                {/* Mobile fix: keep notebook tabs on one line and scroll horizontally instead of wrapping. */}
                <div className="absolute -top-10 left-4 right-4 z-20 overflow-x-auto whitespace-nowrap md:left-10 md:right-10 lg:right-auto">
                  <div className="flex w-max gap-2 pr-4">
                    {NOTEBOOK_TABS.map((tab) => (
                      <NotebookTab key={tab.key} tab={tab} activeTab={activeTab} onClick={setActiveTab} />
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-4 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
                          RuntWerkx Reference
                        </p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">
                          Steel Gauge and Thickness Notebook
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Built for fabrication quoting, material planning, sheet selection,
                          and cross-checking drawings that move between gauge, decimal, metric,
                          and fractional thickness language.
                        </p>
                      </div>

                      <div className="w-full xl:w-[420px]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            activeTab === 'sheet'
                              ? 'Try 10 ga, 0.1345, 3.416, or 5.49'
                              : activeTab === 'plate'
                                ? 'Try 1/4, 0.2500, 12.7, or 20.40'
                                : 'Try 11 ga, 1/8, under 1/8, or estimating'
                          }
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      {activeTab === 'sheet' && (
                        <>
                          <MobileScrollHint />
                          {/* Mobile fix: keep the 5-column sheet gauge chart readable by scrolling instead of compressing. */}
                          <div className="rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="overflow-x-auto">
                              <div className="min-w-[760px]">
                                <div className="grid grid-cols-5 border-b border-black/10 bg-emerald-900/[0.06] px-4 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70 md:px-5">
                                  <div>Gauge</div>
                                  <div>Inches</div>
                                  <div>MM</div>
                                  <div>Approx Fraction</div>
                                  <div>Lb / Sq Ft</div>
                                </div>

                                <div className="max-h-[900px] overflow-y-auto">
                                  {filteredSheetRows.map((row, index) => (
                                    <div
                                      key={`sheet-${row.gauge}`}
                                      className={`grid grid-cols-5 px-4 py-3 text-base ${
                                        index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                      } md:px-5`}
                                    >
                                      <div className="font-semibold">{row.gauge} ga</div>
                                      <div>{row.inches}</div>
                                      <div>{row.mm}</div>
                                      <div>{row.approxFraction}</div>
                                      <div>{row.weightSqFt}</div>
                                    </div>
                                  ))}

                                  {filteredSheetRows.length === 0 && (
                                    <div className="px-4 py-8 text-center text-black/60 md:px-5">
                                      No chart rows matched that search.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Common Shop Notes
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Lower gauge number means thicker steel sheet.</p>
                                <p>Steel gauge is not universal across all metals. Aluminum, stainless, and galvanized references can differ depending on the system being used.</p>
                                <p>When the print calls out exact thickness, treat the exact thickness as controlling over any guessed gauge equivalent.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Weight Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>The pounds-per-square-foot column is a fast estimating aid for carbon steel sheet.</p>
                                <p>It helps when comparing material selections, rough shipping weight, and how much a thicker gauge step will affect handling and forming.</p>
                                <p>Final material weight should still be checked against exact grade, actual thickness, and full part dimensions.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'plate' && (
                        <>
                          <MobileScrollHint />
                          {/* Mobile fix: keep the 5-column plate chart readable with horizontal scrolling. */}
                          <div className="rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="overflow-x-auto">
                              <div className="min-w-[760px]">
                                <div className="grid grid-cols-5 border-b border-black/10 bg-blue-900/[0.06] px-4 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70 md:px-5">
                                  <div>Nominal</div>
                                  <div>Inches</div>
                                  <div>MM</div>
                                  <div>Lb / Sq Ft</div>
                                  <div>Compare</div>
                                </div>

                                <div className="max-h-[900px] overflow-y-auto">
                                  {filteredPlateRows.map((row, index) => (
                                    <div
                                      key={`plate-${row.nominal}`}
                                      className={`grid grid-cols-5 px-4 py-3 text-base ${
                                        index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                      } md:px-5`}
                                    >
                                      <div className="font-semibold">{row.nominal}</div>
                                      <div>{row.inches}</div>
                                      <div>{row.mm}</div>
                                      <div>{row.weightSqFt}</div>
                                      <div>{row.compare}</div>
                                    </div>
                                  ))}

                                  {filteredPlateRows.length === 0 && (
                                    <div className="px-4 py-8 text-center text-black/60 md:px-5">
                                      No chart rows matched that search.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Plate Selection Notes
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Once material selection moves into true plate sizes, direct thickness language is usually clearer than gauge language.</p>
                                <p>Plate references are useful for base plates, gussets, clip angles, wear plates, and heavier fabricated details.</p>
                                <p>Weight grows fast with thickness. A small step in plate size can materially change handling, lifting, and forming decisions.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Fast Benchmark Strip
                              </p>
                              <div className="mt-4 space-y-2 font-mono text-base leading-7 text-black/78">
                                <p>1/8 = 5.10 lb/sq ft</p>
                                <p>1/4 = 10.20 lb/sq ft</p>
                                <p>3/8 = 15.30 lb/sq ft</p>
                                <p>1/2 = 20.40 lb/sq ft</p>
                                <p>3/4 = 30.60 lb/sq ft</p>
                                <p>1 = 40.80 lb/sq ft</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'compare' && (
                        <>
                          <MobileScrollHint />
                          {/* Mobile fix: keep the 4-column comparison chart readable on phones. */}
                          <div className="rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="overflow-x-auto">
                              <div className="min-w-[640px]">
                                <div className="grid grid-cols-4 border-b border-black/10 bg-amber-900/[0.06] px-4 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70 md:px-5">
                                  <div>Callout</div>
                                  <div>Decimal</div>
                                  <div>Common Match</div>
                                  <div>Shop Note</div>
                                </div>

                                <div className="max-h-[900px] overflow-y-auto">
                                  {filteredCompareRows.map((row, index) => (
                                    <div
                                      key={`compare-${row.callout}`}
                                      className={`grid grid-cols-4 px-4 py-3 text-base ${
                                        index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                      } md:px-5`}
                                    >
                                      <div className="font-semibold">{row.callout}</div>
                                      <div>{row.decimal}</div>
                                      <div>{row.commonMatch}</div>
                                      <div>{row.note}</div>
                                    </div>
                                  ))}

                                  {filteredCompareRows.length === 0 && (
                                    <div className="px-4 py-8 text-center text-black/60 md:px-5">
                                      No chart rows matched that search.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Communication Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Do not casually swap gauge and plate callouts if the print, quote, or customer spec is written around exact thickness.</p>
                                <p>When a job mixes gauge sheet with plate thickness language, list both values in planning notes if it reduces confusion for purchasing or fabrication.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Estimating Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Use gauge for quick stock comparisons, but estimate from actual thickness when weight, forming force, cut time, or weld volume matters.</p>
                                <p>Even a small thickness change affects weight, cut speed, bend behavior, and often the downstream hardware or attachment detail.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </NotebookPanel>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                        Fast Read Strip
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {[
                          '7 ga = 0.1793',
                          '10 ga = 0.1345',
                          '11 ga = 0.1196',
                          '14 ga = 0.0747',
                          '1/8 = 0.1250',
                          '1/4 = 0.2500',
                        ].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-6xl">
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Quick Notes ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Reference Companion
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Fast grab notes for quoting, layout, and fabrication planning.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Most Used Comparisons
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>10 ga is slightly heavier than 1/8.</p>
                    <p>11 ga is slightly lighter than 1/8.</p>
                    <p>7 ga is still below true 3/16 plate.</p>
                    <p>1/4 plate is well beyond normal sheet gauge range.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Why It Matters
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Helpful when drawings, nested parts, and vendor stock descriptions do not use the same thickness language.</p>
                    <p>Useful for estimating weight changes and checking whether a gauge step will materially affect forming or handling.</p>
                    <p>Useful during purchasing and RFQ reviews where one party says gauge and another says decimal or plate thickness.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Practical Warning
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Gauge references are shorthand, not a substitute for actual thickness control.</p>
                    <p>When tolerance, fit-up, bend deduction, or weight matters, work from the actual decimal thickness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                ― What This Chart Covers ―
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Built for real material callout and planning decisions
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This steel gauge and thickness chart is built to support fabrication, estimating, purchasing, layout, and shop planning. Use it to compare steel sheet gauge to decimal and metric thickness, cross-check common plate sizes, scan approximate weight per square foot, and reduce confusion when project language shifts between gauge and actual thickness.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-500/15 bg-black/40 p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">
                  ― Related Tools & References ―
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Continue through the RuntWerkx reference system
                </h3>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/knowledge-library/calculators-charts-conversions"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Calculators, Charts & Conversions
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Material Weight Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/decimal-fraction-chart"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Decimal / Fraction Chart
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/tap-drill-chart"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Tap & Drill Chart
                </Link>
              </div>
            </div>
          </section>

          <FooterStatusPanel activeTab={activeTab} searchTerm={searchTerm} />
        </div>
      </section>
    </div>
  )
}