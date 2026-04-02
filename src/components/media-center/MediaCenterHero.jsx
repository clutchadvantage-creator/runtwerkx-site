export default function MediaCenterHero() {
  return (
    <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">

      {/* VIDEO */}
      <video
        src="/videos/rwlibrarygreenglow2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OPTIONAL DARK FADE FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* TEXT OVERLAY */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto max-w-7xl px-6 pb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
          ― Welcome To ―
          </div>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Our Library For Industry Professionals
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-white/80">
            ― Training ― Docs & Links ― Operational Knowledge ―
          </p>
        </div>
      </div>
    </section>
  )
}