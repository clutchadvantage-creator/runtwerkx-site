import MediaCenterCard from './MediaCenterCard'

export default function MediaCenterFeatured({ items = [] }) {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-6 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mx-auto max-w-3xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Featured Content ―
        </div>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Highlighted Media
        </h2>

        <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/65">
          Featured items can later hold launch videos, onboarding clips, product
          overviews, or support media for your apps and systems.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.length > 0 ? (
          items.map((item) => (
            <MediaCenterCard key={item.id} item={item} featured />
          ))
        ) : (
          <div className="col-span-full text-center text-sm uppercase tracking-[0.2em] text-white/40">
            No featured content yet
          </div>
        )}
      </div>
    </section>
  )
}