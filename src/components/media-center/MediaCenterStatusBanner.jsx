export default function MediaCenterStatusBanner() {
  return (
    <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/50 p-6">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* TEXT BLOCK */}
        <div className="mx-auto max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.26em] text-green-400">
            ― Update Notes ―
          </div>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Work Has Began!
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/65">
            We are happy to announce that the first two calculators have been added to the library and we have more coming! We appreciate your paitence as we continue to develop the site.
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">
          New Update Online
        </div>

      </div>
    </section>
  )
}