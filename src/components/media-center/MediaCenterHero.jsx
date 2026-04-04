export default function MediaCenterHero() {
  return (
    <section className="relative w-full h-[520px] md:h-[620px] flex items-center justify-center px-6">

      {/* 🔥 FOREGROUND PANEL */}
      <div className="relative w-full max-w-6xl h-[420px] md:h-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">

        {/* 🎥 PANEL VIDEO */}
        <video
          src="/videos/rwlibrarygreenglow2.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🔥 PANEL OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* 🔥 TEXT */}
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-4xl px-6 pb-12 text-center">

            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
              ― Welcome To ―
            </div>

            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Our Library For Industry Professionals
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              ― Training ― Docs & Links ― Operational Knowledge ―
            </p>

          </div>
        </div>

      </div>

    </section>
  )
}