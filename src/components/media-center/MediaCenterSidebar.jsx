export default function MediaCenterSidebar({ categories }) {
  return (
    <aside className="rounded-[1.75rem] border border-white/10 bg-black/50 p-5 h-fit">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
        ― Library Navigation ―
      </div>

      <div className="mt-5 space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="text-sm font-semibold text-white">{category.title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
              {category.status}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}