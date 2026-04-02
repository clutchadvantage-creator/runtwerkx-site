import { servicesCards } from '../../data/homeContent'

export default function ServicesSection() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_20%),radial-gradient(circle_at_80%_70%,rgba(34,197,94,0.08),transparent_22%)]" />

        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/60"
            style={{
              left: `${5 + ((i * 9) % 90)}%`,
              top: `${8 + ((i * 13) % 78)}%`,
              animation: `serviceSpark ${4.5 + (i % 4)}s linear infinite`,
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">― RuntWerkx Is ―</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Your Partner In Digital Systems Implementation.</h2>
        <div className="mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
      </div>

      <div className="relative grid gap-6 md:grid-cols-3">
        {servicesCards.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:bg-white/[0.07] hover:shadow-[0_0_35px_rgba(34,197,94,0.12)]"
          >
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_28%)] pointer-events-none" />
            <h3 className="relative text-xl font-bold">{item.title}</h3>
            <p className="relative mt-3 text-white/70">{item.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes serviceSpark {
          0% {
            transform: translateY(0px);
            opacity: 0.12;
          }
          50% {
            transform: translateY(-18px);
            opacity: 0.85;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.12;
          }
        }
      `}</style>
    </section>
  )
}