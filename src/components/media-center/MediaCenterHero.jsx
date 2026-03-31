export default function MediaCenterHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/60 p-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_28%)]" />
      <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-green-500/16 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-green-400/10 blur-[100px]" />

      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
          ⇼ Media Center ⇼
        </div>

        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
          RuntWerkx Digital Library
        </h1>

        <div className="mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
          A future-ready library for training videos, product walkthroughs,
          support media, promotional content, quick-start guides, and other
          knowledge assets across the RuntWerkx ecosystem.
        </p>
      </div>
    </section>
  )
}