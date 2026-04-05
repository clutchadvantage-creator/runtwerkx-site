import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/pipe-tank-fill-calculator"

const RANDOM_TECH_TEXT = [
  "RWX",
  "FLOW",
  "FILL",
  "SYNC",
  "A1",
  "PWR",
  "DATA",
  "X7",
  "42",
  "GRID",
  "CLK",
  "LVL",
  "RATE",
  "TANK",
]

const GALLONS_PER_CUBIC_INCH = 0.00432900433
const LITERS_PER_CUBIC_INCH = 0.016387064
const CUBIC_FEET_PER_CUBIC_INCH = 1 / 1728

function formatNumber(value, decimals = 4) {
  if (typeof value !== "number" || Number.isNaN(value)) return String(value)
  const rounded = Number(value.toFixed(decimals))
  return rounded.toLocaleString()
}

function convertLengthToInches(value, unit) {
  if (!Number.isFinite(value)) return NaN
  if (unit === "in") return value
  if (unit === "ft") return value * 12
  if (unit === "mm") return value / 25.4
  return value
}

function gallonsToLiters(gallons) {
  return gallons * 3.785411784
}

function gallonsPerMinuteToGallonsPerHour(gpm) {
  return gpm * 60
}

function cubicInchesToGallons(cubicInches) {
  return cubicInches * GALLONS_PER_CUBIC_INCH
}

function cubicInchesToLiters(cubicInches) {
  return cubicInches * LITERS_PER_CUBIC_INCH
}

function cubicInchesToCubicFeet(cubicInches) {
  return cubicInches * CUBIC_FEET_PER_CUBIC_INCH
}

function buildVolumeSummary(cubicInches) {
  const gallons = cubicInchesToGallons(cubicInches)
  const liters = cubicInchesToLiters(cubicInches)
  const cubicFeet = cubicInchesToCubicFeet(cubicInches)

  return {
    cubicInches,
    gallons,
    liters,
    cubicFeet,
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
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-30 w-72 -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-zinc-950/95 p-3 text-sm leading-6 text-zinc-200 opacity-0 shadow-[0_0_18px_rgba(16,185,129,0.14)] transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

function InputLabel({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
      {children}
    </label>
  )
}

function TrustPanel({ mode, shape }) {
  return (
    <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-zinc-950/75 p-6 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
          ― Trust & Reference Notes ―
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Input and estimation guidance
        </h3>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Calculator Mode
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Current mode:
            {" "}
            <span className="text-white">
              {mode === "pipeVolume"
                ? "Pipe Volume"
                : mode === "tankVolume"
                ? "Tank Volume"
                : mode === "fillTime"
                ? "Fill Time"
                : "Partial Fill"}
            </span>
            . This calculator uses entered dimensions and flow values only. It
            is intended for estimation and planning math.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Tank Shape Basis
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Selected shape:
            {" "}
            <span className="text-white">
              {shape === "rectangular"
                ? "Rectangular Tank"
                : shape === "verticalCylinder"
                ? "Vertical Cylinder"
                : "Horizontal Cylinder"}
            </span>
            . Horizontal cylinder partial fill uses a circular-segment approach
            instead of a simple percent shortcut.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Unit Handling
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Lengths are converted internally to inches before volume is solved.
            Output is then displayed as gallons, liters, cubic feet, and worked
            formulas so the answer is easier to verify.
          </p>
        </div>
      </div>
    </div>
  )
}

function FooterStatusPanel({
  mode,
  shape,
  showFormula,
  showSteps,
  showTooltips,
  decimals,
  resultData,
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
              Fluid Utility Environment Status
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
            <p className="mt-3 text-xl font-semibold text-white">
              {mode === "pipeVolume"
                ? "Pipe Volume"
                : mode === "tankVolume"
                ? "Tank Volume"
                : mode === "fillTime"
                ? "Fill Time"
                : "Partial Fill"}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Tank Shape
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {shape === "rectangular"
                ? "Rectangular"
                : shape === "verticalCylinder"
                ? "Vertical Cylinder"
                : "Horizontal Cylinder"}
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
              <p>Decimals: {decimals}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Last Output
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {resultData?.summary || "No result calculated yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function buildPipeVolumeWork({
  diameter,
  length,
  lengthUnit,
  sectionUnit,
  decimals,
}) {
  const diameterRaw = Number(diameter)
  const lengthRaw = Number(length)

  const diameterIn = convertLengthToInches(diameterRaw, sectionUnit)
  const lengthIn = convertLengthToInches(lengthRaw, lengthUnit)

  if (![diameterIn, lengthIn].every((n) => Number.isFinite(n) && n > 0)) {
    return {
      error: "Enter valid inside diameter and pipe length values.",
      title: "Pipe Volume",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    }
  }

  const radiusIn = diameterIn / 2
  const areaIn2 = Math.PI * radiusIn * radiusIn
  const volumeIn3 = areaIn2 * lengthIn
  const volume = buildVolumeSummary(volumeIn3)

  const visualWork = `Radius = ${formatNumber(diameterIn, decimals)} ÷ 2
= ${formatNumber(radiusIn, decimals)} in

Area = π × ${formatNumber(radiusIn, decimals)}²
= ${formatNumber(areaIn2, decimals)} in²

Volume = ${formatNumber(areaIn2, decimals)} × ${formatNumber(lengthIn, decimals)}
= ${formatNumber(volumeIn3, decimals)} in³

Gallons = ${formatNumber(volume.gallons, decimals)}
Liters = ${formatNumber(volume.liters, decimals)}
Cubic Feet = ${formatNumber(volume.cubicFeet, decimals)}`

  return {
    error: null,
    title: "Pipe Volume",
    formula: "Volume = πr²L",
    summary: `${formatNumber(volume.gallons, decimals)} gal | ${formatNumber(
      volume.liters,
      decimals
    )} L`,
    steps: [
      `Radius = Diameter ÷ 2 = ${formatNumber(radiusIn, decimals)} in`,
      `Area = π × r² = ${formatNumber(areaIn2, decimals)} in²`,
      `Volume = Area × Length = ${formatNumber(volumeIn3, decimals)} in³`,
      `Gallons = ${formatNumber(volume.gallons, decimals)}`,
      `Liters = ${formatNumber(volume.liters, decimals)}`,
      `Cubic feet = ${formatNumber(volume.cubicFeet, decimals)}`,
    ],
    visualWork,
    copyText: visualWork,
    ...volume,
  }
}

function buildTankVolumeWork({
  shape,
  length,
  width,
  height,
  diameter,
  tankLength,
  lengthUnit,
  sectionUnit,
  decimals,
}) {
  const lengthRaw = Number(length)
  const widthRaw = Number(width)
  const heightRaw = Number(height)
  const diameterRaw = Number(diameter)
  const tankLengthRaw = Number(tankLength)

  const lengthIn = convertLengthToInches(lengthRaw, lengthUnit)
  const widthIn = convertLengthToInches(widthRaw, sectionUnit)
  const heightIn = convertLengthToInches(heightRaw, sectionUnit)
  const diameterIn = convertLengthToInches(diameterRaw, sectionUnit)
  const tankLengthIn = convertLengthToInches(tankLengthRaw, lengthUnit)

  let volumeIn3 = 0
  let visualWork = ""
  let steps = []
  let formula = ""
  let title = "Tank Volume"

  if (shape === "rectangular") {
    if (![lengthIn, widthIn, heightIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length, width, and height values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      }
    }

    volumeIn3 = lengthIn * widthIn * heightIn
    formula = "Volume = Length × Width × Height"
    title = "Rectangular Tank Volume"
    visualWork = `Volume = ${formatNumber(lengthIn, decimals)} × ${formatNumber(
      widthIn,
      decimals
    )} × ${formatNumber(heightIn, decimals)}
= ${formatNumber(volumeIn3, decimals)} in³`

    steps = [
      `Length = ${formatNumber(lengthIn, decimals)} in`,
      `Width = ${formatNumber(widthIn, decimals)} in`,
      `Height = ${formatNumber(heightIn, decimals)} in`,
      `Volume = ${formatNumber(volumeIn3, decimals)} in³`,
    ]
  }

  if (shape === "verticalCylinder") {
    if (![diameterIn, heightIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid diameter and height values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      }
    }

    const radiusIn = diameterIn / 2
    const areaIn2 = Math.PI * radiusIn * radiusIn
    volumeIn3 = areaIn2 * heightIn
    formula = "Volume = πr²h"
    title = "Vertical Cylinder Volume"
    visualWork = `Radius = ${formatNumber(diameterIn, decimals)} ÷ 2
= ${formatNumber(radiusIn, decimals)} in

Area = π × ${formatNumber(radiusIn, decimals)}²
= ${formatNumber(areaIn2, decimals)} in²

Volume = ${formatNumber(areaIn2, decimals)} × ${formatNumber(heightIn, decimals)}
= ${formatNumber(volumeIn3, decimals)} in³`

    steps = [
      `Radius = ${formatNumber(radiusIn, decimals)} in`,
      `Area = ${formatNumber(areaIn2, decimals)} in²`,
      `Volume = ${formatNumber(volumeIn3, decimals)} in³`,
    ]
  }

  if (shape === "horizontalCylinder") {
    if (![diameterIn, tankLengthIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid diameter and tank length values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      }
    }

    const radiusIn = diameterIn / 2
    const areaIn2 = Math.PI * radiusIn * radiusIn
    volumeIn3 = areaIn2 * tankLengthIn
    formula = "Volume = πr²L"
    title = "Horizontal Cylinder Volume"
    visualWork = `Radius = ${formatNumber(diameterIn, decimals)} ÷ 2
= ${formatNumber(radiusIn, decimals)} in

Area = π × ${formatNumber(radiusIn, decimals)}²
= ${formatNumber(areaIn2, decimals)} in²

Volume = ${formatNumber(areaIn2, decimals)} × ${formatNumber(tankLengthIn, decimals)}
= ${formatNumber(volumeIn3, decimals)} in³`

    steps = [
      `Radius = ${formatNumber(radiusIn, decimals)} in`,
      `Area = ${formatNumber(areaIn2, decimals)} in²`,
      `Volume = ${formatNumber(volumeIn3, decimals)} in³`,
    ]
  }

  const volume = buildVolumeSummary(volumeIn3)
  const fullVisual = `${visualWork}

Gallons = ${formatNumber(volume.gallons, decimals)}
Liters = ${formatNumber(volume.liters, decimals)}
Cubic Feet = ${formatNumber(volume.cubicFeet, decimals)}`

  return {
    error: null,
    title,
    formula,
    summary: `${formatNumber(volume.gallons, decimals)} gal | ${formatNumber(
      volume.liters,
      decimals
    )} L`,
    steps: [
      ...steps,
      `Gallons = ${formatNumber(volume.gallons, decimals)}`,
      `Liters = ${formatNumber(volume.liters, decimals)}`,
      `Cubic feet = ${formatNumber(volume.cubicFeet, decimals)}`,
    ],
    visualWork: fullVisual,
    copyText: fullVisual,
    ...volume,
  }
}

function buildFillTimeWork({
  volumeGallons,
  flowRate,
  flowUnit,
  decimals,
}) {
  const gallonsRaw = Number(volumeGallons)
  const flowRaw = Number(flowRate)

  if (![gallonsRaw, flowRaw].every((n) => Number.isFinite(n) && n > 0)) {
    return {
      error: "Enter valid volume and flow rate values greater than zero.",
      title: "Fill Time",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    }
  }

  const gpm = flowUnit === "gph" ? flowRaw / 60 : flowRaw
  const minutesRequired = gallonsRaw / gpm
  const hoursRequired = minutesRequired / 60
  const gph = gallonsPerMinuteToGallonsPerHour(gpm)

  const visualWork = `Flow input = ${
    flowUnit === "gph"
      ? `${formatNumber(flowRaw, decimals)} gal/hr`
      : `${formatNumber(flowRaw, decimals)} gal/min`
  }

Flow normalized = ${formatNumber(gpm, decimals)} gal/min
= ${formatNumber(gph, decimals)} gal/hr

Fill time = ${formatNumber(gallonsRaw, decimals)} ÷ ${formatNumber(gpm, decimals)}
= ${formatNumber(minutesRequired, decimals)} min

Hours = ${formatNumber(minutesRequired, decimals)} ÷ 60
= ${formatNumber(hoursRequired, decimals)} hr`

  return {
    error: null,
    title: "Fill Time",
    formula: "Time = Volume ÷ Flow Rate",
    summary: `${formatNumber(minutesRequired, decimals)} min | ${formatNumber(
      hoursRequired,
      decimals
    )} hr`,
    steps: [
      `Flow normalized = ${formatNumber(gpm, decimals)} gal/min`,
      `Fill time = ${formatNumber(gallonsRaw, decimals)} ÷ ${formatNumber(
        gpm,
        decimals
      )}`,
      `Minutes required = ${formatNumber(minutesRequired, decimals)} min`,
      `Hours required = ${formatNumber(hoursRequired, decimals)} hr`,
    ],
    visualWork,
    copyText: visualWork,
    gallons: gallonsRaw,
    gpm,
    gph,
    minutesRequired,
    hoursRequired,
  }
}

function buildPartialFillWork({
  shape,
  width,
  height,
  length,
  diameter,
  tankLength,
  fillPercent,
  fillHeight,
  lengthUnit,
  sectionUnit,
  decimals,
}) {
  const percentRaw = Number(fillPercent)
  const fillHeightRaw = Number(fillHeight)

  if (shape === "rectangular") {
    const lengthIn = convertLengthToInches(Number(length), lengthUnit)
    const widthIn = convertLengthToInches(Number(width), sectionUnit)
    const heightIn = convertLengthToInches(Number(height), sectionUnit)

    if (![lengthIn, widthIn, heightIn, percentRaw].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid rectangular tank dimensions and fill percent.",
        title: "Partial Fill",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      }
    }

    const clampedPercent = Math.min(percentRaw, 100)
    const fullVolume = lengthIn * widthIn * heightIn
    const filledVolume = fullVolume * (clampedPercent / 100)
    const volume = buildVolumeSummary(filledVolume)

    const visualWork = `Full volume = ${formatNumber(lengthIn, decimals)} × ${formatNumber(
      widthIn,
      decimals
    )} × ${formatNumber(heightIn, decimals)}
= ${formatNumber(fullVolume, decimals)} in³

Filled volume = ${formatNumber(fullVolume, decimals)} × (${formatNumber(
      clampedPercent,
      decimals
    )} ÷ 100)
= ${formatNumber(filledVolume, decimals)} in³

Gallons = ${formatNumber(volume.gallons, decimals)}
Liters = ${formatNumber(volume.liters, decimals)}`

    return {
      error: null,
      title: "Rectangular Partial Fill",
      formula: "Filled Volume = Full Volume × (Fill % ÷ 100)",
      summary: `${formatNumber(clampedPercent, decimals)}% full = ${formatNumber(
        volume.gallons,
        decimals
      )} gal`,
      steps: [
        `Full volume = ${formatNumber(fullVolume, decimals)} in³`,
        `Fill percent = ${formatNumber(clampedPercent, decimals)}%`,
        `Filled volume = ${formatNumber(filledVolume, decimals)} in³`,
        `Gallons = ${formatNumber(volume.gallons, decimals)}`,
        `Liters = ${formatNumber(volume.liters, decimals)}`,
      ],
      visualWork,
      copyText: visualWork,
      fillPercent: clampedPercent,
      ...volume,
    }
  }

  if (shape === "verticalCylinder") {
    const diameterIn = convertLengthToInches(Number(diameter), sectionUnit)
    const heightIn = convertLengthToInches(Number(height), sectionUnit)

    if (![diameterIn, heightIn, percentRaw].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid cylinder dimensions and fill percent.",
        title: "Partial Fill",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      }
    }

    const clampedPercent = Math.min(percentRaw, 100)
    const radiusIn = diameterIn / 2
    const areaIn2 = Math.PI * radiusIn * radiusIn
    const fillHeightIn = heightIn * (clampedPercent / 100)
    const filledVolume = areaIn2 * fillHeightIn
    const volume = buildVolumeSummary(filledVolume)

    const visualWork = `Radius = ${formatNumber(diameterIn, decimals)} ÷ 2
= ${formatNumber(radiusIn, decimals)} in

Area = π × ${formatNumber(radiusIn, decimals)}²
= ${formatNumber(areaIn2, decimals)} in²

Fill height = ${formatNumber(heightIn, decimals)} × (${formatNumber(
      clampedPercent,
      decimals
    )} ÷ 100)
= ${formatNumber(fillHeightIn, decimals)} in

Filled volume = ${formatNumber(areaIn2, decimals)} × ${formatNumber(
      fillHeightIn,
      decimals
    )}
= ${formatNumber(filledVolume, decimals)} in³`

    return {
      error: null,
      title: "Vertical Cylinder Partial Fill",
      formula: "Filled Volume = πr² × Filled Height",
      summary: `${formatNumber(clampedPercent, decimals)}% full = ${formatNumber(
        volume.gallons,
        decimals
      )} gal`,
      steps: [
        `Area = ${formatNumber(areaIn2, decimals)} in²`,
        `Fill height = ${formatNumber(fillHeightIn, decimals)} in`,
        `Filled volume = ${formatNumber(filledVolume, decimals)} in³`,
        `Gallons = ${formatNumber(volume.gallons, decimals)}`,
        `Liters = ${formatNumber(volume.liters, decimals)}`,
      ],
      visualWork,
      copyText: visualWork,
      fillPercent: clampedPercent,
      ...volume,
    }
  }

  const diameterIn = convertLengthToInches(Number(diameter), sectionUnit)
  const tankLengthIn = convertLengthToInches(Number(tankLength), lengthUnit)
  const liquidHeightIn = convertLengthToInches(fillHeightRaw, sectionUnit)

  if (![diameterIn, tankLengthIn, liquidHeightIn].every((n) => Number.isFinite(n) && n > 0)) {
    return {
      error: "Enter valid horizontal tank diameter, length, and liquid height.",
      title: "Partial Fill",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    }
  }

  const radius = diameterIn / 2

  if (liquidHeightIn > diameterIn) {
    return {
      error: "Liquid height cannot be greater than tank diameter.",
      title: "Partial Fill",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    }
  }

  const area =
    radius * radius * Math.acos((radius - liquidHeightIn) / radius) -
    (radius - liquidHeightIn) *
      Math.sqrt(2 * radius * liquidHeightIn - liquidHeightIn * liquidHeightIn)

  const filledVolume = area * tankLengthIn
  const fullVolume = Math.PI * radius * radius * tankLengthIn
  const percentFull = (filledVolume / fullVolume) * 100
  const volume = buildVolumeSummary(filledVolume)

  const visualWork = `Radius = ${formatNumber(diameterIn, decimals)} ÷ 2
= ${formatNumber(radius, decimals)} in

Segment area = r² × arccos((r - h) / r) - (r - h) × √(2rh - h²)
= ${formatNumber(area, decimals)} in²

Filled volume = ${formatNumber(area, decimals)} × ${formatNumber(
    tankLengthIn,
    decimals
  )}
= ${formatNumber(filledVolume, decimals)} in³

Percent full = (${formatNumber(filledVolume, decimals)} ÷ ${formatNumber(
    fullVolume,
    decimals
  )}) × 100
= ${formatNumber(percentFull, decimals)}%`

  return {
    error: null,
    title: "Horizontal Cylinder Partial Fill",
    formula:
      "Segment Area = r² arccos((r-h)/r) - (r-h)√(2rh-h²), Volume = Segment Area × Length",
    summary: `${formatNumber(percentFull, decimals)}% full = ${formatNumber(
      volume.gallons,
      decimals
    )} gal`,
    steps: [
      `Radius = ${formatNumber(radius, decimals)} in`,
      `Segment area = ${formatNumber(area, decimals)} in²`,
      `Filled volume = ${formatNumber(filledVolume, decimals)} in³`,
      `Percent full = ${formatNumber(percentFull, decimals)}%`,
      `Gallons = ${formatNumber(volume.gallons, decimals)}`,
      `Liters = ${formatNumber(volume.liters, decimals)}`,
    ],
    visualWork,
    copyText: visualWork,
    fillPercent: percentFull,
    ...volume,
  }
}

export default function PipeTankFillCalculator() {
  const [mode, setMode] = useState("pipeVolume")
  const [shape, setShape] = useState("rectangular")
  const [showSettings, setShowSettings] = useState(false)
  const [showTooltips, setShowTooltips] = useState(true)
  const [showFormula, setShowFormula] = useState(true)
  const [showSteps, setShowSteps] = useState(true)
  const [decimals, setDecimals] = useState(4)

  const [lengthUnit, setLengthUnit] = useState("ft")
  const [sectionUnit, setSectionUnit] = useState("in")

  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [diameter, setDiameter] = useState("")
  const [tankLength, setTankLength] = useState("")

  const [volumeGallons, setVolumeGallons] = useState("")
  const [flowRate, setFlowRate] = useState("")
  const [flowUnit, setFlowUnit] = useState("gpm")

  const [fillPercent, setFillPercent] = useState("")
  const [fillHeight, setFillHeight] = useState("")

  const [resultData, setResultData] = useState(null)

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

  const calculate = () => {
    if (mode === "pipeVolume") {
      setResultData(
        buildPipeVolumeWork({
          diameter,
          length,
          lengthUnit,
          sectionUnit,
          decimals,
        })
      )
      return
    }

    if (mode === "tankVolume") {
      setResultData(
        buildTankVolumeWork({
          shape,
          length,
          width,
          height,
          diameter,
          tankLength,
          lengthUnit,
          sectionUnit,
          decimals,
        })
      )
      return
    }

    if (mode === "fillTime") {
      setResultData(
        buildFillTimeWork({
          volumeGallons,
          flowRate,
          flowUnit,
          decimals,
        })
      )
      return
    }

    setResultData(
      buildPartialFillWork({
        shape,
        width,
        height,
        length,
        diameter,
        tankLength,
        fillPercent,
        fillHeight,
        lengthUnit,
        sectionUnit,
        decimals,
      })
    )
  }

  const clearAll = () => {
    setLength("")
    setWidth("")
    setHeight("")
    setDiameter("")
    setTankLength("")
    setVolumeGallons("")
    setFlowRate("")
    setFillPercent("")
    setFillHeight("")
    setResultData(null)
  }

  const loadExample = () => {
    if (mode === "pipeVolume") {
      setDiameter("6")
      setLength("120")
      setLengthUnit("ft")
      setSectionUnit("in")
    }

    if (mode === "tankVolume") {
      if (shape === "rectangular") {
        setLength("10")
        setWidth("48")
        setHeight("60")
        setLengthUnit("ft")
        setSectionUnit("in")
      }

      if (shape === "verticalCylinder") {
        setDiameter("72")
        setHeight("144")
        setSectionUnit("in")
      }

      if (shape === "horizontalCylinder") {
        setDiameter("96")
        setTankLength("20")
        setSectionUnit("in")
        setLengthUnit("ft")
      }
    }

    if (mode === "fillTime") {
      setVolumeGallons("2500")
      setFlowRate("35")
      setFlowUnit("gpm")
    }

    if (mode === "partialFill") {
      if (shape === "rectangular") {
        setLength("12")
        setWidth("60")
        setHeight("72")
        setFillPercent("65")
        setLengthUnit("ft")
        setSectionUnit("in")
      }

      if (shape === "verticalCylinder") {
        setDiameter("84")
        setHeight("168")
        setFillPercent("55")
        setSectionUnit("in")
      }

      if (shape === "horizontalCylinder") {
        setDiameter("96")
        setTankLength("24")
        setFillHeight("38")
        setLengthUnit("ft")
        setSectionUnit("in")
      }
    }

    setResultData(null)
  }

  const copyResult = async () => {
    if (!resultData?.summary) return
    await navigator.clipboard.writeText(resultData.summary)
  }

  const copySteps = async () => {
    if (!resultData?.copyText) return
    await navigator.clipboard.writeText(resultData.copyText)
  }

  const helperText =
    mode === "pipeVolume"
      ? "Use inside diameter and total pipe length to estimate contained volume."
      : mode === "tankVolume"
      ? "Calculate full tank volume for rectangular, vertical cylinder, or horizontal cylinder shapes."
      : mode === "fillTime"
      ? "Use total volume and flow rate to estimate fill time."
      : "Calculate stored liquid volume for partial fill conditions."

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Pipe / Tank Fill Calculator | RuntWerkx</title>
        <meta
          name="description"
          content="Calculate pipe volume, tank volume, fill time, and partial fill levels with worked formulas and visible steps."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Pipe / Tank Fill Calculator | RuntWerkx" />
        <meta
          property="og:description"
          content="Pipe and tank fill calculator with worked formulas, visible steps, gallons, liters, cubic feet, and fill time."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Pipe / Tank Fill Calculator | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Calculate pipe volume, tank volume, fill time, and partial fill with visible worked output."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RuntWerkx Pipe / Tank Fill Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            url: PAGE_URL,
            description:
              "Pipe and tank fill calculator for volume, fill time, and partial fill with worked formulas and visible steps.",
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
              Pipe / Tank Fill Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Calculate pipe volume, tank volume, fill time, and partial fill
              conditions with formulas, worked steps, and visible output.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page for fluid utility math, storage planning, fill
              estimates, and quick process checks with gallons, liters, cubic
              feet, and time-based results.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setMode("pipeVolume")
                  setResultData(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "pipeVolume"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Pipe Volume
              </button>
              <button
                onClick={() => {
                  setMode("tankVolume")
                  setResultData(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "tankVolume"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Tank Volume
              </button>
              <button
                onClick={() => {
                  setMode("fillTime")
                  setResultData(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "fillTime"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Fill Time
              </button>
              <button
                onClick={() => {
                  setMode("partialFill")
                  setResultData(null)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "partialFill"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Partial Fill
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
                onClick={loadExample}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Example
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

          <TrustPanel mode={mode} shape={shape} />

          <div className="mt-16 grid gap-12 xl:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Working Surface ―
                </p>
                <h2 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                  Fluid Utility Workstation
                  {showTooltips && <TooltipBubble text={helperText} />}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Set the fluid mode, enter dimensions or flow data, and get a
                  fully visible worked result.
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
                        ― Fluid Input Workspace ―
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                        Volume, Tank & Fill Inputs
                      </h3>
                      <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400">
                        Choose a mode, then enter the dimensions or flow values
                        you know. The calculator will convert internally and show
                        the full worked result.
                      </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <InputLabel>Length Unit</InputLabel>
                            <select
                              value={lengthUnit}
                              onChange={(e) => setLengthUnit(e.target.value)}
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            >
                              <option value="in">Inches</option>
                              <option value="ft">Feet</option>
                              <option value="mm">Millimeters</option>
                            </select>
                          </div>

                          <div>
                            <InputLabel>Section Unit</InputLabel>
                            <select
                              value={sectionUnit}
                              onChange={(e) => setSectionUnit(e.target.value)}
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            >
                              <option value="in">Inches</option>
                              <option value="mm">Millimeters</option>
                            </select>
                          </div>

                          {(mode === "tankVolume" || mode === "partialFill") && (
                            <div className="md:col-span-2">
                              <InputLabel>Tank Shape</InputLabel>
                              <select
                                value={shape}
                                onChange={(e) => {
                                  setShape(e.target.value)
                                  setResultData(null)
                                }}
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                              >
                                <option value="rectangular">Rectangular Tank</option>
                                <option value="verticalCylinder">Vertical Cylinder</option>
                                <option value="horizontalCylinder">Horizontal Cylinder</option>
                              </select>
                            </div>
                          )}

                          {mode === "fillTime" && (
                            <>
                              <div>
                                <InputLabel>Total Volume (Gallons)</InputLabel>
                                <input
                                  type="number"
                                  value={volumeGallons}
                                  onChange={(e) => setVolumeGallons(e.target.value)}
                                  placeholder="Enter total gallons"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Flow Unit</InputLabel>
                                <select
                                  value={flowUnit}
                                  onChange={(e) => setFlowUnit(e.target.value)}
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                >
                                  <option value="gpm">Gallons / Minute</option>
                                  <option value="gph">Gallons / Hour</option>
                                </select>
                              </div>

                              <div className="md:col-span-2">
                                <InputLabel>Flow Rate</InputLabel>
                                <input
                                  type="number"
                                  value={flowRate}
                                  onChange={(e) => setFlowRate(e.target.value)}
                                  placeholder="Enter flow rate"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {mode === "pipeVolume" && (
                            <>
                              <div>
                                <InputLabel>Inside Diameter</InputLabel>
                                <input
                                  type="number"
                                  value={diameter}
                                  onChange={(e) => setDiameter(e.target.value)}
                                  placeholder="Enter inside diameter"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Pipe Length</InputLabel>
                                <input
                                  type="number"
                                  value={length}
                                  onChange={(e) => setLength(e.target.value)}
                                  placeholder="Enter pipe length"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {mode === "tankVolume" && shape === "rectangular" && (
                            <>
                              <div>
                                <InputLabel>Tank Length</InputLabel>
                                <input
                                  type="number"
                                  value={length}
                                  onChange={(e) => setLength(e.target.value)}
                                  placeholder="Enter tank length"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Tank Width</InputLabel>
                                <input
                                  type="number"
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                  placeholder="Enter tank width"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <InputLabel>Tank Height</InputLabel>
                                <input
                                  type="number"
                                  value={height}
                                  onChange={(e) => setHeight(e.target.value)}
                                  placeholder="Enter tank height"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {(mode === "tankVolume" || mode === "partialFill") &&
                            shape === "verticalCylinder" && (
                              <>
                                <div>
                                  <InputLabel>Diameter</InputLabel>
                                  <input
                                    type="number"
                                    value={diameter}
                                    onChange={(e) => setDiameter(e.target.value)}
                                    placeholder="Enter diameter"
                                    className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                  />
                                </div>

                                <div>
                                  <InputLabel>Height</InputLabel>
                                  <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Enter height"
                                    className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                  />
                                </div>
                              </>
                            )}

                          {(mode === "tankVolume" || mode === "partialFill") &&
                            shape === "horizontalCylinder" && (
                              <>
                                <div>
                                  <InputLabel>Diameter</InputLabel>
                                  <input
                                    type="number"
                                    value={diameter}
                                    onChange={(e) => setDiameter(e.target.value)}
                                    placeholder="Enter diameter"
                                    className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                  />
                                </div>

                                <div>
                                  <InputLabel>Tank Length</InputLabel>
                                  <input
                                    type="number"
                                    value={tankLength}
                                    onChange={(e) => setTankLength(e.target.value)}
                                    placeholder="Enter tank length"
                                    className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                  />
                                </div>
                              </>
                            )}
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5">
                          {mode === "partialFill" && shape !== "horizontalCylinder" && (
                            <div>
                              <InputLabel>Fill Percent</InputLabel>
                              <input
                                type="number"
                                value={fillPercent}
                                onChange={(e) => setFillPercent(e.target.value)}
                                placeholder="Enter fill percent"
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                              />
                            </div>
                          )}

                          {mode === "partialFill" && shape === "horizontalCylinder" && (
                            <div>
                              <InputLabel>Liquid Height</InputLabel>
                              <input
                                type="number"
                                value={fillHeight}
                                onChange={(e) => setFillHeight(e.target.value)}
                                placeholder="Enter liquid height"
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                              />
                              <p className="mt-2 text-xs leading-6 text-zinc-500">
                                Horizontal cylinder fill is solved from liquid
                                height, not just a simple percent assumption.
                              </p>
                            </div>
                          )}

                          <div className="rounded-[1.4rem] border border-zinc-800 bg-black/35 p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                              Output Coverage
                            </p>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
                                <p className="text-sm text-zinc-400">Gallons</p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                  Live
                                </p>
                              </div>

                              <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
                                <p className="text-sm text-zinc-400">Liters</p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                  Live
                                </p>
                              </div>

                              <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
                                <p className="text-sm text-zinc-400">Cubic Feet</p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                  Live
                                </p>
                              </div>

                              <div className="rounded-[1rem] border border-zinc-800 bg-black/40 p-4">
                                <p className="text-sm text-zinc-400">Worked Math</p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                  Visible
                                </p>
                              </div>
                            </div>
                          </div>
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
                  Worked Fluid Output
                  {showTooltips && (
                    <TooltipBubble text="This area shows the actual solved math, converted output, and the final answer trail." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, visible steps, converted volume, and final result with
                  a clearer answer trail.
                </p>
              </div>

              <div className="min-h-[820px] rounded-[2.3rem] bg-zinc-950/55 p-8 backdrop-blur-sm">
                {!resultData ? (
                  <div className="flex min-h-[740px] items-center justify-center text-center text-zinc-500">
                    Enter dimensions or flow values and click calculate to see
                    the worked solution.
                  </div>
                ) : resultData.error ? (
                  <div className="rounded-[1.8rem] bg-black/45 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                      Input Check
                    </p>
                    <p className="mt-4 text-2xl text-zinc-200">
                      {resultData.error}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                        ― Active Result ―
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold">
                        {resultData.title}
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

                    {showFormula && resultData.formula && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Formula
                        </p>
                        <p className="mt-3 whitespace-pre-wrap break-words font-mono text-2xl leading-relaxed text-zinc-100">
                          {resultData.formula}
                        </p>
                      </div>
                    )}

                    {showSteps && resultData.steps?.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Step Breakdown
                        </p>
                        <div className="mt-4 space-y-3">
                          {resultData.steps.map((step, index) => (
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

                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Worked Display
                      </p>
                      <div className="mt-4 rounded-[1.8rem] bg-black/55 p-7">
                        <pre className="whitespace-pre-wrap break-words font-mono text-[24px] leading-[1.9] text-zinc-100 md:text-[28px]">
                          {resultData.visualWork}
                        </pre>
                      </div>
                    </div>

                    {typeof resultData.gallons === "number" && (
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Gallons
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.gallons, decimals)}
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Liters
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.liters, decimals)}
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Cubic Feet
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.cubicFeet, decimals)}
                          </p>
                        </div>
                      </div>
                    )}

                    {typeof resultData.minutesRequired === "number" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Minutes Required
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.minutesRequired, decimals)} min
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Hours Required
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.hoursRequired, decimals)} hr
                          </p>
                        </div>
                      </div>
                    )}

                    {typeof resultData.fillPercent === "number" && (
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Fill Level
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(resultData.fillPercent, decimals)}%
                        </p>
                      </div>
                    )}

                    <div className="rounded-[1.8rem] bg-emerald-500/10 p-6 text-center">
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                        ― Final Answer ―
                      </p>
                      <p className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                        {resultData.summary}
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
                Built for practical fluid volume and fill-time math
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This pipe and tank fill calculator is built for real utility and
                process support work. Use it to calculate contained pipe volume,
                full tank volume, estimated fill time, and partial fill levels
                with visible formulas and worked output. It is designed to help
                with planning, storage estimation, process checks, and quick
                field math that is easier to verify than a black-box calculator.
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
                  to="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Material Weight Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/production-rate-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Production Rate Calculator
                </Link>
              </div>
            </div>
          </section>

          <FooterStatusPanel
            mode={mode}
            shape={shape}
            showFormula={showFormula}
            showSteps={showSteps}
            showTooltips={showTooltips}
            decimals={decimals}
            resultData={resultData}
          />
        </div>
      </section>
    </div>
  )
}