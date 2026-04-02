import { useNavigate } from 'react-router-dom'
import WorkflowPanel from './WorkflowPanel'
import HeroSystemConnectors from './HeroSystemConnectors'
import HeroImagePanel from './HeroImagePanel'
import { developmentCards } from '../../data/homeContent'
import { handleAction, scrollToId } from '../../utils/homeUtils'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_20%)]" />

        <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(rgba(34,197,94,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.22)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-green-500/20 blur-[110px] animate-pulse" />
        <div className="absolute right-[-5rem] bottom-[-6rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px] animate-pulse" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="text-center md:text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
            ― RUNTWERKX ―
          </p>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Software & Applications For Industry Professionals
          </h1>

          <p className="mx-auto max-w-xl text-lg text-white/75">
            We build custom industrial software, workflow automation tools, and operational systems built for manufacturing, fabrication, and real-world production environments.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToId('contact')}
              className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Start A Project
            </button>

            <button
              type="button"
              onClick={() => scrollToId('work')}
              className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-green-400 hover:text-green-400"
            >
              Our Products
            </button>
          </div>

          <HeroImagePanel />
        </div>

        <div className="relative">
          <HeroSystemConnectors />

          <div className="grid gap-4">
            <WorkflowPanel />

            {developmentCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleAction(card.action, navigate)}
                className={`relative rounded-3xl p-6 text-left transition duration-300 hover:-translate-y-1 ${
                  card.style === 'featured'
                    ? 'border border-green-500/30 bg-white/5 shadow-2xl backdrop-blur hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.18)]'
                    : 'border border-white/10 bg-white/5 hover:border-green-400/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.14)]'
                }`}
              >
                <div className="absolute left-1/2 top-0 hidden h-8 w-px -translate-x-1/2 bg-gradient-to-b from-green-400/0 via-green-400/70 to-green-400/0 lg:block" />
                <div className="mb-3 text-sm uppercase tracking-[0.2em] text-green-400">
                  {card.eyebrow}
                </div>
                <div className="text-2xl font-bold">{card.title}</div>
                <p className="mt-2 text-white/70">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}