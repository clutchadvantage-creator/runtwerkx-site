import MediaCenterCard from './MediaCenterCard'

export default function MediaCenterLibrarySection({
  title,
  description,
  items,
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/45 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
        ⇼ Section ⇼
      </div>

      <h2 className="mt-3 text-2xl font-bold text-white">{title}</h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
        {description}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MediaCenterCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}