export default function HeroImagePanel() {
  return (
    <div className="mt-12">
      <div className="group relative h-[280px] w-full overflow-hidden rounded-[1.75rem] border border-green-500/15 bg-black/40 shadow-[0_0_35px_rgba(34,197,94,0.10)] lg:h-[380px]">
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.16)_1px,transparent_1px)] bg-[size:26px_26px]" />

        <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-green-500/20 blur-3xl transition duration-700 group-hover:translate-x-3 group-hover:scale-110" />
        <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-green-400/10 blur-[90px] transition duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:scale-110" />

        <img
          src="/images/hero-background5.png"
          alt="RuntWerkx Industrial Systems"
          className="h-full w-full scale-[1.02] object-cover opacity-90 transition duration-700 ease-out group-hover:scale-[1.07] group-hover:-translate-y-1"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.14),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.06),transparent_22%)] opacity-80 transition duration-700 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/20 to-green-500/10" />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="inline-flex rounded-full border border-green-400/25 bg-black/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-green-300 backdrop-blur">
            Save Time ⇼ Save Money ⇼ Boost Efficiency
          </div>
        </div>
      </div>
    </div>
  )
}