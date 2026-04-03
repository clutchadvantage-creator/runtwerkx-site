import { useNavigate } from 'react-router-dom'

export default function MediaCenterSidebar({ categories }) {
  const navigate = useNavigate()

  return (
    <aside className="rounded-[1.75rem] border border-white/10 bg-black/50 p-5 h-fit">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400 text-center">
        ― Library Navigation ―
      </div>

      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(category.to)}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-4 text-center transition-all duration-300 hover:-translate-y-[2px] hover:border-green-400/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] active:translate-y-[1px]"
          >
            {/* shine sweep */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm animate-[shine_1.2s_ease]" />
            </div>

            {/* subtle inner border */}
            <div className="absolute inset-0 rounded-2xl border border-white/5" />

            {/* content */}
            <div className="relative">
              <div className="text-sm font-semibold text-white tracking-wide">
                {category.title}
              </div>

              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/40">
                {category.status}
              </div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </aside>
  )
}