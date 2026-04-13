import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Factory,
  Gauge,
  Search,
} from 'lucide-react'

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

function SummaryCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-500/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <Icon className="mx-auto h-6 w-6 text-green-400" />
      <div className="mt-4 text-sm font-semibold text-white">{item.title}</div>
      <p className="mt-2 text-sm leading-7 text-white/65">{item.description}</p>
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

function QuickReferenceCard({ item }) {
  const Icon = item.icon ?? BookOpen

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 transition duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          {item.eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">{item.eyebrow}</div> : null}
          <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/68">{item.description}</p>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-white/72">
        {item.points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="font-bold text-green-400">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {item.note ? <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">{item.note}</p> : null}
    </div>
  )
}

function AccordionItemRow({ item }) {
  const title = item.title || item.name
  const description = item.description || item.note
  const eyebrow = item.eyebrow || item.type

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-4 transition hover:border-green-400/25 hover:bg-black/50"
      >
        <div>
          {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400">{eyebrow}</div> : null}
          <div className="mt-1 text-base font-semibold text-white">{title}</div>
          {description ? <p className="mt-2 text-sm leading-6 text-white/68">{description}</p> : null}
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-green-300" />
      </Link>
    )
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-4 transition hover:border-green-400/25 hover:bg-black/50"
    >
      <div>
        {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400">{eyebrow}</div> : null}
        <div className="mt-1 text-base font-semibold text-white">{title}</div>
        {description ? <p className="mt-2 text-sm leading-6 text-white/68">{description}</p> : null}
      </div>
      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-green-300" />
    </a>
  )
}

function AccordionGroupSection({ id, eyebrow, title, description, groups, categoryLabel = 'Category', className = 'border-white/10 bg-black/45' }) {
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(groups.map((group, index) => [group.title, index === 0]))
  )

  function toggleGroup(groupTitle) {
    setOpenGroups((current) => ({
      ...current,
      [groupTitle]: !current[groupTitle],
    }))
  }

  return (
    <section className={`rounded-[2rem] border p-8 backdrop-blur-sm ${className}`}>
      <SectionHeader id={id} eyebrow={eyebrow} title={title} description={description} />

      <div className="mt-12 grid gap-4">
        {groups.map((group) => {
          const isOpen = !!openGroups[group.title]

          return (
            <div key={group.title} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">{categoryLabel}</div>
                  <h3 className="mt-2 text-xl font-bold text-white">{group.title}</h3>
                  {group.description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{group.description}</p> : null}
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-green-400/20 bg-green-500/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green-300">
                    {group.items.length} Items
                  </span>
                  <ChevronDown className={`h-5 w-5 text-green-300 transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen ? (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <AccordionItemRow key={item.title || item.name} item={item} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
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

function ToolCard({ tool, utilityLabel }) {
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
            {utilityLabel}
          </div>

          <div
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isLive
                ? 'border border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_14px_rgba(34,197,94,0.18)]'
                : 'border border-white/10 bg-white/[0.04] text-white/45'
            }`}
          >
            <span className={isLive ? 'text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]' : ''}>{tool.status}</span>
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-white">{tool.title}</h3>

        <p className="mt-4 text-sm leading-7 text-white/68">{tool.description}</p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/40">
          {isLive ? 'Interactive utility available' : 'Placeholder utility path'}
        </div>
      </div>
    </Wrapper>
  )
}

function ResourceFinder({ resources, title, description, searchPlaceholder, categories }) {
  const [query, setQuery] = useState('')
  const [openCategories, setOpenCategories] = useState(() =>
    Object.fromEntries(categories.map((category) => [category, false]))
  )

  const groupedResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return categories
      .map((category) => {
        const items = resources.filter((resource) => {
          const haystack = [resource.title, resource.description, resource.note ?? '', resource.eyebrow ?? '']
            .join(' ')
            .toLowerCase()

          const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery)
          return resource.category === category && queryMatch
        })

        return { category, items }
      })
      .filter((group) => group.items.length > 0)
  }, [categories, query, resources])

  function toggleCategory(category) {
    setOpenCategories((current) => ({
      ...current,
      [category]: !current[category],
    }))
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
      <SectionHeader id="finder" eyebrow="― Resource Finder ―" title={title} description={description} />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-2xl border border-green-400/20 bg-black/50 py-3 pl-11 pr-4 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/65">
          {groupedResources.length} active categories
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        {groupedResources.map((group) => {
          const isOpen = !!openCategories[group.category]

          return (
            <div key={group.category} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
              <button
                type="button"
                onClick={() => toggleCategory(group.category)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">Resource Category</div>
                  <h3 className="mt-2 text-xl font-bold text-white">{group.category}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-green-400/20 bg-green-500/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green-300">
                    {group.items.length} Links
                  </span>
                  <ChevronDown className={`h-5 w-5 text-green-300 transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen ? (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="space-y-3">
                    {group.items.map((resource) =>
                      resource.to ? (
                        <Link
                          key={`${group.category}-${resource.title}`}
                          to={resource.to}
                          className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-4 transition hover:border-green-400/25 hover:bg-black/50"
                        >
                          <div>
                            <div className="text-base font-semibold text-white">{resource.title}</div>
                            <p className="mt-2 text-sm leading-6 text-white/68">{resource.description}</p>
                          </div>
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-green-300" />
                        </Link>
                      ) : (
                        <a
                          key={`${group.category}-${resource.title}`}
                          href={resource.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-4 transition hover:border-green-400/25 hover:bg-black/50"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-base font-semibold text-white">{resource.title}</div>
                              {resource.note ? (
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                                  {resource.note}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/68">{resource.description}</p>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-green-300" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}

        {groupedResources.length === 0 ? (
          <div className="xl:col-span-2 rounded-[1.5rem] border border-white/10 bg-black/35 px-5 py-8 text-center text-sm text-white/60">
            No resources matched that search.
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default function IndustryPlaceholderPage({ config }) {
  const [activeSection, setActiveSection] = useState('overview')

  const finderResources = useMemo(
    () => [
      ...config.officialResources.map((item) => ({
        title: item.title,
        description: item.description,
        href: item.href,
        category: 'Official Docs',
        note: item.type,
      })),
      ...config.tools
        .filter((item) => item.to)
        .map((item) => ({
          title: item.title,
          description: item.description,
          to: item.to,
          category: 'Tools',
        })),
      ...config.oemGroups.flatMap((group) =>
        group.items.map((item) => ({
          title: item.name,
          description: item.note,
          href: item.href,
          category: 'OEMs',
        }))
      ),
      ...config.roboticsCompanies.map((item) => ({
        title: item.name,
        description: item.note,
        href: item.href,
        category: 'Robotics',
      })),
      ...config.supplyGroups.flatMap((group) =>
        group.items.map((item) => ({
          title: item.name,
          description: item.note,
          href: item.href,
          category: 'Suppliers',
        }))
      ),
    ],
    [config]
  )

  useEffect(() => {
    const elements = config.sectionLinks.map((section) => document.getElementById(section.id)).filter(Boolean)
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
  }, [config.sectionLinks])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div
        className="fixed inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
        }}
      />

      <div className="fixed inset-0 z-0 bg-black/48" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.10),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.52))]" />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_18%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -left-20 top-[-3rem] h-72 w-72 rounded-full bg-green-500/12 blur-[110px]" />
        <div className="absolute right-[-5rem] top-[2rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]" />
      </div>

      <main className="relative z-10 overflow-hidden">
        <section className="relative z-10 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
            <div className="mb-8">
              <Link
                to="/knowledge-library"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/50 hover:text-white"
              >
                ← Back to Knowledge Library
              </Link>
            </div>

            <div className="mx-auto max-w-5xl rounded-[2rem] bg-black/55 px-6 py-12 text-center backdrop-blur-[2px] md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.30em] text-green-400">― Current Location ―</p>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">{config.pageTitle}</h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">{config.heroDescription}</p>

              <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-white/60">{config.heroSubtext}</p>
            </div>
          </div>
        </section>

        <section className="relative z-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12 lg:py-14">
            <aside className="h-fit rounded-[1.75rem] border border-green-500/15 bg-zinc-950/70 p-5 shadow-[0_0_35px_rgba(34,197,94,0.08)] backdrop-blur-sm">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-green-400">― Page Navigation ―</div>

              <nav className="mt-6 space-y-3">
                {config.sectionLinks.map((section) => {
                  const isActive = !section.to && activeSection === section.id
                  const sharedClassName = `group flex items-center justify-center gap-3 rounded-full border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition duration-300 ${
                    isActive
                      ? 'border-green-400/35 bg-white/[0.08] text-white shadow-[0_0_18px_rgba(34,197,94,0.14)]'
                      : 'border-white/10 bg-white/[0.04] text-green-300 hover:-translate-y-0.5 hover:border-green-400/30 hover:bg-white/[0.08] hover:text-white'
                  }`

                  if (section.to) {
                    return (
                      <Link key={section.to} to={section.to} className={sharedClassName}>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500/40 transition duration-300 group-hover:bg-green-300/80" />
                        <span>{section.label}</span>
                        <ArrowRight className="h-4 w-4 text-green-400 transition duration-300" />
                      </Link>
                    )
                  }

                  return (
                    <a key={section.id} href={`#${section.id}`} className={sharedClassName}>
                      <span className={`h-2.5 w-2.5 rounded-full transition duration-300 ${isActive ? 'bg-green-300 shadow-[0_0_12px_rgba(134,239,172,0.95)]' : 'bg-green-500/40 group-hover:bg-green-300/80'}`} />
                      <span>{section.label}</span>
                      <ArrowRight className={`h-4 w-4 transition duration-300 ${isActive ? 'text-green-200' : 'text-green-400'}`} />
                    </a>
                  )
                })}
              </nav>

              <div className="mt-6 rounded-[1.5rem] border border-green-500/15 bg-black/40 p-4 text-center">
                <div className="text-sm font-semibold text-white">{config.sidebarTitle}</div>
                <p className="mt-2 text-sm leading-6 text-white/60">{config.sidebarDescription}</p>
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader id="overview" eyebrow={config.overview.eyebrow} title={config.overview.title} description={config.overview.description} />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {config.summaryCards.map((item) => (
                    <SummaryCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              <ResourceFinder
                resources={finderResources}
                title={config.finder.title}
                description={config.finder.description}
                searchPlaceholder={config.finder.searchPlaceholder}
                categories={config.resourceFinderCategories}
              />

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader id="disciplines" eyebrow={config.disciplinesSection.eyebrow} title={config.disciplinesSection.title} description={config.disciplinesSection.description} />

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {config.disciplines.map((item) => (
                    <DisciplineCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader id="charts" eyebrow={config.chartsSection.eyebrow} title={config.chartsSection.title} description={config.chartsSection.description} />

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  {config.processStartingPoints.map((item) => (
                    <ProcessCard key={item.title} item={item} />
                  ))}
                </div>
              </section>

              {config.quickReferenceSection && config.quickReferenceCards?.length ? (
                <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                  <SectionHeader
                    id="quick-reference"
                    eyebrow={config.quickReferenceSection.eyebrow}
                    title={config.quickReferenceSection.title}
                    description={config.quickReferenceSection.description}
                  />

                  <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {config.quickReferenceCards.map((item) => (
                      <QuickReferenceCard key={item.title} item={item} />
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                <SectionHeader id="tools" eyebrow={config.toolsSection.eyebrow} title={config.toolsSection.title} description={config.toolsSection.description} />

                <div className="mt-12 grid gap-6">
                  {config.tools.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} utilityLabel={config.utilityLabel} />
                  ))}
                </div>
              </section>

              {config.officialResourcesDisplay === 'accordion' && config.officialResourceGroups?.length ? (
                <AccordionGroupSection
                  id="docs"
                  eyebrow={config.docsSection.eyebrow}
                  title={config.docsSection.title}
                  description={config.docsSection.description}
                  groups={config.officialResourceGroups}
                  categoryLabel="Reference Category"
                />
              ) : (
                <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                  <SectionHeader id="docs" eyebrow={config.docsSection.eyebrow} title={config.docsSection.title} description={config.docsSection.description} />

                  <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {config.officialResources.map((item) => (
                      <LinkCard key={item.title} title={item.title} description={item.description} href={item.href} eyebrow={item.type} />
                    ))}
                  </div>
                </section>
              )}

              {config.oemsDisplay === 'accordion' ? (
                <AccordionGroupSection
                  id="oems"
                  eyebrow={config.oemsSection.eyebrow}
                  title={config.oemsSection.title}
                  description={config.oemsSection.description}
                  groups={config.oemGroups}
                  categoryLabel="Carrier Category"
                />
              ) : (
                <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                  <SectionHeader id="oems" eyebrow={config.oemsSection.eyebrow} title={config.oemsSection.title} description={config.oemsSection.description} />

                  <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {config.oemGroups.map((group) => (
                      <SupplierGroupCard key={group.title} group={group} />
                    ))}
                  </div>
                </section>
              )}

              {config.roboticsDisplay === 'accordion' && config.roboticsGroups?.length ? (
                <AccordionGroupSection
                  id="robotics"
                  eyebrow={config.roboticsSection.eyebrow}
                  title={config.roboticsSection.title}
                  description={config.roboticsSection.description}
                  groups={config.roboticsGroups}
                  categoryLabel="Automation Category"
                />
              ) : (
                <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                  <SectionHeader id="robotics" eyebrow={config.roboticsSection.eyebrow} title={config.roboticsSection.title} description={config.roboticsSection.description} />

                  <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {config.roboticsCompanies.map((company) => (
                      <LinkCard key={company.name} title={company.name} description={company.note} href={company.href} eyebrow={config.roboticsCardEyebrow} />
                    ))}
                  </div>
                </section>
              )}

              {config.suppliesDisplay === 'accordion' ? (
                <AccordionGroupSection
                  id="supplies"
                  eyebrow={config.suppliesSection.eyebrow}
                  title={config.suppliesSection.title}
                  description={config.suppliesSection.description}
                  groups={config.supplyGroups}
                  categoryLabel="Supply Category"
                />
              ) : (
                <section className="rounded-[2rem] border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
                  <SectionHeader id="supplies" eyebrow={config.suppliesSection.eyebrow} title={config.suppliesSection.title} description={config.suppliesSection.description} />

                  <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {config.supplyGroups.map((group) => (
                      <SupplierGroupCard key={group.title} group={group} />
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-[2rem] border border-green-500/15 bg-black/50 p-8 backdrop-blur-sm">
                <SectionHeader id="practices" eyebrow={config.practicesSection.eyebrow} title={config.practicesSection.title} description={config.practicesSection.description} />

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {config.bestPractices.map((item) => (
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