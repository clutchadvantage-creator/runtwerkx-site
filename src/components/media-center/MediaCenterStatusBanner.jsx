export default function MediaCenterStatusBanner() {
  return (
    <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/50 p-6">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* TEXT BLOCK */}
        <div className="mx-auto max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.26em] text-green-400">
            ― Announcements ―
          </div>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Update 1.0.1 Release
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/65">
            Update-1.0.1 Notes-
            All currently planned calculators have now been implemented as of this update. We also wired in the Featured Content Section, so keep an eye out for new things showing up there.
             The Charts Section has been started as well with a few charts added as part of this update.
            When the Chart Conversions & Calculators page is finished the next planned phase is for the Fabrication page. Look for updates and changes HERE.
            We appreciate your paitence as we continue to develop the site.
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