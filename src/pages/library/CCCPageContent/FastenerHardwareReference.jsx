import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PAGE_URL =
  'https://runtwerkx.com/knowledge-library/calculators-charts-conversions/fastener-hardware-reference'

const HEX_FASTENER_ROWS = [
  { size: '#10', coarse: '10-24', fine: '10-32', hexHead: '3/8', nut: '3/8', clearance: '0.201 / 0.196 / 0.201', washer: '#10' },
  { size: '1/4', coarse: '1/4-20', fine: '1/4-28', hexHead: '7/16', nut: '7/16', clearance: '0.257 / 0.266 / 0.281', washer: '1/4' },
  { size: '5/16', coarse: '5/16-18', fine: '5/16-24', hexHead: '1/2', nut: '1/2', clearance: '0.323 / 0.332 / 0.344', washer: '5/16' },
  { size: '3/8', coarse: '3/8-16', fine: '3/8-24', hexHead: '9/16', nut: '9/16', clearance: '0.386 / 0.397 / 0.406', washer: '3/8' },
  { size: '7/16', coarse: '7/16-14', fine: '7/16-20', hexHead: '5/8', nut: '5/8', clearance: '0.453 / 0.453 / 0.468', washer: '7/16' },
  { size: '1/2', coarse: '1/2-13', fine: '1/2-20', hexHead: '3/4', nut: '3/4', clearance: '0.515 / 0.531 / 0.562', washer: '1/2' },
  { size: '9/16', coarse: '9/16-12', fine: '9/16-18', hexHead: '13/16', nut: '13/16', clearance: '0.578 / 0.593 / 0.625', washer: '9/16' },
  { size: '5/8', coarse: '5/8-11', fine: '5/8-18', hexHead: '15/16', nut: '15/16', clearance: '0.640 / 0.656 / 0.688', washer: '5/8' },
  { size: '3/4', coarse: '3/4-10', fine: '3/4-16', hexHead: '1-1/8', nut: '1-1/8', clearance: '0.765 / 0.781 / 0.812', washer: '3/4' },
  { size: '7/8', coarse: '7/8-9', fine: '7/8-14', hexHead: '1-5/16', nut: '1-5/16', clearance: '0.890 / 0.906 / 0.938', washer: '7/8' },
  { size: '1', coarse: '1-8', fine: '1-12', hexHead: '1-1/2', nut: '1-1/2', clearance: '1.015 / 1.031 / 1.062', washer: '1' },
]

const SOCKET_CAP_ROWS = [
  { size: '#10', thread: '10-24 / 10-32', hexKey: '5/32', headDia: '0.373', headHeight: '0.190', note: 'Common machine and fixture hardware size.' },
  { size: '1/4', thread: '1/4-20 / 1/4-28', hexKey: '3/16', headDia: '0.375', headHeight: '0.250', note: 'Frequent general machine assembly size.' },
  { size: '5/16', thread: '5/16-18 / 5/16-24', hexKey: '1/4', headDia: '0.469', headHeight: '0.312', note: 'Useful when wrench clearance is limited.' },
  { size: '3/8', thread: '3/8-16 / 3/8-24', hexKey: '5/16', headDia: '0.562', headHeight: '0.375', note: 'Common for tooling, plates, and fixtures.' },
  { size: '7/16', thread: '7/16-14 / 7/16-20', hexKey: '3/8', headDia: '0.656', headHeight: '0.437', note: 'Larger fixture and bracket work.' },
  { size: '1/2', thread: '1/2-13 / 1/2-20', hexKey: '3/8', headDia: '0.750', headHeight: '0.500', note: 'Popular heavy machine and plate connection size.' },
  { size: '5/8', thread: '5/8-11 / 5/8-18', hexKey: '1/2', headDia: '0.938', headHeight: '0.625', note: 'Frequent heavy fixture and machine build size.' },
  { size: '3/4', thread: '3/4-10 / 3/4-16', hexKey: '5/8', headDia: '1.125', headHeight: '0.750', note: 'Heavy-duty bolting where socket access matters.' },
]

const WASHER_ROWS = [
  { nominal: '1/4', saeOd: '0.625', ussOd: '0.734', fenderOd: '1.250', lockWasher: '1/4 split', note: 'SAE tighter OD, USS broader bearing area.' },
  { nominal: '5/16', saeOd: '0.688', ussOd: '0.875', fenderOd: '1.500', lockWasher: '5/16 split', note: 'USS often chosen for larger bearing footprint.' },
  { nominal: '3/8', saeOd: '0.812', ussOd: '1.000', fenderOd: '1.500', lockWasher: '3/8 split', note: 'Common structural and machine washer reference.' },
  { nominal: '7/16', saeOd: '0.922', ussOd: '1.250', fenderOd: '1.750', lockWasher: '7/16 split', note: 'Used when added bearing area is helpful.' },
  { nominal: '1/2', saeOd: '1.063', ussOd: '1.375', fenderOd: '2.000', lockWasher: '1/2 split', note: 'Common mismatch point if the BOM does not specify SAE vs USS.' },
  { nominal: '5/8', saeOd: '1.313', ussOd: '1.750', fenderOd: '2.250', lockWasher: '5/8 split', note: 'Important to verify on slotted holes and softer materials.' },
  { nominal: '3/4', saeOd: '1.563', ussOd: '2.000', fenderOd: '2.500', lockWasher: '3/4 split', note: 'Broader OD choices change clamp-load distribution.' },
  { nominal: '1', saeOd: '2.000', ussOd: '2.500', fenderOd: '4.000', lockWasher: '1 split', note: 'Large bearing differences become very visible here.' },
]

const THREAD_NOTE_ROWS = [
  { topic: 'UNC vs UNF', summary: 'UNC is the common coarse series. UNF is the fine series.', note: 'Coarse threads are common in general fabrication and field work. Fine threads are common where more adjustment or different clamp behavior is desired.' },
  { topic: 'Clearance hole sets', summary: 'Close / normal / loose hole choices change fit-up behavior.', note: 'Normal fit is a common default. Loose fit helps field alignment. Close fit helps limit slop when alignment matters.' },
  { topic: 'Head size assumptions', summary: 'Do not assume all hardware follows the same head size standard.', note: 'Hex cap screws, heavy hex bolts, metric hardware, and specialty fasteners can differ from common reference values.' },
  { topic: 'Washer families', summary: 'SAE and USS washers are not interchangeable by size description alone.', note: 'The OD difference matters for clamp distribution, slot coverage, and softer base materials.' },
  { topic: 'Socket-cap use', summary: 'Socket hardware helps where wrench swing or side access is limited.', note: 'But it also creates dependency on internal-hex condition and tool engagement quality.' },
  { topic: 'BOM discipline', summary: 'Hardware confusion usually starts in the BOM before it starts in the field.', note: 'Thread series, finish, grade, washer family, and nut style should be explicit when the connection matters.' },
]

const QUICK_PILLS = ['1/4', '5/16', '3/8', '1/2', '5/8', '3/4', 'UNC', 'USS']

const NOTEBOOK_TABS = [
  { key: 'hex', label: 'Hex Hardware', activeClass: 'bg-emerald-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'socket', label: 'Socket Cap', activeClass: 'bg-blue-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'washers', label: 'Washers', activeClass: 'bg-amber-600 text-white', idleClass: 'bg-white/80 text-black/70' },
  { key: 'notes', label: 'Thread Notes', activeClass: 'bg-zinc-700 text-white', idleClass: 'bg-white/80 text-black/70' },
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
      ['3/8', '1/2', 'UNC', 'UNF', 'USS', 'SAE', 'hex', 'allen'].map((value, i) => ({
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
        <path d="M40 600 C170 580, 280 520, 430 460 S700 340, 860 300 S1030 260, 1160 230" fill="none" stroke="rgba(52,211,153,0.34)" strokeWidth="2" />
        <path d="M40 655 C180 650, 330 620, 480 590 S760 530, 920 500 S1060 460, 1170 430" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
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
    activeTab === 'hex'
      ? 'Hex Hardware Lookup'
      : activeTab === 'socket'
        ? 'Socket Cap Reference'
        : activeTab === 'washers'
          ? 'Washer Reference'
          : 'Thread and Hardware Notes'

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
            <p className="mt-3 text-xl font-semibold text-white">Fastener / Hardware</p>
          </div>
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Active Tab</p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Primary Use</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Quick field and shop lookup for common bolt, nut, washer, and socket-hardware decisions.</p>
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

export default function FastenerHardwareReference() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('hex')

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

  const filteredHexRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return HEX_FASTENER_ROWS
    return HEX_FASTENER_ROWS.filter((row) =>
      [row.size, row.coarse, row.fine, row.hexHead, row.nut, row.clearance, row.washer].join(' ').toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredSocketRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return SOCKET_CAP_ROWS
    return SOCKET_CAP_ROWS.filter((row) =>
      [row.size, row.thread, row.hexKey, row.headDia, row.headHeight, row.note].join(' ').toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredWasherRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return WASHER_ROWS
    return WASHER_ROWS.filter((row) =>
      [row.nominal, row.saeOd, row.ussOd, row.fenderOd, row.lockWasher, row.note].join(' ').toLowerCase().includes(term)
    )
  }, [searchTerm])

  const filteredNoteRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return THREAD_NOTE_ROWS
    return THREAD_NOTE_ROWS.filter((row) =>
      [row.topic, row.summary, row.note].join(' ').toLowerCase().includes(term)
    )
  }, [searchTerm])

  const tabTitle =
    activeTab === 'hex'
      ? 'Hex Fastener Lookup'
      : activeTab === 'socket'
        ? 'Socket Cap Screw Reference'
        : activeTab === 'washers'
          ? 'Washer and Bearing Surface Reference'
          : 'Hardware and Thread Notes'

  const tabDescription =
    activeTab === 'hex'
      ? 'Search common bolt sizes by thread series, wrench size, nut size, clearance-hole set, or washer callout.'
      : activeTab === 'socket'
        ? 'Quick practical reference for internal-hex socket-cap hardware, hex-key size, and head dimensions.'
        : activeTab === 'washers'
          ? 'Compare SAE, USS, fender, and lock-washer references so clamp-area decisions are clearer.'
          : 'Use these notes to reduce the common hardware mistakes that show up in BOMs, drilling, and field assembly.'

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Fastener / Hardware Reference | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Fastener / Hardware Reference for quick hex-bolt lookup, socket-cap reference, washer comparisons, and practical thread notes for fabrication and assembly work."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Fastener / Hardware Reference | RuntWerkx" />
        <meta
          property="og:description"
          content="Notebook-style fastener and hardware reference with hex hardware, socket-cap, washer, and thread lookup notes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fastener / Hardware Reference | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Fastener and hardware notebook built for fabrication, machine assembly, field install, and shop planning."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: 'RuntWerkx Fastener / Hardware Reference',
            url: PAGE_URL,
            description:
              'Common fastener and hardware reference notebook with bolt, nut, washer, and socket-cap lookup information for practical shop use.',
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
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">Fastener / Hardware Reference</h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Notebook-style reference for common bolt, nut, washer, and socket-cap hardware details used in fabrication, assembly, and field work.
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page when the team needs a quick answer on wrench size, thread series, washer family, clearance-hole fit, or socket hardware before the job turns into guesswork or wrong hardware staging.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {QUICK_PILLS.map((item) => (
                <QuickRefPill key={item} value={item} isActive={searchTerm.toLowerCase() === item.toLowerCase()} onClick={() => setSearchTerm((prev) => prev.toLowerCase() === item.toLowerCase() ? '' : item)} />
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6 text-center">
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
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">Fastener and Hardware Notebook</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Built for hardware staging, assembly prep, shop drilling decisions, and field-install checks where the wrong nut, washer, or wrench size can waste time fast.
                        </p>
                      </div>

                      <div className="w-full xl:w-[420px]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            activeTab === 'hex'
                              ? 'Try 3/8, 1/2-13, 15/16, or USS'
                              : activeTab === 'socket'
                                ? 'Try 1/2, 3/8 hex key, or head dia'
                                : activeTab === 'washers'
                                  ? 'Try 1/2, SAE, USS, or fender'
                                  : 'Try UNC, loose fit, BOM, or washer family'
                          }
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      {activeTab === 'hex' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-7 border-b border-black/10 bg-emerald-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Size</div>
                              <div>UNC</div>
                              <div>UNF</div>
                              <div>Hex Head</div>
                              <div>Nut</div>
                              <div>Clr. Holes</div>
                              <div>Washer</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredHexRows.map((row, index) => (
                                <div key={`hex-${row.size}`} className={`grid grid-cols-7 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.size}</div>
                                  <div>{row.coarse}</div>
                                  <div>{row.fine}</div>
                                  <div>{row.hexHead}</div>
                                  <div>{row.nut}</div>
                                  <div>{row.clearance}</div>
                                  <div>{row.washer}</div>
                                </div>
                              ))}
                              {filteredHexRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">How To Read It</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>The clearance-hole column is shown as close / normal / loose so fit-up decisions can be made faster without opening a second chart.</p>
                                <p>These are common-reference wrench sizes for standard hex hardware, not every specialty or heavy-hex variation.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Practical Warning</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Do not assume the wrench size tells you the grade or thread series.</p>
                                <p>Thread, grade, finish, and washer family should be explicit on the BOM when the connection matters.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'socket' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-6 border-b border-black/10 bg-blue-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Size</div>
                              <div>Thread</div>
                              <div>Hex Key</div>
                              <div>Head Dia</div>
                              <div>Head Ht</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredSocketRows.map((row, index) => (
                                <div key={`socket-${row.size}`} className={`grid grid-cols-6 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.size}</div>
                                  <div>{row.thread}</div>
                                  <div>{row.hexKey}</div>
                                  <div>{row.headDia}</div>
                                  <div>{row.headHeight}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredSocketRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">Why This Matters</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Socket hardware is common in tooling, fixtures, and machine assemblies where wrench swing is limited.</p>
                                <p>Head diameter and head height matter when counterbores, plate stackups, or clearance pockets are involved.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">Shop Note</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Internal hex damage is common when the wrong key size or poor tool engagement is used.</p>
                                <p>If repeated maintenance access is expected, hardware choice should consider tool wear and future serviceability.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'washers' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-6 border-b border-black/10 bg-amber-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Nominal</div>
                              <div>SAE OD</div>
                              <div>USS OD</div>
                              <div>Fender OD</div>
                              <div>Lock Washer</div>
                              <div>Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredWasherRows.map((row, index) => (
                                <div key={`washer-${row.nominal}`} className={`grid grid-cols-6 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.nominal}</div>
                                  <div>{row.saeOd}</div>
                                  <div>{row.ussOd}</div>
                                  <div>{row.fenderOd}</div>
                                  <div>{row.lockWasher}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredWasherRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">Washer Family Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>SAE washers have a tighter outer diameter. USS washers spread the load over a broader area.</p>
                                <p>Fender washers are useful when the material is thin or the hole condition is rough and extra bearing area is needed.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">BOM Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Calling out only “washer” is often not enough when clamp-load distribution matters.</p>
                                <p>Specify washer family, finish, and thickness where slotted holes, softer materials, or appearance-sensitive work are involved.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'notes' && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-3 border-b border-black/10 bg-zinc-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Topic</div>
                              <div>Summary</div>
                              <div>Shop Note</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredNoteRows.map((row, index) => (
                                <div key={`note-${row.topic}`} className={`grid grid-cols-3 px-5 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'}`}>
                                  <div className="font-semibold">{row.topic}</div>
                                  <div>{row.summary}</div>
                                  <div>{row.note}</div>
                                </div>
                              ))}
                              {filteredNoteRows.length === 0 && <div className="px-5 py-8 text-center text-black/60">No chart rows matched that search.</div>}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">Useful Habit</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>When the connection matters, stage the fastener kit by actual specification rather than by “what looks right.”</p>
                                <p>Thread series, length, finish, nut style, and washer family should all be verified before field install or final assembly.</p>
                              </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">Scope Reminder</p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>This page is a fast-use reference for common imperial hardware, not a substitute for every hardware standard, grade chart, or manufacturer catalog.</p>
                                <p>Heavy hex, metric, structural bolts, and specialty fastening systems should be checked against their governing specs directly.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </NotebookPanel>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Fast Read Strip</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {['1/4 = 7/16 head', '3/8 = 9/16 head', '1/2 = 3/4 head', '5/8 = 15/16 head', '3/4 = 1-1/8 head', 'SAE vs USS matters'].map((item) => (
                          <span key={item} className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">― Quick Notes ―</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Reference Companion</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">Fast grab notes for shop assembly, staging, and field install.</p>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Most Used Checks</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Verify thread series before you stage taps, dies, or matching nuts.</p>
                    <p>Verify washer family before you assume clamp area is acceptable.</p>
                    <p>Verify wrench size before the install crew discovers the mismatch at height or in a tight access zone.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Why It Matters</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Hardware confusion creates slow, expensive mistakes because it often gets discovered only when the connection is being assembled.</p>
                    <p>This page is built to reduce that friction before the crew reaches for the wrong drill, wrench, nut, or washer.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Practical Warning</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>These are common reference values, not universal coverage for every structural, metric, or specialty hardware system.</p>
                    <p>Where code, grade, or manufacturer detail matters, confirm the governing specification directly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">― What This Chart Covers ―</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Built for actual assembly and staging decisions</h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This fastener and hardware reference is built to support practical work: identifying common wrench sizes, checking thread families, comparing washer options, reviewing socket-cap hardware, and reducing the kind of staging and install mistakes that slow fabrication and field crews down.
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
                <Link to="/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart" className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">Steel Gauge / Thickness Chart</Link>
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