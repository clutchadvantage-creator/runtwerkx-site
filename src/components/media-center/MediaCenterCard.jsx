export default function MediaCenterCard({ item, featured = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border p-5 transition ${
        featured
          ? 'border-green-500/20 bg-black/60 shadow-[0_0_28px_rgba(34,197,94,0.06)]'
          : 'border-white/10 bg-black/55 hover:border-green-400/25'
      }`}
    >
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-green-400">
            {item.category}
          </div>

          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            {item.status}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>

        <p className="mt-3 text-sm leading-7 text-white/65">
          {item.description}
        </p>

        <div className="mt-5 h-px w-20 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
      </div>
    </div>
  )
}