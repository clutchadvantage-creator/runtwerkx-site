import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/decimal-fraction-chart";

const CHART_ROWS = [
  { fraction: "1/64", decimal: "0.015625", mm: "0.396875" },
  { fraction: "1/32", decimal: "0.03125", mm: "0.79375" },
  { fraction: "3/64", decimal: "0.046875", mm: "1.190625" },
  { fraction: "1/16", decimal: "0.0625", mm: "1.5875" },
  { fraction: "5/64", decimal: "0.078125", mm: "1.984375" },
  { fraction: "3/32", decimal: "0.09375", mm: "2.38125" },
  { fraction: "7/64", decimal: "0.109375", mm: "2.778125" },
  { fraction: "1/8", decimal: "0.125", mm: "3.175" },
  { fraction: "9/64", decimal: "0.140625", mm: "3.571875" },
  { fraction: "5/32", decimal: "0.15625", mm: "3.96875" },
  { fraction: "11/64", decimal: "0.171875", mm: "4.365625" },
  { fraction: "3/16", decimal: "0.1875", mm: "4.7625" },
  { fraction: "13/64", decimal: "0.203125", mm: "5.159375" },
  { fraction: "7/32", decimal: "0.21875", mm: "5.55625" },
  { fraction: "15/64", decimal: "0.234375", mm: "5.953125" },
  { fraction: "1/4", decimal: "0.25", mm: "6.35" },
  { fraction: "17/64", decimal: "0.265625", mm: "6.746875" },
  { fraction: "9/32", decimal: "0.28125", mm: "7.14375" },
  { fraction: "19/64", decimal: "0.296875", mm: "7.540625" },
  { fraction: "5/16", decimal: "0.3125", mm: "7.9375" },
  { fraction: "21/64", decimal: "0.328125", mm: "8.334375" },
  { fraction: "11/32", decimal: "0.34375", mm: "8.73125" },
  { fraction: "23/64", decimal: "0.359375", mm: "9.128125" },
  { fraction: "3/8", decimal: "0.375", mm: "9.525" },
  { fraction: "25/64", decimal: "0.390625", mm: "9.921875" },
  { fraction: "13/32", decimal: "0.40625", mm: "10.31875" },
  { fraction: "27/64", decimal: "0.421875", mm: "10.715625" },
  { fraction: "7/16", decimal: "0.4375", mm: "11.1125" },
  { fraction: "29/64", decimal: "0.453125", mm: "11.509375" },
  { fraction: "15/32", decimal: "0.46875", mm: "11.90625" },
  { fraction: "31/64", decimal: "0.484375", mm: "12.303125" },
  { fraction: "1/2", decimal: "0.5", mm: "12.7" },
  { fraction: "33/64", decimal: "0.515625", mm: "13.096875" },
  { fraction: "17/32", decimal: "0.53125", mm: "13.49375" },
  { fraction: "35/64", decimal: "0.546875", mm: "13.890625" },
  { fraction: "9/16", decimal: "0.5625", mm: "14.2875" },
  { fraction: "37/64", decimal: "0.578125", mm: "14.684375" },
  { fraction: "19/32", decimal: "0.59375", mm: "15.08125" },
  { fraction: "39/64", decimal: "0.609375", mm: "15.478125" },
  { fraction: "5/8", decimal: "0.625", mm: "15.875" },
  { fraction: "41/64", decimal: "0.640625", mm: "16.271875" },
  { fraction: "21/32", decimal: "0.65625", mm: "16.66875" },
  { fraction: "43/64", decimal: "0.671875", mm: "17.065625" },
  { fraction: "11/16", decimal: "0.6875", mm: "17.4625" },
  { fraction: "45/64", decimal: "0.703125", mm: "17.859375" },
  { fraction: "23/32", decimal: "0.71875", mm: "18.25625" },
  { fraction: "47/64", decimal: "0.734375", mm: "18.653125" },
  { fraction: "3/4", decimal: "0.75", mm: "19.05" },
  { fraction: "49/64", decimal: "0.765625", mm: "19.446875" },
  { fraction: "25/32", decimal: "0.78125", mm: "19.84375" },
  { fraction: "51/64", decimal: "0.796875", mm: "20.240625" },
  { fraction: "13/16", decimal: "0.8125", mm: "20.6375" },
  { fraction: "53/64", decimal: "0.828125", mm: "21.034375" },
  { fraction: "27/32", decimal: "0.84375", mm: "21.43125" },
  { fraction: "55/64", decimal: "0.859375", mm: "21.828125" },
  { fraction: "7/8", decimal: "0.875", mm: "22.225" },
  { fraction: "57/64", decimal: "0.890625", mm: "22.621875" },
  { fraction: "29/32", decimal: "0.90625", mm: "23.01875" },
  { fraction: "59/64", decimal: "0.921875", mm: "23.415625" },
  { fraction: "15/16", decimal: "0.9375", mm: "23.8125" },
  { fraction: "61/64", decimal: "0.953125", mm: "24.209375" },
  { fraction: "31/32", decimal: "0.96875", mm: "24.60625" },
  { fraction: "63/64", decimal: "0.984375", mm: "25.003125" },
  { fraction: "1", decimal: "1.0", mm: "25.4" },
];

const QUICK_SIZES = [
  { label: "1/64", value: "0.015625" },
  { label: "1/32", value: "0.03125" },
  { label: "1/16", value: "0.0625" },
  { label: "1/8", value: "0.125" },
  { label: "1/4", value: "0.25" },
  { label: "3/8", value: "0.375" },
  { label: "1/2", value: "0.5" },
  { label: "3/4", value: "0.75" },
  { label: "1", value: "1.0" },
];

const REVERSE_LOOKUP = [
  "0.015625 = 1/64",
  "0.03125 = 1/32",
  "0.0625 = 1/16",
  "0.125 = 1/8",
  "0.25 = 1/4",
  "0.375 = 3/8",
  "0.5 = 1/2",
  "0.625 = 5/8",
  "0.75 = 3/4",
  "0.875 = 7/8",
];

function GraphBackdrop() {
  const lines = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        top: `${8 + i * 6.8}%`,
        delay: `${(i % 6) * 0.4}s`,
      })),
    []
  );

  const verticals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${6 + i * 9.2}%`,
        delay: `${(i % 5) * 0.5}s`,
      })),
    []
  );

  const points = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${8 + i * 4.8}%`,
        top: `${22 + ((i * 9) % 32)}%`,
        delay: `${(i % 8) * 0.3}s`,
      })),
    []
  );

  const labels = useMemo(
    () =>
      ["1/64", "1/32", "1/16", "1/8", "1/4", "1/2", "3/4", "1.0"].map(
        (value, i) => ({
          id: i,
          value,
          left: `${10 + i * 10.5}%`,
          top: `${14 + (i % 2) * 8}%`,
          delay: `${i * 0.35}s`,
        })
      ),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_42%),linear-gradient(to_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(16,185,129,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.14)_1px,transparent_1px)] [background-size:42px_42px]" />

      {lines.map((line) => (
        <span
          key={`h-${line.id}`}
          className="absolute left-0 right-0 h-px bg-emerald-400/20 animate-pulse"
          style={{ top: line.top, animationDelay: line.delay }}
        />
      ))}

      {verticals.map((line) => (
        <span
          key={`v-${line.id}`}
          className="absolute top-0 bottom-0 w-px bg-emerald-400/15 animate-pulse"
          style={{ left: line.left, animationDelay: line.delay }}
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <path
          d="M50 520 C180 480, 240 410, 360 430 S580 520, 710 420 S960 250, 1150 320"
          fill="none"
          stroke="rgba(52,211,153,0.35)"
          strokeWidth="2"
        />
        <path
          d="M40 600 C140 560, 250 610, 360 560 S600 470, 760 520 S980 620, 1160 520"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      </svg>

      {points.map((point) => (
        <span
          key={`p-${point.id}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400/55 shadow-[0_0_14px_rgba(16,185,129,0.45)] animate-pulse"
          style={{
            left: point.left,
            top: point.top,
            animationDelay: point.delay,
          }}
        />
      ))}

      {labels.map((label) => (
        <span
          key={`l-${label.id}`}
          className="absolute text-[10px] uppercase tracking-[0.24em] text-emerald-300/35 animate-[fadeFloat_5s_ease-in-out_infinite]"
          style={{
            left: label.left,
            top: label.top,
            animationDelay: label.delay,
          }}
        >
          {label.value}
        </span>
      ))}
    </div>
  )
}

function QuickRefPill({ fraction, decimal }) {
  return (
    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-4 py-2 text-sm text-zinc-200">
      <span className="font-semibold text-white">{fraction}</span>
      <span className="mx-2 text-zinc-500">=</span>
      <span>{decimal}</span>
    </div>
  )
}

function FooterStatusPanel({ searchTerm }) {
  return (
    <section className="mt-24">
      <div className="rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-6 backdrop-blur-sm">
        <div className="mb-4 border-b border-zinc-800 pb-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
              ― Reference Footer ―
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Chart Environment Status
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-zinc-300">Reference Sheet Online</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Reference Type
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              Fraction / Decimal
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Measurement Basis
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              Inch Fractions
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Reverse Lookup
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              Included
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Search Filter
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {searchTerm ? `Active: ${searchTerm}` : "No filter active"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function DecimalFractionChart() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeFloat {
        0% { opacity: 0; transform: translateY(10px); }
        25% { opacity: .55; }
        70% { opacity: .18; }
        100% { opacity: 0; transform: translateY(-10px); }
      }
      @keyframes notebookDrift {
        0% { opacity: .04; transform: translateX(-8px); }
        50% { opacity: .08; transform: translateX(8px); }
        100% { opacity: .04; transform: translateX(-8px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return CHART_ROWS;

    return CHART_ROWS.filter((row) =>
      row.fraction.toLowerCase().includes(term) ||
      row.decimal.toLowerCase().includes(term) ||
      row.mm.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Decimal / Fraction Chart | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Decimal / Fraction Chart for quick fraction to decimal and millimeter reference with a clean notebook-style sheet and fast reverse lookup."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Decimal / Fraction Chart | RuntWerkx" />
        <meta
          property="og:description"
          content="Quick fraction, decimal, and millimeter reference chart built for practical shop and layout use."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Decimal / Fraction Chart | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Quick fraction, decimal, and millimeter reference chart built for practical shop and layout use."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            name: "RuntWerkx Decimal / Fraction Chart",
            url: PAGE_URL,
            description:
              "Decimal and fraction reference chart with reverse lookup and millimeter conversions for practical industrial use.",
            publisher: {
              "@type": "Organization",
              name: "RuntWerkx",
              url: "https://runtwerkx.com",
            },
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-10 lg:px-14">
        <GraphBackdrop />

        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="mb-8">
            <Link
              to="/knowledge-library/calculators-charts-conversions"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
            >
              ← Back to Calculators, Charts & Conversions
            </Link>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-emerald-400">
              ― Current Location ―
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
              Decimal / Fraction Chart
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Quick fraction, decimal, and millimeter reference built like a
              clean shop notebook sheet with fast lookup both directions.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Built for layout work, measuring, fabrication, estimating, saw
              setups, and any time you need to move quickly between fractions,
              decimals, and metric equivalents.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {QUICK_SIZES.map((item) => (
                <QuickRefPill
                  key={item.label}
                  fraction={item.label}
                  decimal={item.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Reference Sheet ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Fraction / Decimal / MM Lookup
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  A notebook-style reference sheet with direct conversion values
                  and quick visual readability.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-6 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
                          RuntWerkx Reference
                        </p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">
                          Decimal / Fraction Chart
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Common inch fractions converted to decimals and
                          millimeters for quick field, fab, and shop reference.
                        </p>
                      </div>

                      <div className="w-full md:w-[260px]">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                          Search Chart
                        </label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Try 1/8, 0.25, or 6.35"
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                      <div className="grid grid-cols-3 border-b border-black/10 bg-emerald-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black/70">
                        <div>Fraction</div>
                        <div>Decimal</div>
                        <div>Millimeters</div>
                      </div>

                      <div className="max-h-[900px] overflow-auto">
                        {filteredRows.map((row, index) => (
                          <div
                            key={`${row.fraction}-${row.decimal}`}
                            className={`grid grid-cols-3 px-5 py-3 text-base ${
                              index % 2 === 0 ? "bg-black/[0.02]" : "bg-transparent"
                            }`}
                          >
                            <div className="font-semibold">{row.fraction}</div>
                            <div>{row.decimal}</div>
                            <div>{row.mm}</div>
                          </div>
                        ))}

                        {filteredRows.length === 0 && (
                          <div className="px-5 py-8 text-center text-black/60">
                            No chart rows matched that search.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                          Decimal → Fraction Reverse Lookup
                        </p>
                        <div className="mt-4 space-y-2">
                          {REVERSE_LOOKUP.map((item) => (
                            <p
                              key={item}
                              className="font-mono text-base leading-7 text-black/78"
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                          Common Shop-Use Notes
                        </p>
                        <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                          <p>
                            Smaller fractions have larger denominators. For
                            example, <span className="font-semibold">1/64</span>{" "}
                            is smaller than <span className="font-semibold">1/32</span>.
                          </p>
                          <p>
                            Decimal format is useful for calculators, CNC input,
                            software fields, and quick arithmetic.
                          </p>
                          <p>
                            Metric equivalents are included for quick comparison
                            when shifting between inch-based and mm-based work.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                        Fast Read Strip
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {[
                          "1/64 = 0.015625",
                          "1/32 = 0.03125",
                          "1/16 = 0.0625",
                          "1/8 = 0.125",
                          "1/4 = 0.25",
                          "1/2 = 0.5",
                        ].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-6xl">
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Quick Notes ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Reference Companion
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Fast grab notes for everyday use around the chart.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Most Used Conversions
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>1/16 = 0.0625</p>
                    <p>1/8 = 0.125</p>
                    <p>3/16 = 0.1875</p>
                    <p>1/4 = 0.25</p>
                    <p>3/8 = 0.375</p>
                    <p>1/2 = 0.5</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Why It Matters
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Helpful for saw setup and hand layout.</p>
                    <p>Useful when software wants decimals instead of fractions.</p>
                    <p>Useful when swapping between inch-based and metric work.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Reading Tip
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>
                      When the denominator doubles, the fraction gets finer.
                    </p>
                    <p>
                      Example: 1/8 is larger than 1/16, and 1/16 is larger than 1/32.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                ― What This Chart Covers ―
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Built for practical measuring and layout reference
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This decimal and fraction chart is built for quick reference
                during everyday work. Use it to convert common inch fractions to
                decimal equivalents and millimeters, scan back from decimal to
                fraction, and keep a fast reference page available during
                layout, fabrication, setup, and general measuring work.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-500/15 bg-black/40 p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">
                  ― Related Tools & References ―
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Continue through the RuntWerkx reference system
                </h3>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/knowledge-library/calculators-charts-conversions"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Calculators, Charts & Conversions
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/shop-math-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Shop Math Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Material Weight Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/area-volume-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Area & Volume Calculator
                </Link>
              </div>
            </div>
          </section>

          <FooterStatusPanel searchTerm={searchTerm} />
        </div>
      </section>
    </div>
  );
}