export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">

        {/* LEFT SIDE */}
        <div>
          {/* CENTERED HEADER */}
          <div className="mx-auto max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
              ― About ―
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Humble Beginnings
            </h2>

            <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
          </div>

          {/* IMAGE PANEL */}
          <div className="group relative mt-8 h-[340px] w-full overflow-hidden rounded-[1.75rem] border border-green-500/20 bg-black/50 shadow-[0_0_35px_rgba(34,197,94,0.08)] md:h-[460px]">

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:26px_26px]" />

            {/* GLOW EFFECTS */}
            <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-green-500/20 blur-3xl transition duration-700 group-hover:translate-x-2 group-hover:scale-110" />
            <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-green-400/10 blur-[90px] transition duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:scale-110" />

            {/* IMAGE */}
            <img
              src="/images/about-industrial.jpg"
              alt="RuntWerkx industrial background and systems journey"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.92] transition duration-700 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1"
            />

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/20 to-green-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.05),transparent_22%)] opacity-80 transition duration-700 group-hover:opacity-100" />

            {/* OPTIONAL BOTTOM CONTENT AREA */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              {/* future content */}
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-[1.08rem] leading-9 text-white/78">

          <p>
            My path into systems and software didn't start behind a desk—it started by taking things apart
            as a young guy to understand how they worked. That curiosity carried into years of hands-on
            experience across construction, heavy equipment, and steel fabrication, where I worked directly
            with machines, production workflows, and real-world operational challenges.
          </p>

          <p className="mt-6">
            Over time, that evolved into advanced machine operations, including working with robotic welding
            systems and complex fabrication processes, where precision, efficiency, and system reliability
            are critical. Today, that same mindset drives my work in software and systems development. With
            over 12 years of industrial experience, I build tools grounded in real workflows—not theory.
          </p>

          <p className="mt-6">
            My background includes working with industry-standard platforms such as StruMIS, AutoCAD, Tekla
            Structures, PrimeCut, Raptor, Peddinghaus, HGG, and AGT Robotics, along with exposure to HRIS,
            EHS, and operational systems. I've also developed skills in PC building, networking, and systems
            administration. RuntWerkx ― is a direct result of that journey, bringing together real-world
            industrial knowledge with modern software development to create tools that are practical,
            efficient, and built for the environments they serve.
          </p>

        </div>

      </div>
    </section>
  )
}