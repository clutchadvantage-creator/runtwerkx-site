import { Link } from 'react-router-dom'

export default function MediaCenterCard({ item, featured = false }) {
  const isDownload = Boolean(item.download)
  const isInternalRoute =
    !isDownload &&
    typeof item.href === 'string' &&
    item.href.startsWith('/')

  const CardWrapper = isInternalRoute ? Link : item.href ? 'a' : 'div'

  const baseClassName = `group relative block overflow-hidden rounded-[1.5rem] border p-5 transition ${
    featured
      ? 'border-green-500/20 bg-black/60 shadow-[0_0_28px_rgba(34,197,94,0.06)]'
      : 'border-white/10 bg-black/55 hover:-translate-y-0.5 hover:scale-[1.003] hover:border-green-400/25 hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)]'
  }`

  const cardProps = isInternalRoute
    ? {
        to: item.href,
        className: baseClassName,
      }
    : item.href
      ? {
          href: item.href,
          className: baseClassName,
          ...(isDownload ? { download: true } : {}),
        }
      : {
          className: baseClassName,
        }

  return (
    <CardWrapper {...cardProps}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:22px_22px] opacity-[0.05]" />
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-green-400">
            {item.category || 'Resource'}
          </div>

          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            {item.status || 'Available'}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-bold text-white">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/65">
          {item.description}
        </p>

        <div className="mt-5 h-px w-20 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

        {item.href && (
          <div className="mt-5 inline-flex items-center rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-300 transition group-hover:border-green-400/35 group-hover:bg-green-500/15">
            {isDownload ? 'Download .exe' : 'Open Resource'}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}