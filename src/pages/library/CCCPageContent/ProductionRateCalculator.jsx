import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/production-rate-calculator"

const RANDOM_TECH_TEXT = [
  "RWX",
  "FLOW",
  "RATE",
  "OPS",
  "SHIFT",
  "SYNC",
  "GRID",
  "PWR",
  "LINE",
  "DATA",
  "OEE",
  "RUN",
  "TIME",
  "LOAD",
]

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return "-"
  return Number(value.toFixed(decimals)).toLocaleString()
}

function buildPerformance(adjustedRate, targetRate) {
  if (!(targetRate > 0)) return null

  const efficiencyPercent = (adjustedRate / targetRate) * 100
  const delta = adjustedRate - targetRate

  return {
    targetRate,
    actualRate: adjustedRate,
    efficiencyPercent,
    delta,
  }
}

function CircuitBackdrop() {
  const lines = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 6.1) % 94}%`,
        top: `${8 + ((i * 5.9) % 68)}%`,
        width: `${18 + (i % 5) * 8}%`,
        rotate: i % 2 === 0 ? "0deg" : "90deg",
        delay: `${(i % 6) * 0.55}s`,
      })),
    []
  )

  const dots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 7.3) % 88)}%`,
        top: `${10 + ((i * 9.7) % 65)}%`,
        delay: `${(i % 8) * 0.5}s`,
      })),
    []
  )

  const text = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        value: RANDOM_TECH_TEXT[i % RANDOM_TECH_TEXT.length],
        left: `${4 + ((i * 4.8) % 92)}%`,
        top: `${8 + ((i * 7.5) % 68)}%`,
        delay: `${(i % 10) * 0.45}s`,
      })),
    []
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_42%),linear-gradient(to_bottom,rgba(16,185,129,0.07),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

      {lines.map((line) => (
        <span
          key={line.id}
          className="absolute block h-px animate-pulse bg-emerald-400/35"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transform: `rotate(${line.rotate})`,
            animationDelay: line.delay,
          }}
        />
      ))}

      {dots.map((dot) => (
        <span
          key={dot.id}
          className="absolute h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.55)]"
          style={{
            left: dot.left,
            top: dot.top,
            animationDelay: dot.delay,
          }}
        />
      ))}

      {text.map((item) => (
        <span
          key={item.id}
          className="absolute animate-[fadeFloat_5s_ease-in-out_infinite] text-[10px] uppercase tracking-[0.28em] text-emerald-300/35"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
          }}
        >
          {item.value}
        </span>
      ))}
    </div>
  )
}

function TogglePill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-4 rounded-full border px-4 py-2.5 text-sm transition ${
        checked
          ? "border-emerald-400 bg-emerald-500/12 text-white"
          : "border-zinc-700 bg-black/40 text-zinc-300"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-emerald-500/70" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  )
}

function TooltipBubble({ text }) {
  return (
    <span className="group relative inline-flex">
      <span className="ml-2 inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-emerald-500/40 text-[11px] text-emerald-300">
        ?
      </span>
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-30 w-64 -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-zinc-950/95 p-3 text-sm leading-6 text-zinc-200 opacity-0 shadow-[0_0_18px_rgba(16,185,129,0.14)] transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

function ProductionSummaryCards({
  shiftLength,
  downtimePercent,
  effectiveShiftHours,
  projectedShiftOutput,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
        <p className="text-sm text-zinc-400">Selected Shift</p>
        <p className="mt-2 text-2xl font-semibold text-white">{shiftLength} hr</p>
      </div>

      <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
        <p className="text-sm text-zinc-400">Downtime Loss</p>
        <p className="mt-2 text-2xl font-semibold text-white">{downtimePercent}%</p>
      </div>

      <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
        <p className="text-sm text-zinc-400">Effective Shift</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {formatNumber(effectiveShiftHours)} hr
        </p>
      </div>

      <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
        <p className="text-sm text-zinc-400">Projected Output</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {typeof projectedShiftOutput === "number"
            ? `${formatNumber(projectedShiftOutput)} parts`
            : "-"}
        </p>
      </div>
    </div>
  )
}

function FooterStatusPanel({
  mode,
  showFormula,
  showSteps,
  showTooltips,
  decimals,
  shiftLength,
  downtimePercent,
  result,
}) {
  return (
    <section className="mt-28">
      <div className="rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-6 backdrop-blur-sm">
        <div className="mb-4 border-b border-zinc-800 pb-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
              ― Workbench Footer ―
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Calculation Environment Status
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-zinc-300">Workbench Online</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Active Mode
            </p>
            <p className="mt-3 text-xl font-semibold capitalize text-white">
              {mode}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Display Controls
            </p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              <p>Formula: {showFormula ? "On" : "Off"}</p>
              <p>Steps: {showSteps ? "On" : "Off"}</p>
              <p>Tooltips: {showTooltips ? "On" : "Off"}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Shift Profile
            </p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              <p>{shiftLength} hr shift</p>
              <p>{downtimePercent}% downtime</p>
              <p>{decimals} decimals</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Last Output
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {result?.summary || "No result calculated yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProductionRateCalculator() {
  const [mode, setMode] = useState("rate")
  const [showSettings, setShowSettings] = useState(false)
  const [showTooltips, setShowTooltips] = useState(true)
  const [showFormula, setShowFormula] = useState(true)
  const [showSteps, setShowSteps] = useState(true)
  const [decimals, setDecimals] = useState(2)

  const [parts, setParts] = useState("")
  const [timeHours, setTimeHours] = useState("")
  const [rate, setRate] = useState("")
  const [targetParts, setTargetParts] = useState("")

  const [shiftLength, setShiftLength] = useState(8)
  const [downtimePercent, setDowntimePercent] = useState(0)
  const [targetRate, setTargetRate] = useState("")

  const [result, setResult] = useState(null)

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes fadeFloat {
        0% { opacity: 0; transform: translateY(10px); }
        25% { opacity: .55; }
        70% { opacity: .2; }
        100% { opacity: 0; transform: translateY(-10px); }
      }
      @keyframes chalkSweep {
        0% { opacity: 0; transform: translateX(-12px); }
        20% { opacity: .08; }
        60% { opacity: .03; }
        100% { opacity: 0; transform: translateX(12px); }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const downtimeFactor = 1 - downtimePercent / 100
  const effectiveShiftHours = shiftLength * downtimeFactor

  const calculate = () => {
    const p = Number(parts)
    const t = Number(timeHours)
    const r = Number(rate)
    const tp = Number(targetParts)
    const tr = Number(targetRate)

    if (mode === "rate") {
      if (!(p > 0) || !(t > 0)) {
        setResult({
          error: "Enter total parts and total time greater than zero.",
        })
        return
      }

      const rawRate = p / t
      const adjustedRate = rawRate * downtimeFactor
      const projectedShiftOutput = adjustedRate * effectiveShiftHours
      const performance = buildPerformance(adjustedRate, tr)

      const visualWork = `Raw rate = ${p} ÷ ${t}
= ${formatNumber(rawRate, decimals)} parts/hr

Downtime factor = 1 - (${downtimePercent} ÷ 100)
= ${formatNumber(downtimeFactor, 4)}

Adjusted rate = ${formatNumber(rawRate, decimals)} × ${formatNumber(
        downtimeFactor,
        4
      )}
= ${formatNumber(adjustedRate, decimals)} parts/hr

Effective shift hours = ${shiftLength} × ${formatNumber(downtimeFactor, 4)}
= ${formatNumber(effectiveShiftHours, decimals)} hr

Projected shift output = ${formatNumber(
        adjustedRate,
        decimals
      )} × ${formatNumber(effectiveShiftHours, decimals)}
= ${formatNumber(projectedShiftOutput, decimals)} parts`

      setResult({
        title: "Parts Per Hour",
        value: `${formatNumber(adjustedRate, decimals)} parts/hr`,
        summary: `Adjusted production rate = ${formatNumber(
          adjustedRate,
          decimals
        )} parts/hr`,
        formula:
          "Raw Rate = Parts ÷ Time, Adjusted Rate = Raw Rate × (1 - Downtime %), Shift Output = Adjusted Rate × Effective Shift Hours",
        rawRate,
        adjustedRate,
        projectedShiftOutput,
        effectiveShiftHours,
        performance,
        visualWork,
        copyText: visualWork,
        steps: [
          `Raw rate = ${p} ÷ ${t}`,
          `Raw rate = ${formatNumber(rawRate, decimals)} parts/hr`,
          `Downtime factor = 1 - (${downtimePercent} ÷ 100)`,
          `Downtime factor = ${formatNumber(downtimeFactor, 4)}`,
          `Adjusted rate = ${formatNumber(rawRate, decimals)} × ${formatNumber(
            downtimeFactor,
            4
          )}`,
          `Adjusted rate = ${formatNumber(adjustedRate, decimals)} parts/hr`,
          `Effective shift hours = ${shiftLength} × ${formatNumber(
            downtimeFactor,
            4
          )}`,
          `Effective shift hours = ${formatNumber(
            effectiveShiftHours,
            decimals
          )} hr`,
          `Projected shift output = ${formatNumber(
            adjustedRate,
            decimals
          )} × ${formatNumber(effectiveShiftHours, decimals)}`,
          `Projected shift output = ${formatNumber(
            projectedShiftOutput,
            decimals
          )} parts`,
        ],
      })
      return
    }

    if (mode === "cycle") {
      if (!(p > 0) || !(t > 0)) {
        setResult({
          error: "Enter total parts and total time greater than zero.",
        })
        return
      }

      const cycleHoursPerPart = t / p
      const cycleMinutesPerPart = cycleHoursPerPart * 60

      const visualWork = `Cycle time = ${t} ÷ ${p}
= ${formatNumber(cycleHoursPerPart, 6)} hr/part

Minutes per part = ${formatNumber(cycleHoursPerPart, 6)} × 60
= ${formatNumber(cycleMinutesPerPart, 4)} min/part`

      setResult({
        title: "Cycle Time",
        value: `${formatNumber(cycleMinutesPerPart, 4)} min/part`,
        summary: `Cycle time = ${formatNumber(cycleMinutesPerPart, 4)} min/part`,
        formula: "Cycle Time = Total Time ÷ Total Parts",
        cycleHoursPerPart,
        cycleMinutesPerPart,
        effectiveShiftHours,
        visualWork,
        copyText: visualWork,
        steps: [
          `Cycle time = ${t} ÷ ${p}`,
          `Cycle time = ${formatNumber(cycleHoursPerPart, 6)} hr/part`,
          `Minutes per part = ${formatNumber(cycleHoursPerPart, 6)} × 60`,
          `Minutes per part = ${formatNumber(cycleMinutesPerPart, 4)} min/part`,
        ],
      })
      return
    }

    if (mode === "output") {
      if (!(r > 0)) {
        setResult({
          error: "Enter a rate greater than zero.",
        })
        return
      }

      const adjustedRate = r * downtimeFactor
      const projectedShiftOutput = adjustedRate * effectiveShiftHours
      const performance = buildPerformance(adjustedRate, tr)

      const visualWork = `Downtime factor = 1 - (${downtimePercent} ÷ 100)
= ${formatNumber(downtimeFactor, 4)}

Adjusted rate = ${r} × ${formatNumber(downtimeFactor, 4)}
= ${formatNumber(adjustedRate, decimals)} parts/hr

Effective shift hours = ${shiftLength} × ${formatNumber(downtimeFactor, 4)}
= ${formatNumber(effectiveShiftHours, decimals)} hr

Shift output = ${formatNumber(adjustedRate, decimals)} × ${formatNumber(
        effectiveShiftHours,
        decimals
      )}
= ${formatNumber(projectedShiftOutput, decimals)} parts`

      setResult({
        title: "Shift Output",
        value: `${formatNumber(projectedShiftOutput, decimals)} parts`,
        summary: `Projected shift output = ${formatNumber(
          projectedShiftOutput,
          decimals
        )} parts`,
        formula:
          "Adjusted Rate = Input Rate × (1 - Downtime %), Shift Output = Adjusted Rate × Effective Shift Hours",
        adjustedRate,
        projectedShiftOutput,
        effectiveShiftHours,
        performance,
        visualWork,
        copyText: visualWork,
        steps: [
          `Downtime factor = 1 - (${downtimePercent} ÷ 100)`,
          `Downtime factor = ${formatNumber(downtimeFactor, 4)}`,
          `Adjusted rate = ${r} × ${formatNumber(downtimeFactor, 4)}`,
          `Adjusted rate = ${formatNumber(adjustedRate, decimals)} parts/hr`,
          `Effective shift hours = ${shiftLength} × ${formatNumber(
            downtimeFactor,
            4
          )}`,
          `Effective shift hours = ${formatNumber(
            effectiveShiftHours,
            decimals
          )} hr`,
          `Shift output = ${formatNumber(adjustedRate, decimals)} × ${formatNumber(
            effectiveShiftHours,
            decimals
          )}`,
          `Shift output = ${formatNumber(projectedShiftOutput, decimals)} parts`,
        ],
      })
      return
    }

    if (mode === "time") {
      if (!(tp > 0) || !(r > 0)) {
        setResult({
          error: "Enter target parts and rate greater than zero.",
        })
        return
      }

      const adjustedRate = r * downtimeFactor

      if (!(adjustedRate > 0)) {
        setResult({
          error: "Adjusted rate must be greater than zero.",
        })
        return
      }

      const hoursRequired = tp / adjustedRate
      const shiftsRequired =
        effectiveShiftHours > 0 ? hoursRequired / effectiveShiftHours : 0
      const performance = buildPerformance(adjustedRate, tr)

      const visualWork = `Downtime factor = 1 - (${downtimePercent} ÷ 100)
= ${formatNumber(downtimeFactor, 4)}

Adjusted rate = ${r} × ${formatNumber(downtimeFactor, 4)}
= ${formatNumber(adjustedRate, decimals)} parts/hr

Hours required = ${tp} ÷ ${formatNumber(adjustedRate, decimals)}
= ${formatNumber(hoursRequired, decimals)} hr

Shifts required = ${formatNumber(hoursRequired, decimals)} ÷ ${formatNumber(
        effectiveShiftHours,
        decimals
      )}
= ${formatNumber(shiftsRequired, decimals)} shifts`

      setResult({
        title: "Time Required",
        value: `${formatNumber(hoursRequired, decimals)} hr`,
        summary: `Required run time = ${formatNumber(
          hoursRequired,
          decimals
        )} hr`,
        formula:
          "Adjusted Rate = Input Rate × (1 - Downtime %), Hours Required = Target Parts ÷ Adjusted Rate, Shifts Required = Hours Required ÷ Effective Shift Hours",
        adjustedRate,
        hoursRequired,
        shiftsRequired,
        effectiveShiftHours,
        performance,
        visualWork,
        copyText: visualWork,
        steps: [
          `Downtime factor = 1 - (${downtimePercent} ÷ 100)`,
          `Downtime factor = ${formatNumber(downtimeFactor, 4)}`,
          `Adjusted rate = ${r} × ${formatNumber(downtimeFactor, 4)}`,
          `Adjusted rate = ${formatNumber(adjustedRate, decimals)} parts/hr`,
          `Hours required = ${tp} ÷ ${formatNumber(adjustedRate, decimals)}`,
          `Hours required = ${formatNumber(hoursRequired, decimals)} hr`,
          `Shifts required = ${formatNumber(hoursRequired, decimals)} ÷ ${formatNumber(
            effectiveShiftHours,
            decimals
          )}`,
          `Shifts required = ${formatNumber(shiftsRequired, decimals)} shifts`,
        ],
      })
      return
    }

    setResult({
      error: "Select a valid calculation mode.",
    })
  }

  const clearAll = () => {
    setParts("")
    setTimeHours("")
    setRate("")
    setTargetParts("")
    setTargetRate("")
    setShiftLength(8)
    setDowntimePercent(0)
    setResult(null)
    setMode("rate")
  }

  const loadExample = (type) => {
    if (type === "rate") {
      setMode("rate")
      setParts("840")
      setTimeHours("7")
      setTargetRate("125")
      setResult(null)
    }

    if (type === "output") {
      setMode("output")
      setRate("95")
      setShiftLength(10)
      setDowntimePercent(12)
      setTargetRate("100")
      setResult(null)
    }

    if (type === "time") {
      setMode("time")
      setTargetParts("2200")
      setRate("110")
      setShiftLength(12)
      setDowntimePercent(8)
      setTargetRate("120")
      setResult(null)
    }
  }

  const copyResult = async () => {
    if (!result?.summary) return
    await navigator.clipboard.writeText(result.summary)
  }

  const copySteps = async () => {
    if (!result?.copyText) return
    await navigator.clipboard.writeText(result.copyText)
  }

  const currentModeTitle =
    mode === "rate"
      ? "Parts Per Hour"
      : mode === "cycle"
      ? "Cycle Time"
      : mode === "output"
      ? "Shift Output"
      : "Time Required"

  const helperText =
    mode === "rate"
      ? "Use actual parts and elapsed hours to calculate production rate, then apply downtime and shift effect."
      : mode === "cycle"
      ? "Use total parts and total time to calculate minutes per part."
      : mode === "output"
      ? "Use a known production rate to estimate adjusted shift output with downtime applied."
      : "Use target quantity and rate to estimate required hours and shifts."

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Production Rate Calculator | RuntWerkx</title>
        <meta
          name="description"
          content="Calculate production rate, cycle time, shift output, time required, downtime impact, and target performance."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta
          property="og:title"
          content="Production Rate Calculator | RuntWerkx"
        />
        <meta
          property="og:description"
          content="Calculate parts per hour, cycle time, shift output, required run time, downtime impact, and real versus target performance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Production Rate Calculator | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Production calculator with visible formulas, worked steps, downtime logic, and shift planning."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RuntWerkx Production Rate Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            url: PAGE_URL,
            description:
              "Production rate calculator with visible worked steps, downtime adjustment, shift planning, and performance comparison.",
            provider: {
              "@type": "Organization",
              name: "RuntWerkx",
              url: "https://runtwerkx.com",
            },
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-10 lg:px-14">
        <CircuitBackdrop />

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
              Production Rate Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Calculate production speed, cycle time, shift output, required run
              time, downtime impact, and real versus target performance.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Built for real operations planning, shift estimates, production
              pacing, quoting support, and quick what-if checks with visible
              formulas and worked output.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setMode("rate")
                  setResult(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "rate"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Parts / Hour
              </button>
              <button
                onClick={() => {
                  setMode("cycle")
                  setResult(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "cycle"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Cycle Time
              </button>
              <button
                onClick={() => {
                  setMode("output")
                  setResult(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "output"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Shift Output
              </button>
              <button
                onClick={() => {
                  setMode("time")
                  setResult(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "time"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Time Required
              </button>
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400"
              >
                Calculator Settings
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => loadExample("rate")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Rate Example
              </button>
              <button
                onClick={() => loadExample("output")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Output Example
              </button>
              <button
                onClick={() => loadExample("time")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Time Example
              </button>
            </div>

            {showSettings && (
              <div className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-emerald-500/20 bg-zinc-950/80 p-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <TogglePill
                    label="Tooltips"
                    checked={showTooltips}
                    onChange={setShowTooltips}
                  />
                  <TogglePill
                    label="Show Formula"
                    checked={showFormula}
                    onChange={setShowFormula}
                  />
                  <TogglePill
                    label="Show Steps"
                    checked={showSteps}
                    onChange={setShowSteps}
                  />
                  <div className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2.5 text-sm text-zinc-300">
                    <span className="mr-3">Decimals</span>
                    <select
                      value={decimals}
                      onChange={(e) => setDecimals(Number(e.target.value))}
                      className="bg-transparent text-white outline-none"
                    >
                      <option value={0}>0</option>
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-16 grid gap-12 xl:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Working Surface ―
                </p>
                <h2 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                  {currentModeTitle} Workstation
                  {showTooltips && <TooltipBubble text={helperText} />}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Build quick production scenarios with more visibility into the
                  math, the shift effect, the downtime loss, and the resulting
                  output.
                </p>
              </div>

              <div className="relative min-h-[820px] overflow-hidden rounded-[2.3rem] bg-black shadow-[inset_0_0_100px_rgba(255,255,255,0.02),0_0_60px_rgba(0,0,0,0.55)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_42%),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.012),rgba(255,255,255,0.012)_1px,transparent_1px,transparent_52px)]" />
                <div className="absolute inset-0 opacity-30">
                  <span className="absolute left-[12%] top-[18%] h-px w-40 bg-white/10 animate-[chalkSweep_5s_ease-in-out_infinite]" />
                  <span className="absolute left-[52%] top-[36%] h-px w-28 bg-white/10 animate-[chalkSweep_6s_ease-in-out_infinite]" />
                  <span className="absolute left-[24%] top-[65%] h-px w-36 bg-white/10 animate-[chalkSweep_7s_ease-in-out_infinite]" />
                </div>

                <div className="relative z-10 h-full p-10 md:p-12">
                  <div className="mx-auto max-w-[1250px]">
                    <div className="mb-10 text-center">
                      <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                        ― Production Input Workspace ―
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                        Rate, Shift & Performance Inputs
                      </h3>
                      <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400">
                        Use actual quantities, hours, shift length, downtime
                        loss, and target rate to build a clearer production
                        picture.
                      </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5">
                          <div>
                            <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                              Shift Planner
                            </label>

                            <div className="mt-3 flex flex-wrap gap-3">
                              <button
                                onClick={() => setShiftLength(8)}
                                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                                  shiftLength === 8
                                    ? "bg-emerald-500 text-black"
                                    : "border border-zinc-700 bg-black/40 text-zinc-300 hover:border-emerald-400 hover:text-white"
                                }`}
                              >
                                8 Hour Shift
                              </button>

                              <button
                                onClick={() => setShiftLength(10)}
                                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                                  shiftLength === 10
                                    ? "bg-emerald-500 text-black"
                                    : "border border-zinc-700 bg-black/40 text-zinc-300 hover:border-emerald-400 hover:text-white"
                                }`}
                              >
                                10 Hour Shift
                              </button>

                              <button
                                onClick={() => setShiftLength(12)}
                                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                                  shiftLength === 12
                                    ? "bg-emerald-500 text-black"
                                    : "border border-zinc-700 bg-black/40 text-zinc-300 hover:border-emerald-400 hover:text-white"
                                }`}
                              >
                                12 Hour Shift
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                              Downtime / Efficiency Loss
                              {showTooltips && (
                                <TooltipBubble text="This adjusts the effective running time available inside the shift and reduces calculated output rate." />
                              )}
                            </label>

                            <div className="mt-4 rounded-[1.4rem] border border-zinc-800 bg-black/35 p-5">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={downtimePercent}
                                onChange={(e) =>
                                  setDowntimePercent(Number(e.target.value))
                                }
                                className="w-full accent-emerald-500"
                              />

                              <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-zinc-400">0%</span>
                                <span className="text-2xl font-semibold text-white">
                                  {downtimePercent}%
                                </span>
                                <span className="text-sm text-zinc-400">100%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                              Target Rate (Optional)
                            </label>
                            <input
                              type="number"
                              value={targetRate}
                              onChange={(e) => setTargetRate(e.target.value)}
                              placeholder="Enter target parts per hour"
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                            />
                            <p className="mt-2 text-xs leading-6 text-zinc-500">
                              Used for real vs target performance comparison.
                            </p>
                          </div>

                          <div className="rounded-[1.4rem] border border-zinc-800 bg-black/35 p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                              Shift Summary
                            </p>
                            <div className="mt-4">
                              <ProductionSummaryCards
                                shiftLength={shiftLength}
                                downtimePercent={downtimePercent}
                                effectiveShiftHours={effectiveShiftHours}
                                projectedShiftOutput={result?.projectedShiftOutput}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5">
                          {(mode === "rate" || mode === "cycle") && (
                            <>
                              <div>
                                <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                  Total Parts
                                </label>
                                <input
                                  type="number"
                                  value={parts}
                                  onChange={(e) => setParts(e.target.value)}
                                  placeholder="Enter total parts"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                  Total Time (Hours)
                                </label>
                                <input
                                  type="number"
                                  value={timeHours}
                                  onChange={(e) => setTimeHours(e.target.value)}
                                  placeholder="Enter total hours"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                                />
                              </div>
                            </>
                          )}

                          {mode === "output" && (
                            <div>
                              <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                Rate (Parts Per Hour)
                              </label>
                              <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                placeholder="Enter actual rate"
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          )}

                          {mode === "time" && (
                            <>
                              <div>
                                <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                  Target Parts
                                </label>
                                <input
                                  type="number"
                                  value={targetParts}
                                  onChange={(e) => setTargetParts(e.target.value)}
                                  placeholder="Enter target quantity"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                  Rate (Parts Per Hour)
                                </label>
                                <input
                                  type="number"
                                  value={rate}
                                  onChange={(e) => setRate(e.target.value)}
                                  placeholder="Enter actual rate"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <button
                        onClick={calculate}
                        className="rounded-full bg-emerald-500 px-7 py-3.5 text-lg font-semibold text-black transition hover:bg-emerald-400"
                      >
                        Calculate
                      </button>
                      <button
                        onClick={clearAll}
                        className="rounded-full border border-zinc-700 px-7 py-3.5 text-lg font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-900"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                        <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Show The Work ―
                </p>
                <h2 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                  Worked Production Output
                  {showTooltips && (
                    <TooltipBubble text="This area should show the production math clearly, including the rate logic, downtime effect, shift effect, and final answer." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, visible steps, worked display, and clearer production
                  answer trail.
                </p>
              </div>

              <div className="min-h-[820px] rounded-[2.3rem] bg-zinc-950/55 p-8 backdrop-blur-sm">
                {!result ? (
                  <div className="flex min-h-[740px] items-center justify-center text-center text-zinc-500">
                    Enter production values and click calculate to see the
                    worked solution.
                  </div>
                ) : result.error ? (
                  <div className="rounded-[1.8rem] bg-black/45 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                      Input Check
                    </p>
                    <p className="mt-4 text-2xl text-zinc-200">
                      {result.error}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                        ― Active Result ―
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold">
                        {result.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={copyResult}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                      >
                        Copy Result
                      </button>
                      <button
                        onClick={copySteps}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                      >
                        Copy Steps
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Final Result
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {result.value}
                        </p>
                      </div>

                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Shift Length
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {shiftLength} hr
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Downtime Loss
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {downtimePercent}%
                        </p>
                      </div>

                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Effective Shift
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {typeof result.effectiveShiftHours === "number"
                            ? `${formatNumber(result.effectiveShiftHours, decimals)} hr`
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {showFormula && result.formula && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Formula
                        </p>
                        <p className="mt-3 whitespace-pre-wrap break-words font-mono text-2xl leading-relaxed text-zinc-100">
                          {result.formula}
                        </p>
                      </div>
                    )}

                    {typeof result.rawRate === "number" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Raw Rate
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(result.rawRate, decimals)} parts/hr
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Adjusted Rate
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof result.adjustedRate === "number"
                              ? `${formatNumber(result.adjustedRate, decimals)} parts/hr`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {typeof result.adjustedRate === "number" &&
                      typeof result.projectedShiftOutput === "number" && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                              Adjusted Rate
                            </p>
                            <p className="mt-3 text-2xl font-semibold text-white">
                              {formatNumber(result.adjustedRate, decimals)} parts/hr
                            </p>
                          </div>

                          <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                              Shift Projection
                            </p>
                            <p className="mt-3 text-2xl font-semibold text-white">
                              {formatNumber(result.projectedShiftOutput, decimals)} parts
                            </p>
                          </div>
                        </div>
                      )}

                    {typeof result.hoursRequired === "number" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Hours Required
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(result.hoursRequired, decimals)} hr
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Shifts Required
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof result.shiftsRequired === "number"
                              ? formatNumber(result.shiftsRequired, decimals)
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {typeof result.cycleMinutesPerPart === "number" && (
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Cycle Time
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(result.cycleMinutesPerPart, 4)} min/part
                        </p>
                      </div>
                    )}

                    {result.performance && (
                      <div className="rounded-[1.8rem] bg-emerald-500/10 p-6">
                        <p className="text-center text-xs uppercase tracking-[0.35em] text-emerald-300">
                          ― Real vs Target Performance ―
                        </p>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="rounded-[1.2rem] bg-black/40 p-5 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                              Efficiency
                            </p>
                            <p className="mt-3 text-3xl font-bold text-white">
                              {formatNumber(
                                result.performance.efficiencyPercent,
                                decimals
                              )}
                              %
                            </p>
                          </div>

                          <div className="rounded-[1.2rem] bg-black/40 p-5 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                              Rate Delta
                            </p>
                            <p className="mt-3 text-3xl font-bold text-white">
                              {formatNumber(result.performance.delta, decimals)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="rounded-[1.2rem] bg-black/40 p-4 text-center">
                            <p className="text-sm text-zinc-400">Target Rate</p>
                            <p className="mt-2 text-xl font-semibold text-white">
                              {formatNumber(result.performance.targetRate, decimals)} parts/hr
                            </p>
                          </div>

                          <div className="rounded-[1.2rem] bg-black/40 p-4 text-center">
                            <p className="text-sm text-zinc-400">
                              Actual Adjusted Rate
                            </p>
                            <p className="mt-2 text-xl font-semibold text-white">
                              {formatNumber(result.performance.actualRate, decimals)} parts/hr
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {showSteps && Array.isArray(result.steps) && result.steps.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Step Breakdown
                        </p>
                        <div className="mt-4 space-y-3">
                          {result.steps.map((step, index) => (
                            <p
                              key={`${step}-${index}`}
                              className="whitespace-pre-wrap break-words font-mono text-xl leading-8 text-zinc-200"
                            >
                              {index + 1}. {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.visualWork && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Worked Display
                        </p>
                        <div className="mt-4 rounded-[1.8rem] bg-black/55 p-7">
                          <pre className="whitespace-pre-wrap break-words font-mono text-[28px] leading-[1.9] text-zinc-100 md:text-[32px]">
                            {result.visualWork}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="rounded-[1.8rem] bg-emerald-500/10 p-6 text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                        ― Final Answer ―
                      </p>
                      <p className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                        {result.summary || result.value}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="mt-24 rounded-[2rem] border border-emerald-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                ― What This Calculator Covers ―
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Built for real production planning and output checks
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This production rate calculator is built for real-world workflow
                math. Use it to calculate parts per hour, cycle time, projected
                shift output, total time required, downtime impact, and real
                versus target performance. The page is designed to show more of
                the actual math so the result is easier to verify during
                estimating, planning, production pacing, and quick operational
                checks.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-500/15 bg-black/40 p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">
                  ― Related Tools ―
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Continue through the RuntWerkx calculator system
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
                  to="/knowledge-library/calculators-charts-conversions/area-volume-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Area & Volume Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Material Weight Calculator
                </Link>
              </div>
            </div>
          </section>

          <FooterStatusPanel
            mode={mode}
            showFormula={showFormula}
            showSteps={showSteps}
            showTooltips={showTooltips}
            decimals={decimals}
            shiftLength={shiftLength}
            downtimePercent={downtimePercent}
            result={result}
          />
        </div>
      </section>
    </div>
  )
}