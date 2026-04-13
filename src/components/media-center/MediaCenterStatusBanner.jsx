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
            Update 1.0.3 Release
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/65">
            The Knowledge Library has expanded again with new live industry hubs for manufacturing, shipping, and construction, plus dedicated worksheet systems for fabrication, manufacturing, shipping, and construction. Recent work added multimodal shipping coverage for trucking, rail, maritime, and air, new hazmat, export, freight-claims, and OS&D worksheets, cleaner quick-reference content, dropdown resource panels to shorten long pages, and updated custom background images for the new industry sections. This release continues the push toward practical, connected tools and working references that people can use directly on the job.
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