import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'

const HERO_VIDEO_SRC = '/videos/calcs-conversions-hero.mp4'

function SectionHeader({ eyebrow, title, description, id }) {
  return (
    <div id={id} className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
        {description}
      </p>
    </div>
  )
}

function QuickNavCard({ href, title }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center rounded-full border border-green-400/20 bg-green-500/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-green-300 transition duration-300 hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-500/[0.10] hover:text-white hover:shadow-[0_0_18px_rgba(34,197,94,0.12)]"
    >
      {title}
    </a>
  )
}

function LibraryToolCard({ title, subtitle, description, status = 'Planned' }) {
  const live = status === 'Live'

  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:shadow-[0_0_24px_rgba(34,197,94,0.10)]">
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            {subtitle}
          </div>

          <div
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              live
                ? 'border border-green-400/30 bg-green-500/10 text-green-300'
                : 'border border-white/10 bg-white/[0.04] text-white/45'
            }`}
          >
            {status}
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-white">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/68">
          {description}
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/40">
          {live ? 'Interactive utility available' : 'Expandable utility slot'}
        </div>
      </div>
    </div>
  )
}

function LiveMathToolCard({ onClick, title, subtitle, description }) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[1.5rem]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <span className="absolute left-6 top-5 text-xl text-green-400/10 animate-[floatSymbol1_6s_ease-in-out_infinite]">
          +
        </span>
        <span className="absolute right-10 top-9 text-2xl text-green-400/10 animate-[floatSymbol2_7s_ease-in-out_infinite]">
          ×
        </span>
        <span className="absolute bottom-7 left-10 text-xl text-green-400/10 animate-[floatSymbol3_8s_ease-in-out_infinite]">
          ÷
        </span>
        <span className="absolute bottom-10 right-8 text-xl text-green-400/10 animate-[floatSymbol2_7s_ease-in-out_infinite]">
          −
        </span>
        <span className="absolute left-1/2 top-1/2 text-3xl text-green-400/5 animate-[floatSymbol1_6s_ease-in-out_infinite]">
          =
        </span>
      </div>

      <div className="relative z-10">
        <LibraryToolCard
          title={title}
          subtitle={subtitle}
          description={description}
          status="Live"
        />
      </div>
    </div>
  )
}

function ReferenceCard({ title, category, description, action = 'Reference Slot' }) {
  return (
    <div className="group rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-green-400/35 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
        {category}
      </div>

      <h3 className="mt-3 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/65">
        {description}
      </p>

      <div className="mt-5 inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {action}
      </div>
    </div>
  )
}

function RelatedTopicCard({ title, description, status = 'Planned' }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 transition duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {status}
        </div>
      </div>

      <p className="mt-3 text-sm leading-7 text-white/65">
        {description}
      </p>
    </div>
  )
}

function CommunityPanel() {
  return (
    <section
      id="community"
      className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/55 p-6 shadow-[0_0_35px_rgba(34,197,94,0.08)] md:p-8"
    >
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="absolute -left-8 top-0 h-28 w-28 rounded-full bg-green-500/14 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-green-400/10 blur-[90px]" />

      <div className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">
            ― Community Notes & Discussion ―
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Built to grow into a living professional knowledge exchange
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68">
            This section is planned as the future collaboration layer for the library.
            The goal is to give professionals a place to share practical notes,
            examples, photos, field observations, corrections, and discussion around
            real-world topics.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
              Comments
            </div>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Topic-based discussion threads for practical questions, shop-floor insight,
              and everyday reference use.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
              Images & Examples
            </div>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Space for field photos, example setups, diagram references, and visual
              knowledge sharing over time.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
              Curated Growth
            </div>
            <p className="mt-3 text-sm leading-7 text-white/65">
              A scalable structure that can evolve from clean notes and submissions into
              a fuller professional discussion system later.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-green-400/20 bg-green-500/[0.05] p-5 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">
            Planned System Direction
          </div>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/72">
            Start with a clean, curated reference system first. Then add a controlled
            contribution layer for comments, image uploads, field notes, and linked
            knowledge so the library can grow without turning into clutter.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function CalculatorsChartsConversionsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes floatSymbol1 {
          0% { transform: translateY(0px); opacity: 0.08; }
          50% { transform: translateY(-6px); opacity: 0.15; }
          100% { transform: translateY(0px); opacity: 0.08; }
        }

        @keyframes floatSymbol2 {
          0% { transform: translateY(0px); opacity: 0.06; }
          50% { transform: translateY(6px); opacity: 0.12; }
          100% { transform: translateY(0px); opacity: 0.06; }
        }

        @keyframes floatSymbol3 {
          0% { transform: translateX(0px); opacity: 0.07; }
          50% { transform: translateX(6px); opacity: 0.14; }
          100% { transform: translateX(0px); opacity: 0.07; }
        }
      `}</style>

      <Navbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_32%),linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.88))]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_18%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -left-20 top-[-3rem] h-72 w-72 rounded-full bg-green-500/12 blur-[110px]" />
          <div className="absolute right-[-5rem] top-[2rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]" />
        </div>

        <section className="relative z-10 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
            <div className="mx-auto max-w-5xl rounded-[2rem] bg-black/55 px-6 py-10 text-center backdrop-blur-[2px] md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.30em] text-green-400">
                ― Current Location ―
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                Calculators, Charts & Conversions
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                A structured reference hub for everyday-use math, quick utilities,
                common charts, and practical conversions. Designed to grow into a larger
                connected industrial knowledge system over time.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <QuickNavCard href="#calculators" title="Calculators" />
                <QuickNavCard href="#charts" title="Charts" />
                <QuickNavCard href="#conversions" title="Conversions" />
                <QuickNavCard href="#related-topics" title="Related Topics" />
                <QuickNavCard href="#community" title="Discussion" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            id="calculators"
            eyebrow="― Calculators ―"
            title="Tools for practical everyday use"
            description="This section holds the most common everyday-use calculators that professionals reach for agian and again."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/shop-math-calculator')
              }
              title="Shop Math Calculator"
              subtitle="Core Utility"
              description="A future slot for quick arithmetic, percentage, ratio, and common work math used throughout fabrication, production, and operations."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/material-weight-calculator')
              }
              title="Material Weight Calculator"
              subtitle="Reference Utility"
              description="Estimate material weight from dimensions, type, and thickness with full calculation visibility and step-by-step breakdown."
            />

            <LibraryToolCard
              title="Area & Volume Calculator"
              subtitle="Geometry Utility"
              description="A clean slot for rectangle, circle, triangle, and volume calculations that commonly support layout, estimating, and material planning."
            />
            <LibraryToolCard
              title="Production Rate Calculator"
              subtitle="Workflow Utility"
              description="A future utility for quick cycle-rate estimates, output pacing, and time-based production calculations."
            />
            <LibraryToolCard
              title="Pipe / Tank Fill Calculator"
              subtitle="Fluid Utility"
              description="A slot for practical fill, volume, and flow-related calculations that can support maintenance, process, and industrial use cases."
            />
            <LibraryToolCard
              title="Custom Trade Calculator"
              subtitle="Expandable Utility"
              description="Reserved for trade-specific tools later, such as weld math, layout helpers, fabrication formulas, or other focused references."
            />
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <SectionHeader
              id="charts"
              eyebrow="― Charts ―"
              title="Curated quick-reference charts for common work"
              description="This section is intended for the most practical high-frequency charts and lookups people use day to day. The goal is clean access to the kinds of references professionals repeatedly need without digging across multiple sites."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <ReferenceCard
                title="Decimal / Fraction Chart"
                category="Measurement"
                description="A foundational shop reference for quick conversion between fractions, decimals, and common sizes."
              />
              <ReferenceCard
                title="Tap & Drill Charts"
                category="Machining / Shop Use"
                description="A future slot for thread, tap, and drill reference charts used in daily fabrication and manufacturing work."
              />
              <ReferenceCard
                title="Steel Gauge / Thickness Charts"
                category="Material Reference"
                description="Practical thickness and gauge references that can support estimating, layout, and quick material checks."
              />
              <ReferenceCard
                title="Common Material Reference Charts"
                category="Reference"
                description="A section for frequently used shop-floor reference tables, dimensions, and material-related charts."
              />
              <ReferenceCard
                title="Fastener / Hardware Reference"
                category="Assembly"
                description="A place for curated charts related to standard hardware, sizes, and quick-use dimensional lookup."
              />
              <ReferenceCard
                title="Field Reference Charts"
                category="Expandable"
                description="Reserved for high-use industry reference charts that deserve a permanent place in the library over time."
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            id="conversions"
            eyebrow="― Conversions ―"
            title="Fast conversion utilities and reference paths"
            description="This section is designed for the conversion work people use constantly: measurements, weight, volume, temperature, and other practical unit shifts that should be quick and friction-free."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ReferenceCard
              title="Length Conversions"
              category="Inches / MM / Feet / Meters"
              description="A clean place for practical everyday dimensional conversion references and future quick tools."
              action="Conversion Slot"
            />
            <ReferenceCard
              title="Weight Conversions"
              category="Pounds / KG"
              description="A utility section for fast mass and weight conversions used in estimating, planning, and material handling."
              action="Conversion Slot"
            />
            <ReferenceCard
              title="Area Conversions"
              category="Square Units"
              description="Useful for layout, estimating, and documentation where different area units need to be compared quickly."
              action="Conversion Slot"
            />
            <ReferenceCard
              title="Volume Conversions"
              category="Cubic Units"
              description="A future conversion area for volume-related utilities and liquid / container estimation use cases."
              action="Conversion Slot"
            />
            <ReferenceCard
              title="Temperature Conversions"
              category="F / C"
              description="A common-use reference slot for practical temperature conversions and process-related lookup."
              action="Conversion Slot"
            />
            <ReferenceCard
              title="Pressure / Specialty Conversions"
              category="Expandable"
              description="Reserved for additional conversion tools later as the library expands into more industrial categories."
              action="Future Utility"
            />
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <SectionHeader
              id="related-topics"
              eyebrow="― Linked Topics ―"
              title="Connected knowledge paths for future expansion"
              description="This area is where the library starts behaving more like a connected knowledge system. Over time, these links can connect calculators, charts, fabrication references, manufacturing topics, and industry-specific knowledge the same way linked notes work inside a structured knowledge base."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <RelatedTopicCard
                title="Fabrication"
                description="Future page for practical fabrication references, shop math, field notes, weld-related references, and connected utility tools."
              />
              <RelatedTopicCard
                title="Manufacturing"
                description="Future page for process references, workflow support, production-focused knowledge, and manufacturing utilities."
              />
              <RelatedTopicCard
                title="Industrial Reference Library"
                description="A larger long-term connected system of linked pages, common-use references, and practical professional knowledge."
                status="Growing"
              />
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <CommunityPanel />
        </div>
      </main>
    </div>
  )
}