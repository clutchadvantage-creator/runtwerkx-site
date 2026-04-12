import Navbar from '../../components/Navbar'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PAGE_BACKGROUND_IMAGE_SRC = '/images/math3.png'
const PAGE_URL =
  'https://runtwerkx.com/knowledge-library/calculators-charts-conversions'

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
                ? 'border border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_14px_rgba(34,197,94,0.18)]'
                : 'border border-white/10 bg-white/[0.04] text-white/45'
            }`}
          >
            <span className={live ? 'text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]' : ''}>{status}</span>
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-white">{title}</h3>

        <p className="mt-4 text-sm leading-7 text-white/68">{description}</p>

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

      <h3 className="mt-3 text-xl font-bold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>

      <div className="mt-5 inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {action}
      </div>
    </div>
  )
}

function RelatedTopicCard({ title, description, status = 'Planned', to }) {
  const live = status === 'Live'
  const cardClassName = `rounded-[1.5rem] border border-white/10 bg-black/45 p-5 transition duration-300 ${
    to
      ? 'cursor-pointer hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]'
      : 'hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.10)]'
  }`

  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>

        <div
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
            live
              ? 'border border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_14px_rgba(34,197,94,0.18)]'
              : 'border border-white/10 bg-white/[0.03] text-white/45'
          }`}
        >
          <span className={live ? 'text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.85)]' : ''}>{status}</span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cardClassName}>
        {content}
      </Link>
    )
  }

  return <div className={cardClassName}>{content}</div>
}

export default function CalculatorsChartsConversionsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>
          Calculators, Charts & Conversions | Industrial Reference Tools |
          RuntWerkx
        </title>
        <meta
          name="description"
          content="Explore RuntWerkx calculators, charts, and conversions for everyday shop math, material weight, production rate, pipe and tank fill, custom trade tools, decimal and fraction references, tap drill charts, and practical industrial utilities."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta
          property="og:title"
          content="Calculators, Charts & Conversions | Industrial Reference Tools | RuntWerkx"
        />
        <meta
          property="og:description"
          content="Industrial calculators, reference charts, and conversion tools built for practical day-to-day use."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Calculators, Charts & Conversions | Industrial Reference Tools | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Industrial calculators, reference charts, and conversion tools built for practical day-to-day use."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'RuntWerkx Calculators, Charts & Conversions',
            url: PAGE_URL,
            description:
              'A structured reference hub for industrial calculators, charts, and conversions including shop math, material weight, production rate, pipe/tank fill, custom trade tools, decimal/fraction references, and tap drill charts.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'RuntWerkx',
              url: 'https://runtwerkx.com',
            },
          })}
        </script>
      </Helmet>

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
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: PAGE_BACKGROUND_IMAGE_SRC ? `url(${PAGE_BACKGROUND_IMAGE_SRC})` : 'none' }}
          />

          <div className="absolute inset-0 bg-black/28" />
        </div>

        <section className="relative z-10 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
            <div className="mb-8">
              <Link
                to="/knowledge-library"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                ← Back to Knowledge Library
              </Link>
            </div>

            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/55 px-6 py-10 text-center backdrop-blur-[2px] md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.30em] text-green-400">
                ― Current Location ―
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                Calculators, Charts & Conversions
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                Practical calculators, fast charts, and everyday conversions built for shop, field, and industrial work.
              </p>
            </div>

            <div className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-center gap-3">
              <QuickNavCard href="#calculators" title="Calculators" />
              <QuickNavCard href="#charts" title="Charts" />
              <QuickNavCard href="#conversions" title="Conversions" />
              <QuickNavCard href="#related-topics" title="Related Topics" />
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <SectionHeader
            id="calculators"
            eyebrow="― Calculators ―"
            title="Tools for practical everyday use"
            description="This section holds the most common calculators that professionals reach for agian and again."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/shop-math-calculator')
              }
              title="Shop Math Calculator"
              subtitle="Core Utility"
              description="A slot for quick arithmetic, percentage, ratio, and common work math used throughout fabrication, production, and operations."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/material-weight-calculator')
              }
              title="Material Weight Calculator"
              subtitle="Reference Utility"
              description="Estimate material weight from dimensions, type, and thickness with full calculation visibility and step-by-step breakdown."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/area-volume-calculator')
              }
              title="Area & Volume Calculator"
              subtitle="Geometry Utility"
              description="Calculate area, perimeter, circumference, and volume with visible formulas and worked solution output for layout, estimating, and material planning."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/production-rate-calculator')
              }
              title="Production Rate Calculator"
              subtitle="Workflow Utility"
              description="Calculate parts per hour, cycle time, shift output, required run time, downtime impact, and real versus target production performance."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/pipe-tank-fill-calculator')
              }
              title="Pipe / Tank Fill Calculator"
              subtitle="Fluid Utility"
              description="Calculate pipe volume, tank volume, fill time, and partial fill levels with full worked output, conversions, and visible formulas."
            />

            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/custom-trade-calculator')
              }
              title="Custom Trade Calculator"
              subtitle="Trade Utility"
              description="Solve trade-focused utility math like weld volume, paint coverage, bolt spacing, plate layout yield, and other fabrication support calculations."
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
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/decimal-fraction-chart')
                }
                title="Decimal / Fraction Chart"
                subtitle="Measurement Reference"
                description="A foundational shop reference for quick conversion between fractions, decimals, and millimeter equivalents with fast reverse lookup."
              />
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/tap-drill-chart')
                }
                title="Tap & Drill Chart"
                subtitle="Machining / Shop Use"
                description="Quick UNC and UNF tap drill lookup with thread size, TPI, major diameter, drill size, and decimal drill equivalents."
              />
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart')
                }
                title="Steel Gauge / Thickness Charts"
                subtitle="Material Reference"
                description="Practical thickness and gauge references that can support estimating, layout, and quick material checks."
              />
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/common-material-reference-charts')
                }
                title="Common Material Reference Charts"
                subtitle="Reference"
                description="A section for frequently used shop-floor reference tables, dimensions, and material-related charts."
              />
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/fastener-hardware-reference')
                }
                title="Fastener / Hardware Reference"
                subtitle="Assembly"
                description="A place for curated charts related to standard hardware, sizes, and quick-use dimensional lookup."
              />
              <LiveMathToolCard
                onClick={() =>
                  navigate('/knowledge-library/calculators-charts-conversions/field-reference-charts')
                }
                title="Field Reference Charts"
                subtitle="Daily Field Use"
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
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/length-conversions')
              }
              title="Length Conversions"
              subtitle="Inches / MM / Feet / Meters"
              description="Notebook-style reference for practical dimensional conversion work across inches, millimeters, feet, meters, and familiar field benchmarks."
            />
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/weight-conversions')
              }
              title="Weight Conversions"
              subtitle="Pounds / KG"
              description="Practical conversion reference for pounds, kilograms, ounces, grams, and common handling-scale tonnage checks."
            />
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/area-conversions')
              }
              title="Area Conversions"
              subtitle="Square Units"
              description="Square-unit reference for layout, estimating, sheet coverage, and quick comparison between imperial and metric area values."
            />
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/volume-conversions')
              }
              title="Volume Conversions"
              subtitle="Cubic Units"
              description="Live conversion notebook for gallons, liters, cubic units, and common container benchmarks used in fill and planning work."
            />
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/temperature-conversions')
              }
              title="Temperature Conversions"
              subtitle="F / C"
              description="Quick Fahrenheit and Celsius reference with practical weather, process, and benchmark temperature checks."
            />
            <LiveMathToolCard
              onClick={() =>
                navigate('/knowledge-library/calculators-charts-conversions/pressure-specialty-conversions')
              }
              title="Pressure / Specialty Conversions"
              subtitle="PSI / Bar / kPa / MPa"
              description="Pressure-unit reference with specialty anchors for process, equipment, and industrial unit-bridge work."
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
                status="Live"
                to="/fabrication"
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

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-green-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-green-400">
                ― What This Section Covers ―
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                A growing library of industrial calculators and references
              </h2>
              <p className="mt-5 text-base leading-8 text-white/68">
                This calculators, charts, and conversions section is built to
                support everyday work. It already includes a shop math
                calculator, a material weight calculator, an area & volume
                calculator, a production rate calculator, a pipe / tank fill
                calculator, a custom trade calculator, a decimal / fraction
                chart, and a tap & drill chart, and it is designed to expand
                into a broader system of industrial reference tools, conversion
                utilities, fabrication support pages, and connected knowledge
                resources over time.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-green-500/15 bg-black/40 p-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.32em] text-green-400">
                ― Related Live Tools ―
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Continue into the current calculator system
              </h3>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/knowledge-library/calculators-charts-conversions/shop-math-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Shop Math Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Material Weight Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/area-volume-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Area & Volume Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/production-rate-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Production Rate Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/pipe-tank-fill-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Pipe / Tank Fill Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/custom-trade-calculator"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Custom Trade Calculator
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/decimal-fraction-chart"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Decimal / Fraction Chart
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Steel Gauge / Thickness Chart
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/common-material-reference-charts"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Common Material Reference Charts
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/fastener-hardware-reference"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Fastener / Hardware Reference
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/field-reference-charts"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Field Reference Charts
              </Link>

              <Link
                to="/knowledge-library/calculators-charts-conversions/tap-drill-chart"
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-green-400 hover:text-white"
              >
                Tap & Drill Chart
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}