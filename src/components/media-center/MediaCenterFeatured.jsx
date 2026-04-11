import { useMemo, useState } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'

function getEmbedUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtu.be')
    ) {
      let videoId = ''

      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '')
      } else {
        videoId = parsed.searchParams.get('v') || ''
      }

      if (!videoId) return null

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      if (!videoId) return null
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&title=0&byline=0&portrait=0`
    }

    return null
  } catch {
    return null
  }
}

function getFullscreenEmbedUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtu.be')
    ) {
      let videoId = ''

      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '')
      } else {
        videoId = parsed.searchParams.get('v') || ''
      }

      if (!videoId) return null

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      if (!videoId) return null
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
    }

    return null
  } catch {
    return null
  }
}

function FeaturedMediaCard({ item, onOpen }) {
  const previewEmbedUrl = useMemo(() => getEmbedUrl(item.videoUrl || item.href), [item])
  const thumbnail = item.thumbnail || item.image || ''

  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-green-500/15 bg-zinc-950/75 shadow-[0_0_30px_rgba(34,197,94,0.06)] transition duration-300 hover:-translate-y-1 hover:border-green-400/30 hover:shadow-[0_0_35px_rgba(34,197,94,0.10)]">
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative">
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="relative block w-full text-left"
        >
          <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-black">
            {previewEmbedUrl ? (
              <iframe
                src={previewEmbedUrl}
                title={item.title}
                className="h-full w-full scale-[1.02]"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : thumbnail ? (
              <img
                src={thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.9))]">
                <div className="flex items-center gap-3 rounded-full border border-green-400/20 bg-black/50 px-5 py-3 text-sm uppercase tracking-[0.18em] text-green-300">
                  <Play className="h-4 w-4" />
                  Preview Media
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          </div>

          <div className="p-5">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
                Runt's Picks
              </div>

              <h3 className="mt-3 text-xl font-bold text-white">
                {item.title}
              </h3>
            </div>

            {(item.notes || item.commentary) && (
              <div className="mt-4 rounded-[1rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">
                  RuntWerkx Notes
                </div>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {item.notes || item.commentary}
                </p>
              </div>
            )}
          </div>
        </button>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 transition hover:border-green-400/40 hover:bg-green-500/[0.12] hover:text-white"
          >
            <Play className="h-3.5 w-3.5" />
            Open Viewer
          </button>

          {(item.videoUrl || item.href) && (
            <a
              href={item.videoUrl || item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-green-400/30 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit Source
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function FeaturedMediaModal({ item, onClose }) {
  const fullEmbedUrl = useMemo(
    () => getFullscreenEmbedUrl(item?.videoUrl || item?.href),
    [item]
  )

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm md:p-6">
      <div className="mx-auto my-6 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-green-500/20 bg-zinc-950 shadow-[0_0_60px_rgba(34,197,94,0.12)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/80 transition hover:border-green-400/30 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="border-b border-white/10 bg-black lg:border-b-0 lg:border-r">
            <div className="aspect-video w-full">
              {fullEmbedUrl ? (
                <iframe
                  src={fullEmbedUrl}
                  title={item.title}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : item.thumbnail || item.image ? (
                <img
                  src={item.thumbnail || item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.9))] text-green-300">
                  No preview available
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {item.category && (
                <span className="rounded-full border border-green-400/25 bg-green-500/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-300">
                  {item.category}
                </span>
              )}
              {item.sourceLabel && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  {item.sourceLabel}
                </span>
              )}
            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">
              {item.title}
            </h3>

            {item.description && (
              <p className="mt-4 text-sm leading-7 text-white/68">
                {item.description}
              </p>
            )}

            {(item.notes || item.commentary) && (
              <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
                  RuntWerkx Thoughts / Notes
                </div>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  {item.notes || item.commentary}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {(item.videoUrl || item.href) && (
                <a
                  href={item.videoUrl || item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 transition hover:border-green-400/40 hover:bg-green-500/[0.12] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Go To Source
                </a>
              )}

              {(item.homeUrl || item.sourceHomeUrl) && (
                <a
                  href={item.homeUrl || item.sourceHomeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-green-400/30 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Source Home
                </a>
              )}
            </div>

            <div className="mt-8 rounded-[1.25rem] border border-green-500/15 bg-black/40 p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">
                Featured Content Panel
              </div>
              <p className="mt-2 text-sm leading-7 text-white/62">
                This featured area is built to spotlight training videos,
                documentaries, shop content, industry explainers, and other
                media RuntWerkx wants to surface inside the Knowledge Library.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MediaCenterFeatured({ items = [] }) {
  const [activeItem, setActiveItem] = useState(null)

  return (
    <>
      <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-6 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Featured Content ―
          </div>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Media Center
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/65">
            RuntWerkx posts regular featured content based on current events around work places.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.length > 0 ? (
            items.map((item) => (
              <FeaturedMediaCard
                key={item.id}
                item={item}
                onOpen={setActiveItem}
              />
            ))
          ) : (
            <div className="col-span-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm uppercase tracking-[0.2em] text-white/40">
              No featured content yet
            </div>
          )}
        </div>
      </section>

      <FeaturedMediaModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </>
  )
}