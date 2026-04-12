import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function getGridClass(columnCount) {
  if (columnCount === 3) return 'grid-cols-3'
  if (columnCount === 4) return 'grid-cols-4'
  if (columnCount === 5) return 'grid-cols-5'
  if (columnCount === 6) return 'grid-cols-6'
  return 'grid-cols-4'
}

function GraphBackdrop({ labels = [] }) {
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

  const displayLabels = labels.length > 0 ? labels : ['convert', 'inch', 'mm', 'kg', 'psi', 'c', 'gal', 'm2']

  const floatingLabels = useMemo(
    () =>
      displayLabels.slice(0, 8).map((value, i) => ({
        id: i,
        value,
        left: `${10 + i * 10.2}%`,
        top: `${14 + (i % 2) * 8}%`,
        delay: `${i * 0.32}s`,
      })),
    [displayLabels]
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
          d="M40 610 C170 590, 300 540, 430 480 S700 360, 850 320 S1030 260, 1160 220"
          fill="none"
          stroke="rgba(52,211,153,0.34)"
          strokeWidth="2"
        />
        <path
          d="M40 665 C180 650, 330 620, 480 600 S760 550, 920 500 S1060 470, 1170 450"
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

      {floatingLabels.map((label) => (
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
  return <div key={activeTab} className="animate-[pageFlip_340ms_ease] will-change-transform">{children}</div>
}

function MobileScrollHint() {
  return (
    <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-black/45 md:hidden">
      ← Swipe to view full chart →
    </p>
  )
}

function FooterStatusPanel({ activeTab, searchTerm, config }) {
  const tabLabel = config.tabs.find((tab) => tab.key === activeTab)?.footerLabel || config.tabs[0]?.label

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
            <p className="mt-3 text-xl font-semibold text-white">{config.footerReferenceType}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Active Tab</p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Primary Use</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{config.footerPrimaryUse}</p>
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

export default function ConversionReferencePage({ config }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(config.tabs[0].key)

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

  const activeTabConfig = config.tabs.find((tab) => tab.key === activeTab) || config.tabs[0]

  const filteredRowsByTab = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return Object.fromEntries(
      config.tabs.map((tab) => {
        if (!term) return [tab.key, tab.rows]
        return [
          tab.key,
          tab.rows.filter((row) => row.cells.join(' ').toLowerCase().includes(term)),
        ]
      })
    )
  }, [config.tabs, searchTerm])

  const filteredQuickNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return config.quickNotes

    return config.quickNotes.filter((row) => row.title.toLowerCase().includes(term) || row.body.join(' ').toLowerCase().includes(term))
  }, [config.quickNotes, searchTerm])

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={config.pageUrl} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={config.pageUrl} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.metaTitle} />
        <meta name="twitter:description" content={config.ogDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: config.metaTitle,
            url: config.pageUrl,
            description: config.metaDescription,
            publisher: {
              '@type': 'Organization',
              name: 'RuntWerkx',
              url: 'https://runtwerkx.com',
            },
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-10 lg:px-14">
        <GraphBackdrop labels={config.backdropLabels} />

        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="mb-8">
            <Link to="/knowledge-library/calculators-charts-conversions" className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">
              ← Back to Calculators, Charts & Conversions
            </Link>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-emerald-400">― Current Location ―</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">{config.heroTitle}</h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">{config.heroDescription}</p>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">{config.heroSubtext}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {config.quickPills.map((item) => (
                <QuickRefPill
                  key={item}
                  value={item}
                  isActive={searchTerm.toLowerCase() === item.toLowerCase()}
                  onClick={() => setSearchTerm((prev) => prev.toLowerCase() === item.toLowerCase() ? '' : item)}
                />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="mx-auto max-w-5xl">
              <div className="mb-14 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">― Reference Sheet ―</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{activeTabConfig.title}</h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">{activeTabConfig.description}</p>
              </div>

              <div className="relative overflow-visible rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                {/* Mobile fix: keep notebook tabs on one line and scroll horizontally instead of wrapping. */}
                <div className="absolute -top-10 left-4 right-4 z-20 overflow-x-auto whitespace-nowrap md:left-10 md:right-10 lg:right-auto">
                  <div className="flex w-max gap-2 pr-4">
                    {config.tabs.map((tab) => <NotebookTab key={tab.key} tab={tab} activeTab={activeTab} onClick={setActiveTab} />)}
                  </div>
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-4 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">RuntWerkx Reference</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">{config.notebookTitle}</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">{config.notebookDescription}</p>
                      </div>

                      <div className="w-full xl:w-[420px]">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={activeTabConfig.searchPlaceholder}
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      <MobileScrollHint />

                      {/* Mobile fix: preserve readability by scrolling wide notebook tables instead of compressing them. */}
                      <div className="rounded-[1.6rem] border border-black/10 bg-white/45">
                        <div className="overflow-x-auto">
                          <div className={activeTabConfig.minWidthClass}>
                            <div className={`grid ${getGridClass(activeTabConfig.columns.length)} border-b border-black/10 ${activeTabConfig.headerClass} px-4 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70 md:px-5`}>
                              {activeTabConfig.columns.map((column) => (
                                <div key={column}>{column}</div>
                              ))}
                            </div>

                            <div className="max-h-[900px] overflow-y-auto">
                              {filteredRowsByTab[activeTab].map((row, index) => (
                                <div key={`${activeTab}-${row.cells.join('-')}`} className={`grid ${getGridClass(activeTabConfig.columns.length)} px-4 py-3 text-base ${index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'} md:px-5`}>
                                  {row.cells.map((cell, cellIndex) => (
                                    <div key={`${row.cells[0]}-${cellIndex}`} className={cellIndex === 0 ? 'font-semibold' : ''}>
                                      {cell}
                                    </div>
                                  ))}
                                </div>
                              ))}

                              {filteredRowsByTab[activeTab].length === 0 && (
                                <div className="px-4 py-8 text-center text-black/60 md:px-5">No chart rows matched that search.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        {activeTabConfig.notes.map((note) => (
                          <div key={note.title} className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                            <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${note.accentClass}`}>{note.title}</p>
                            <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                              {note.body.map((entry) => (
                                <p key={entry}>{entry}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </NotebookPanel>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Daily Conversion Notes</p>
                      <div className="mt-4 space-y-4">
                        {filteredQuickNotes.map((row) => (
                          <div key={row.title} className="rounded-2xl border border-black/10 bg-white/60 p-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/75">{row.title}</p>
                            {row.body.map((entry) => (
                              <p key={entry} className="mt-2 text-sm leading-7 text-black/75">
                                {entry}
                              </p>
                            ))}
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
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">{config.companionDescription}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {config.companionCards.map((card) => (
                  <div key={card.title} className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">{card.title}</p>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                      {card.body.map((entry) => (
                        <p key={entry}>{entry}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">― What This Chart Covers ―</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{config.coverageTitle}</h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">{config.coverageDescription}</p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-500/15 bg-black/40 p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">― Related Tools & References ―</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Continue through the RuntWerkx reference system</h3>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {config.relatedLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <FooterStatusPanel activeTab={activeTab} searchTerm={searchTerm} config={config} />
        </div>
      </section>
    </div>
  )
}