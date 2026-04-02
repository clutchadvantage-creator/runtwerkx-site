export default function MediaCenterStatusBanner() {
  return (
    <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.26em] text-green-400">
            ― Update Notes ―
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Under Construction
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
            This page is being built as a modular knowledge platform so content
            can be added cleanly over time. In the future any updates to the page will be posted HERE in this banner.
          </p>
        </div>

        <div className="rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">
          Framework Online
        </div>
      </div>
    </section>
  )
}