import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PAGE_URL =
  'https://runtwerkx.com/knowledge-library/calculators-charts-conversions/common-material-reference-charts'

const DENSITY_ROWS = [
  { material: 'Steel', category: 'Metal', lbPerIn3: '0.2836', lbPerFt3: '490.0', kgPerM3: '7,850', compare: 'Baseline shop structural metal' },
  { material: 'Stainless Steel', category: 'Metal', lbPerIn3: '0.2890', lbPerFt3: '499.4', kgPerM3: '7,990', compare: 'Slightly heavier than carbon steel' },
  { material: 'Aluminum', category: 'Metal', lbPerIn3: '0.0975', lbPerFt3: '168.5', kgPerM3: '2,700', compare: 'Roughly one-third the weight of steel' },
  { material: 'Cast Iron', category: 'Metal', lbPerIn3: '0.2600', lbPerFt3: '449.3', kgPerM3: '7,190', compare: 'Heavy and rigid, but brittle compared with mild steel' },
  { material: 'Copper', category: 'Metal', lbPerIn3: '0.3230', lbPerFt3: '558.1', kgPerM3: '8,940', compare: 'Heavier than steel, strong conductivity use case' },
  { material: 'Brass', category: 'Metal', lbPerIn3: '0.3070', lbPerFt3: '530.5', kgPerM3: '8,490', compare: 'Dense non-ferrous alloy often used in fittings and machined parts' },
  { material: 'Bronze', category: 'Metal', lbPerIn3: '0.3180', lbPerFt3: '549.5', kgPerM3: '8,800', compare: 'Heavy wear-resistant alloy family' },
  { material: 'Pine / Softwood', category: 'Wood', lbPerIn3: '0.0208', lbPerFt3: '35.9', kgPerM3: '575', compare: 'Light framing and general wood reference' },
  { material: 'Oak / Hardwood', category: 'Wood', lbPerIn3: '0.0434', lbPerFt3: '75.0', kgPerM3: '1,200', compare: 'Much heavier and denser than pine' },
  { material: 'Pressure Treated Lumber', category: 'Wood', lbPerIn3: '0.0295', lbPerFt3: '51.0', kgPerM3: '817', compare: 'Moisture and treatment can push actual weight higher' },
]

const METAL_REFERENCE_ROWS = [
  { material: 'Steel', weldability: 'High', machinability: 'Moderate', corrosion: 'Low without coating', commonUse: 'Structural members, plate, frames, brackets, base metals for general fabrication' },
  { material: 'Stainless Steel', weldability: 'Moderate to High', machinability: 'Moderate to Low', corrosion: 'High', commonUse: 'Food-grade, washdown, corrosive environments, finish-sensitive parts' },
  { material: 'Aluminum', weldability: 'Moderate', machinability: 'High', corrosion: 'Moderate to High', commonUse: 'Weight-sensitive components, transport parts, covers, marine and architectural work' },
  { material: 'Cast Iron', weldability: 'Low / specialized', machinability: 'Moderate', corrosion: 'Moderate', commonUse: 'Bases, housings, machine frames, vibration-damping parts' },
  { material: 'Copper', weldability: 'Specialized', machinability: 'Moderate', corrosion: 'High', commonUse: 'Electrical and thermal conduction, bussing, specialty fabrication' },
  { material: 'Brass', weldability: 'Specialized', machinability: 'High', corrosion: 'High', commonUse: 'Fittings, bushings, decorative and machined components' },
  { material: 'Bronze', weldability: 'Specialized', machinability: 'Moderate', corrosion: 'High', commonUse: 'Bushings, wear surfaces, marine and sliding-contact components' },
]

const WOOD_REFERENCE_ROWS = [
  { material: 'Pine / Softwood', density: 'Light', stability: 'Moderate', commonUse: 'General framing, blocking, temporary jigs, basic support structures', note: 'Moisture content changes actual weight and dimensional behavior.' },
  { material: 'Oak / Hardwood', density: 'High', stability: 'Moderate to High', commonUse: 'Heavy blocking, wear surfaces, benches, fixtures, stronger wood components', note: 'Harder on tools and substantially heavier than softwood.' },
  { material: 'Pressure Treated Lumber', density: 'Medium to High', stability: 'Moderate', commonUse: 'Exterior support, dunnage, ground-contact or moisture-exposed setups', note: 'Actual weight often varies with retained moisture after treatment.' },
  { material: 'Plywood', density: 'Medium', stability: 'High in sheet form', commonUse: 'Decking, templates, layout boards, jigs, enclosures, job-built work surfaces', note: 'Grades and core type change performance a lot.' },
  { material: 'OSB', density: 'Medium', stability: 'Moderate', commonUse: 'Temporary decks, wall and floor sheathing, low-cost site work', note: 'Moisture exposure affects edge condition quickly.' },
]

const QUICK_COMPARE_ROWS = [
  { callout: 'Steel vs Aluminum', summary: 'Steel is about 2.9 times heavier than aluminum for the same volume.', note: 'Useful when weight, lifting, shipping, or manual handling is driving the decision.' },
  { callout: 'Steel vs Stainless', summary: 'Stainless is slightly heavier than carbon steel.', note: 'The weight change is small compared with the fabrication and corrosion-performance change.' },
  { callout: 'Pine vs Oak', summary: 'Oak is roughly twice as heavy as pine by common reference density.', note: 'Important when wood blocking, worktables, or temporary structures are moved by hand.' },
  { callout: 'Copper vs Steel', summary: 'Copper is noticeably heavier than steel.', note: 'Do not underestimate weight when fabricating copper bussing or conduction components.' },
  { callout: 'Brass / Bronze family', summary: 'Both are dense non-ferrous materials and often heavier than teams expect.', note: 'Good to remember when quoting machine parts and wear components.' },
  { callout: 'Treated lumber', summary: 'Treatment and retained moisture can make treated wood meaningfully heavier than dry lumber.', note: 'Important for shipping and site-handling assumptions.' },
]

const QUICK_PILLS = ['Steel', 'Stainless', 'Aluminum', 'Copper', 'Brass', 'Pine', 'Oak', 'Treated']

const NOTEBOOK_TABS = [
  { key: 'density', label: 'Density Lookup', activeClass: 'bg-emerald-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'metals', label: 'Metals', activeClass: 'bg-blue-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'woods', label: 'Wood / Sheet Goods', activeClass: 'bg-amber-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'compare', label: 'Compare Notes', activeClass: 'bg-zinc-700 text-white', idleClass: 'bg-white/80 text-black/70' },
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
      ['steel', 'alu', 'ss', 'copper', 'brass', 'pine', 'oak', 'kg/m3'].map((value, i) => ({
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
          d="M40 610 C160 600, 300 520, 430 470 S690 380, 850 320 S1030 250, 1160 220"
          fill="none"
          stroke="rgba(52,211,153,0.34)"
          strokeWidth="2"
        />
        <path
          d="M40 660 C180 650, 320 630, 470 610 S740 550, 900 520 S1050 480, 1170 450"
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

function FooterStatusPanel({ activeTab, searchTerm }) {
  const tabLabel =
    activeTab === 'density'
      ? 'Density Lookup'
      : activeTab === 'metals'
        ? 'Metal Properties'
        : activeTab === 'woods'
          ? 'Wood / Sheet Goods'
          : 'Material Comparison Notes'

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
            <p className="mt-3 text-xl font-semibold text-white">Common Material Reference</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Active Tab</p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Primary Use</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Quick density and material-selection reference for estimating, planning, and shop communication.</p>
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

export default function CommonMaterialReferenceCharts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('density')

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

  const filteredDensityRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return DENSITY_ROWS

    return DENSITY_ROWS.filter(
      (row) =>
        row.material.toLowerCase().includes(term) ||
        row.category.toLowerCase().includes(term) ||
        row.lbPerIn3.toLowerCase().includes(term) ||
        row.lbPerFt3.toLowerCase().includes(term) ||
        row.kgPerM3.toLowerCase().includes(term) ||
        row.compare.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredMetalRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return METAL_REFERENCE_ROWS

    return METAL_REFERENCE_ROWS.filter(
      (row) =>
        row.material.toLowerCase().includes(term) ||
        row.weldability.toLowerCase().includes(term) ||
        row.machinability.toLowerCase().includes(term) ||
        row.corrosion.toLowerCase().includes(term) ||
        row.commonUse.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredWoodRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return WOOD_REFERENCE_ROWS

    return WOOD_REFERENCE_ROWS.filter(
      (row) =>
        row.material.toLowerCase().includes(term) ||
        row.density.toLowerCase().includes(term) ||
        row.stability.toLowerCase().includes(term) ||
        row.commonUse.toLowerCase().includes(term) ||
        row.note.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredCompareRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return QUICK_COMPARE_ROWS

    return QUICK_COMPARE_ROWS.filter(
      (row) =>
        row.callout.toLowerCase().includes(term) ||
        row.summary.toLowerCase().includes(term) ||
        row.note.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const tabTitle =
    activeTab === 'density'
      ? 'Common Material Density Lookup'
      : activeTab === 'metals'
        ? 'Common Metal Reference Notes'
        : activeTab === 'woods'
          ? 'Wood and Sheet Goods Reference'
          : 'Material Comparison Notes'

  const tabDescription =
    activeTab === 'density'
      ? 'Search common materials by density in pounds per cubic inch, pounds per cubic foot, or kilograms per cubic meter.'
      : activeTab === 'metals'
        ? 'Quick practical comparisons for weldability, machinability, corrosion behavior, and typical fabrication use.'
        : activeTab === 'woods'
          ? 'Useful general notes for wood and sheet-good references used in blocking, jigs, work surfaces, and temporary support.'
          : 'Fast comparisons to help teams understand how weight and use cases shift across common material choices.'

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Common Material Reference Charts | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Common Material Reference Charts for quick material density lookup, common metal comparisons, wood reference notes, and estimating-oriented material comparison guidance."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Common Material Reference Charts | RuntWerkx" />
        <meta
          property="og:description"
          content="Notebook-style material reference charts with density lookup, metals guidance, wood reference notes, and common material comparisons."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Common Material Reference Charts | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Common material density and comparison notebook built for fabrication, estimating, and shop planning."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: 'RuntWerkx Common Material Reference Charts',
            url: PAGE_URL,
            description:
              'Common material reference notebook with density lookup, quick property comparisons, and material-selection notes for practical shop use.',
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
              Common Material Reference Charts
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Notebook-style material reference for common densities, metal comparison notes,
              wood reference guidance, and quick estimating-oriented material checks.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page when teams need a faster way to compare material weight behavior, common fabrication traits, and practical reference differences without jumping between multiple sources. It is built to support estimating, quoting, layout planning, and day-to-day shop communication.
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

          <div className="mt-14 grid gap-10 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Reference Sheet ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{tabTitle}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">{tabDescription}</p>
              </div>

              <div className="relative overflow-visible rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="absolute -top-10 left-10 z-20 flex flex-wrap gap-2">
                  {NOTEBOOK_TABS.map((tab) => (
                    <NotebookTab key={tab.key} tab={tab} activeTab={activeTab} onClick={setActiveTab} />
                  ))}
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-6 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
                          RuntWerkx Reference
                        </p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">
                          Common Material Notebook
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Built to support quick density checks, rough weight reasoning,
                          and practical material-selection conversations across shop, estimating,
                          and planning work.
                        </p>
                      </div>

                      <div className="w-full xl:w-[420px]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            activeTab === 'density'
                              ? 'Try steel, 0.2836, 490, or 7850'
                              : activeTab === 'metals'
                                ? 'Try stainless, weldability, corrosion, or aluminum'
                                : activeTab === 'woods'
                                  ? 'Try pine, plywood, treated, or stability'
                                  : 'Try steel vs aluminum, copper, or weight'
                          }
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      {activeTab === 'density' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-5 border-b border-black/10 bg-emerald-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Material</div>
                              <div>Lb / In³</div>
                              <div>Lb / Ft³</div>
                              <div>Kg / M³</div>
                              <div>Quick Compare</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredDensityRows.map((row, index) => (
                                <div
                                  key={`density-${row.material}`}
                                  className={`grid grid-cols-5 px-5 py-3 text-base ${
                                    index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                  }`}
                                >
                                  <div className="font-semibold">{row.material}</div>
                                  <div>{row.lbPerIn3}</div>
                                  <div>{row.lbPerFt3}</div>
                                  <div>{row.kgPerM3}</div>
                                  <div>{row.compare}</div>
                                </div>
                              ))}

                              {filteredDensityRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Use Notes
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Density is the fastest way to get from volume to rough weight when you already know the material family.</p>
                                <p>These values are reference values, not certification values for every alloy, grade, or moisture condition.</p>
                                <p>For exact weight, always use actual thickness, exact dimensions, and the real material specification in play.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Why Three Units
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Lb per cubic inch is useful for direct weight formulas and shop calculators.</p>
                                <p>Lb per cubic foot is useful when reasoning about larger sections, lumber, crates, or bulk storage.</p>
                                <p>Kg per cubic meter helps when vendor data or engineering references come in metric form.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'metals' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-5 border-b border-black/10 bg-blue-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Material</div>
                              <div>Weldability</div>
                              <div>Machinability</div>
                              <div>Corrosion</div>
                              <div>Common Use</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredMetalRows.map((row, index) => (
                                <div
                                  key={`metal-${row.material}`}
                                  className={`grid grid-cols-5 px-5 py-3 text-base ${
                                    index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                  }`}
                                >
                                  <div className="font-semibold">{row.material}</div>
                                  <div>{row.weldability}</div>
                                  <div>{row.machinability}</div>
                                  <div>{row.corrosion}</div>
                                  <div>{row.commonUse}</div>
                                </div>
                              ))}

                              {filteredMetalRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Fabrication Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Material choice changes far more than weight. It also changes cutting behavior, weld setup, heat control, tooling wear, and downstream finish requirements.</p>
                                <p>Use these notes for quick orientation, then confirm the exact alloy and process requirements before production work.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Estimating Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>A material change that looks small on paper can materially affect cycle time, consumables, rework rate, and surface-finish expectations.</p>
                                <p>Do not estimate stainless, aluminum, and carbon steel as if they behave the same just because the part geometry is similar.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'woods' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-5 border-b border-black/10 bg-amber-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Material</div>
                              <div>Density</div>
                              <div>Stability</div>
                              <div>Common Use</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredWoodRows.map((row, index) => (
                                <div
                                  key={`wood-${row.material}`}
                                  className={`grid grid-cols-5 px-5 py-3 text-base ${
                                    index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                  }`}
                                >
                                  <div className="font-semibold">{row.material}</div>
                                  <div>{row.density}</div>
                                  <div>{row.stability}</div>
                                  <div>{row.commonUse}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}

                              {filteredWoodRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Practical Note
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Wood references matter in industrial work more than teams sometimes admit: dunnage, blocking, layout surfaces, shipping protection, worktables, and temporary supports all depend on decent assumptions.</p>
                                <p>Moisture content changes weight and behavior quickly, especially on treated lumber and sheet goods stored outdoors.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Planning Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>For load-bearing temporary setups, do not use rough density assumptions as a design basis.</p>
                                <p>Use the chart for quick field reasoning and general planning, then escalate to proper engineering or specification checks when loading matters.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'compare' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-3 border-b border-black/10 bg-zinc-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Comparison</div>
                              <div>Summary</div>
                              <div>Shop Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredCompareRows.map((row, index) => (
                                <div
                                  key={`compare-${row.callout}`}
                                  className={`grid grid-cols-3 px-5 py-3 text-base ${
                                    index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'
                                  }`}
                                >
                                  <div className="font-semibold">{row.callout}</div>
                                  <div>{row.summary}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}

                              {filteredCompareRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">
                                Communication Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>A quick comparison note can prevent a surprising amount of confusion in quotes, planning meetings, and internal handoffs.</p>
                                <p>When one material is being considered as a substitute, teams usually need the weight change and fabrication-behavior change explained together.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">
                                Scope Reminder
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>This page is meant to be a fast material-reference companion, not a full metallurgy handbook or certified engineering data source.</p>
                                <p>Use it to move faster on practical reasoning, then verify exact grades and specs where the job requires it.</p>
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
                          'Steel = 0.2836 lb/in³',
                          'Stainless = 0.2890 lb/in³',
                          'Aluminum = 0.0975 lb/in³',
                          'Pine = 35.9 lb/ft³',
                          'Oak = 75.0 lb/ft³',
                          'Copper = 0.3230 lb/in³',
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

            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Quick Notes ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Reference Companion
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Fast grab notes for quoting, planning, and material decisions.
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Most Used Reference Points
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Steel is the default weight benchmark most shop calculations are mentally anchored to.</p>
                    <p>Aluminum is much lighter, but the fabrication rules change with it.</p>
                    <p>Stainless is near steel in weight but different in corrosion behavior and shop handling.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Why It Matters
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Useful for material substitutions, quick rough-order weight checks, and RFQ reviews.</p>
                    <p>Useful when a calculator needs density but the team first needs to confirm which material family they are really working with.</p>
                    <p>Useful when purchasing, estimating, and fabrication are not all using the same reference assumptions.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Practical Warning
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>These are practical reference values, not alloy-certified test values for every grade and condition.</p>
                    <p>When engineering, certification, or compliance is in play, confirm the exact material specification directly.</p>
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
                Built for fast material reasoning, not just placeholder reference space
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This common material reference page is built to support the kinds of material questions that show up repeatedly in daily work: how heavy is it, how does it compare, what does it usually get used for, and what changes when the material family changes. It is meant to be a quick, usable companion for estimating, material planning, and fabrication support.
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
                  to="/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Steel Gauge / Thickness Chart
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/decimal-fraction-chart"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Decimal / Fraction Chart
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