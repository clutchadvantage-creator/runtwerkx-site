import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/custom-trade-calculator";

const RANDOM_TECH_TEXT = [
  "RWX",
  "TRADE",
  "FAB",
  "GRID",
  "FLOW",
  "X7",
  "DATA",
  "NODE",
  "WELD",
  "LAYOUT",
  "UNIT",
  "SYNC",
  "PWR",
  "CALC",
];

function formatNumber(value, decimals = 4) {
  if (typeof value !== "number" || Number.isNaN(value)) return String(value);
  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString();
}

function buildError(message, title) {
  return {
    error: message,
    title,
    formula: null,
    summary: null,
    steps: [],
    visualWork: "",
    copyText: "",
  };
}

function percentToFactor(value) {
  return Number(value) / 100;
}

function buildWeldVolumeWork(inputs, decimals) {
  const weldType = inputs.weldType;
  const weldSize = parseFloat(inputs.weldSize);
  const weldLength = parseFloat(inputs.weldLength);
  const weldDepth = parseFloat(inputs.weldDepth || 0);
  const weldGap = parseFloat(inputs.weldGap || 0);
  const density = parseFloat(inputs.density || 0.2836);

  if (Number.isNaN(weldSize) || Number.isNaN(weldLength)) {
    return buildError(
      "Enter weld size and weld length for a weld volume estimate.",
      "Weld Volume"
    );
  }

  let area = 0;
  let formula = "";
  let steps = [];
  let visualWork = "";

  if (weldType === "fillet") {
    area = (weldSize * weldSize) / 2;
    formula = "Fillet Area = (Leg × Leg) ÷ 2, Volume = Area × Length";
    visualWork = `Fillet Weld Area
A = (${weldSize} × ${weldSize}) ÷ 2
A = ${formatNumber(area, decimals)} in²

Volume
V = ${formatNumber(area, decimals)} × ${weldLength}
V = ${formatNumber(area * weldLength, decimals)} in³`;

    steps = [
      `Fillet leg size = ${formatNumber(weldSize, decimals)} in`,
      `Area = (${weldSize} × ${weldSize}) ÷ 2 = ${formatNumber(area, decimals)} in²`,
      `Volume = ${formatNumber(area, decimals)} × ${formatNumber(weldLength, decimals)} = ${formatNumber(
        area * weldLength,
        decimals
      )} in³`,
    ];
  } else {
    if (Number.isNaN(weldDepth) || weldDepth <= 0) {
      return buildError(
        "Enter groove depth for groove weld estimation.",
        "Weld Volume"
      );
    }

    area = weldDepth * weldGap;
    formula = "Groove Area = Depth × Gap, Volume = Area × Length";
    visualWork = `Groove Weld Area
A = ${weldDepth} × ${weldGap}
A = ${formatNumber(area, decimals)} in²

Volume
V = ${formatNumber(area, decimals)} × ${weldLength}
V = ${formatNumber(area * weldLength, decimals)} in³`;

    steps = [
      `Groove depth = ${formatNumber(weldDepth, decimals)} in`,
      `Groove gap = ${formatNumber(weldGap, decimals)} in`,
      `Area = ${formatNumber(weldDepth, decimals)} × ${formatNumber(
        weldGap,
        decimals
      )} = ${formatNumber(area, decimals)} in²`,
      `Volume = ${formatNumber(area, decimals)} × ${formatNumber(weldLength, decimals)} = ${formatNumber(
        area * weldLength,
        decimals
      )} in³`,
    ];
  }

  const volume = area * weldLength;
  const estimatedWeight = volume * density;

  const fullVisual = `${visualWork}

Estimated Weld Metal Weight
W = ${formatNumber(volume, decimals)} × ${formatNumber(density, 4)}
W = ${formatNumber(estimatedWeight, decimals)} lb`;

  return {
    error: null,
    title: "Weld Volume",
    formula,
    summary: `Volume = ${formatNumber(volume, decimals)} in³ | Est. Weight = ${formatNumber(
      estimatedWeight,
      decimals
    )} lb`,
    steps: [
      ...steps,
      `Estimated weight = ${formatNumber(volume, decimals)} × ${formatNumber(
        density,
        4
      )} = ${formatNumber(estimatedWeight, decimals)} lb`,
    ],
    visualWork: fullVisual,
    copyText: fullVisual,
    result: volume,
    volume,
    estimatedWeight,
  };
}

function buildPaintCoverageWork(inputs, decimals) {
  const area = parseFloat(inputs.area);
  const coverageRate = parseFloat(inputs.coverageRate);
  const coats = parseFloat(inputs.coats);
  const wastePercent = parseFloat(inputs.wastePercent);

  if (
    Number.isNaN(area) ||
    Number.isNaN(coverageRate) ||
    Number.isNaN(coats) ||
    Number.isNaN(wastePercent)
  ) {
    return buildError(
      "Enter surface area, coverage rate, number of coats, and waste factor.",
      "Paint / Coating"
    );
  }

  const baseGallons = (area / coverageRate) * coats;
  const wasteFactor = 1 + percentToFactor(wastePercent);
  const totalGallons = baseGallons * wasteFactor;

  const visualWork = `Base Coating Need
Gallons = (${area} ÷ ${coverageRate}) × ${coats}
Gallons = ${formatNumber(baseGallons, decimals)}

Waste Factor
1 + (${wastePercent} ÷ 100)
= ${formatNumber(wasteFactor, decimals)}

Total Gallons
${formatNumber(baseGallons, decimals)} × ${formatNumber(wasteFactor, decimals)}
= ${formatNumber(totalGallons, decimals)} gal`;

  return {
    error: null,
    title: "Paint / Coating",
    formula: "Total = ((Area ÷ Coverage Rate) × Coats) × (1 + Waste %)",
    summary: `Estimated coating required = ${formatNumber(totalGallons, decimals)} gal`,
    steps: [
      `Base gallons = (${area} ÷ ${coverageRate}) × ${coats} = ${formatNumber(
        baseGallons,
        decimals
      )}`,
      `Waste factor = 1 + (${wastePercent} ÷ 100) = ${formatNumber(
        wasteFactor,
        decimals
      )}`,
      `Total gallons = ${formatNumber(baseGallons, decimals)} × ${formatNumber(
        wasteFactor,
        decimals
      )} = ${formatNumber(totalGallons, decimals)} gal`,
    ],
    visualWork,
    copyText: visualWork,
    result: totalGallons,
    totalGallons,
  };
}

function buildBoltSpacingWork(inputs, decimals) {
  const totalLength = parseFloat(inputs.totalLength);
  const holeCount = parseFloat(inputs.holeCount);
  const edgeDistance = parseFloat(inputs.edgeDistance);

  if (Number.isNaN(totalLength) || Number.isNaN(holeCount) || Number.isNaN(edgeDistance)) {
    return buildError(
      "Enter total length, number of holes, and edge distance.",
      "Bolt Spacing"
    );
  }

  if (holeCount < 2) {
    return buildError(
      "At least 2 holes are required to calculate center-to-center spacing.",
      "Bolt Spacing"
    );
  }

  const usableLength = totalLength - edgeDistance * 2;
  const spacingCount = holeCount - 1;

  if (usableLength <= 0) {
    return buildError(
      "Usable length must be greater than zero after subtracting edge distances.",
      "Bolt Spacing"
    );
  }

  const spacing = usableLength / spacingCount;

  const visualWork = `Usable Length
${totalLength} - (${edgeDistance} × 2)
= ${formatNumber(usableLength, decimals)}

Spacing Count
${holeCount} - 1
= ${formatNumber(spacingCount, 0)}

Center-to-Center Spacing
${formatNumber(usableLength, decimals)} ÷ ${formatNumber(spacingCount, 0)}
= ${formatNumber(spacing, decimals)} in`;

  return {
    error: null,
    title: "Bolt Spacing",
    formula: "Spacing = (Total Length - 2 × Edge Distance) ÷ (Hole Count - 1)",
    summary: `Center-to-center spacing = ${formatNumber(spacing, decimals)} in`,
    steps: [
      `Usable length = ${totalLength} - (${edgeDistance} × 2) = ${formatNumber(
        usableLength,
        decimals
      )}`,
      `Spacing count = ${holeCount} - 1 = ${formatNumber(spacingCount, 0)}`,
      `Spacing = ${formatNumber(usableLength, decimals)} ÷ ${formatNumber(
        spacingCount,
        0
      )} = ${formatNumber(spacing, decimals)} in`,
    ],
    visualWork,
    copyText: visualWork,
    result: spacing,
    spacing,
  };
}

function buildPlateLayoutWork(inputs, decimals) {
  const plateLength = parseFloat(inputs.plateLength);
  const plateWidth = parseFloat(inputs.plateWidth);
  const partLength = parseFloat(inputs.partLength);
  const partWidth = parseFloat(inputs.partWidth);

  if (
    Number.isNaN(plateLength) ||
    Number.isNaN(plateWidth) ||
    Number.isNaN(partLength) ||
    Number.isNaN(partWidth)
  ) {
    return buildError(
      "Enter plate length, plate width, part length, and part width.",
      "Plate Layout"
    );
  }

  if (partLength <= 0 || partWidth <= 0) {
    return buildError(
      "Part length and width must be greater than zero.",
      "Plate Layout"
    );
  }

  const partsAlongLength = Math.floor(plateLength / partLength);
  const partsAlongWidth = Math.floor(plateWidth / partWidth);
  const quantity = partsAlongLength * partsAlongWidth;

  const usedLength = partsAlongLength * partLength;
  const usedWidth = partsAlongWidth * partWidth;
  const scrapLength = plateLength - usedLength;
  const scrapWidth = plateWidth - usedWidth;

  const plateArea = plateLength * plateWidth;
  const usedArea = quantity * partLength * partWidth;
  const yieldPercent = plateArea > 0 ? (usedArea / plateArea) * 100 : 0;

  const visualWork = `Parts Along Length
floor(${plateLength} ÷ ${partLength})
= ${partsAlongLength}

Parts Along Width
floor(${plateWidth} ÷ ${partWidth})
= ${partsAlongWidth}

Quantity Per Plate
${partsAlongLength} × ${partsAlongWidth}
= ${quantity}

Yield
(${usedArea} ÷ ${plateArea}) × 100
= ${formatNumber(yieldPercent, decimals)}%`;

  return {
    error: null,
    title: "Plate Layout",
    formula:
      "Quantity = floor(Plate Length ÷ Part Length) × floor(Plate Width ÷ Part Width)",
    summary: `${quantity} parts/plate | Yield = ${formatNumber(yieldPercent, decimals)}%`,
    steps: [
      `Parts along length = floor(${plateLength} ÷ ${partLength}) = ${partsAlongLength}`,
      `Parts along width = floor(${plateWidth} ÷ ${partWidth}) = ${partsAlongWidth}`,
      `Quantity per plate = ${partsAlongLength} × ${partsAlongWidth} = ${quantity}`,
      `Scrap length = ${plateLength} - ${usedLength} = ${formatNumber(
        scrapLength,
        decimals
      )} in`,
      `Scrap width = ${plateWidth} - ${usedWidth} = ${formatNumber(
        scrapWidth,
        decimals
      )} in`,
      `Yield = (${usedArea} ÷ ${plateArea}) × 100 = ${formatNumber(
        yieldPercent,
        decimals
      )}%`,
    ],
    visualWork,
    copyText: visualWork,
    result: quantity,
    quantity,
    yieldPercent,
    scrapLength,
    scrapWidth,
  };
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
  );

  const dots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 7.3) % 88)}%`,
        top: `${10 + ((i * 9.7) % 65)}%`,
        delay: `${(i % 8) * 0.5}s`,
      })),
    []
  );

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
  );

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
  );
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
  );
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
  );
}

function FooterStatusPanel({
  mode,
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
            <p className="mt-3 text-xl font-semibold text-white capitalize">
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
              Precision
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {decimals} Decimals
            </p>
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
  );
}

export default function CustomTradeCalculator() {
  const [mode, setMode] = useState("weld");
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [decimals, setDecimals] = useState(4);

  const [inputs, setInputs] = useState({
    weldType: "fillet",
    weldSize: "",
    weldLength: "",
    weldDepth: "",
    weldGap: "",
    density: "0.2836",

    area: "",
    coverageRate: "",
    coats: "",
    wastePercent: "",

    totalLength: "",
    holeCount: "",
    edgeDistance: "",

    plateLength: "",
    plateWidth: "",
    partLength: "",
    partWidth: "",
  });

  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const calculate = () => {
    if (mode === "weld") {
      setResultData(buildWeldVolumeWork(inputs, decimals));
      return;
    }

    if (mode === "paint") {
      setResultData(buildPaintCoverageWork(inputs, decimals));
      return;
    }

    if (mode === "bolt") {
      setResultData(buildBoltSpacingWork(inputs, decimals));
      return;
    }

    if (mode === "plate") {
      setResultData(buildPlateLayoutWork(inputs, decimals));
    }
  };

  const clearAll = () => {
    setInputs({
      weldType: "fillet",
      weldSize: "",
      weldLength: "",
      weldDepth: "",
      weldGap: "",
      density: "0.2836",
      area: "",
      coverageRate: "",
      coats: "",
      wastePercent: "",
      totalLength: "",
      holeCount: "",
      edgeDistance: "",
      plateLength: "",
      plateWidth: "",
      partLength: "",
      partWidth: "",
    });
    setResultData(null);
  };

  const loadExample = (type) => {
    if (type === "weld") {
      setMode("weld");
      setInputs((prev) => ({
        ...prev,
        weldType: "fillet",
        weldSize: "0.25",
        weldLength: "48",
        weldDepth: "",
        weldGap: "",
        density: "0.2836",
      }));
      setResultData(null);
    }

    if (type === "paint") {
      setMode("paint");
      setInputs((prev) => ({
        ...prev,
        area: "1250",
        coverageRate: "350",
        coats: "2",
        wastePercent: "12",
      }));
      setResultData(null);
    }

    if (type === "bolt") {
      setMode("bolt");
      setInputs((prev) => ({
        ...prev,
        totalLength: "96",
        holeCount: "6",
        edgeDistance: "2",
      }));
      setResultData(null);
    }

    if (type === "plate") {
      setMode("plate");
      setInputs((prev) => ({
        ...prev,
        plateLength: "120",
        plateWidth: "60",
        partLength: "18",
        partWidth: "14",
      }));
      setResultData(null);
    }
  };

  const copyResult = async () => {
    if (!resultData?.summary) return;
    await navigator.clipboard.writeText(resultData.summary);
  };

  const copySteps = async () => {
    if (!resultData?.copyText) return;
    await navigator.clipboard.writeText(resultData.copyText);
  };

  const helperText =
    mode === "weld"
      ? "Estimate weld metal volume and rough weld weight from weld size, length, and groove geometry."
      : mode === "paint"
      ? "Estimate coating quantity from surface area, spread rate, coats, and waste factor."
      : mode === "bolt"
      ? "Calculate equal center-to-center spacing from total length, hole count, and edge distance."
      : "Estimate parts per plate, yield, and leftover scrap from plate and part dimensions.";

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Trade Utility Calculator | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Trade Utility Calculator for weld volume, paint coverage, bolt spacing, and plate layout calculations with worked formulas and visible steps."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta
          property="og:title"
          content="Trade Utility Calculator | RuntWerkx"
        />
        <meta
          property="og:description"
          content="Trade utility calculator with weld volume, paint coverage, bolt spacing, and plate layout tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Trade Utility Calculator | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Trade utility calculator with weld volume, paint coverage, bolt spacing, and plate layout tools."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RuntWerkx Trade Utility Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            url: PAGE_URL,
            description:
              "Trade utility calculator for weld volume, paint coverage, bolt spacing, and plate layout with worked formulas and visible steps.",
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
              Trade Utility Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Solve practical trade and fabrication calculations with full
              visibility into the formula, the work, and the final result.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Built for weld estimates, coating calculations, bolt layout, plate
              yield, and other trade-focused math that needs to be easy to
              verify.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setMode("weld")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "weld"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Weld Volume
              </button>
              <button
                onClick={() => setMode("paint")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "paint"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Paint / Coating
              </button>
              <button
                onClick={() => setMode("bolt")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "bolt"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Bolt Spacing
              </button>
              <button
                onClick={() => setMode("plate")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "plate"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Plate Layout
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
                onClick={() => loadExample("weld")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Weld Example
              </button>
              <button
                onClick={() => loadExample("paint")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Paint Example
              </button>
              <button
                onClick={() => loadExample("bolt")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Bolt Example
              </button>
              <button
                onClick={() => loadExample("plate")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Plate Example
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
                  Trade Utility Workstation
                  {showTooltips && <TooltipBubble text={helperText} />}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Mode-based trade input with room to work through the math
                  cleanly.
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
                  {mode === "weld" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Weld Utility ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Weld Volume Calculator
                          {showTooltips && (
                            <TooltipBubble text="Estimate fillet or groove weld metal volume and rough weld weight." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={inputs.weldType}
                          onChange={(e) => handleChange("weldType", e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="fillet">Fillet Weld</option>
                          <option value="groove">Groove Weld</option>
                        </select>

                        <div className="grid gap-6 md:grid-cols-2">
                          <input
                            type="number"
                            value={inputs.weldSize}
                            onChange={(e) => handleChange("weldSize", e.target.value)}
                            placeholder="Weld size / leg"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                          <input
                            type="number"
                            value={inputs.weldLength}
                            onChange={(e) => handleChange("weldLength", e.target.value)}
                            placeholder="Weld length"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                        </div>

                        {inputs.weldType === "groove" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={inputs.weldDepth}
                              onChange={(e) => handleChange("weldDepth", e.target.value)}
                              placeholder="Groove depth"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={inputs.weldGap}
                              onChange={(e) => handleChange("weldGap", e.target.value)}
                              placeholder="Groove gap"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        <input
                          type="number"
                          value={inputs.density}
                          onChange={(e) => handleChange("density", e.target.value)}
                          placeholder="Material density lb/in³"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mode === "paint" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Coating Utility ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Paint / Coating Calculator
                          {showTooltips && (
                            <TooltipBubble text="Estimate coating quantity from area, spread rate, coats, and waste factor." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <input
                          type="number"
                          value={inputs.area}
                          onChange={(e) => handleChange("area", e.target.value)}
                          placeholder="Surface area (sq ft)"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.coverageRate}
                          onChange={(e) => handleChange("coverageRate", e.target.value)}
                          placeholder="Coverage rate (sq ft / gal)"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.coats}
                          onChange={(e) => handleChange("coats", e.target.value)}
                          placeholder="Number of coats"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.wastePercent}
                          onChange={(e) => handleChange("wastePercent", e.target.value)}
                          placeholder="Waste factor (%)"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mode === "bolt" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Layout Utility ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Bolt Spacing Calculator
                          {showTooltips && (
                            <TooltipBubble text="Calculate equal center-to-center spacing from total length, hole count, and edge distance." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <input
                          type="number"
                          value={inputs.totalLength}
                          onChange={(e) => handleChange("totalLength", e.target.value)}
                          placeholder="Total length"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.holeCount}
                          onChange={(e) => handleChange("holeCount", e.target.value)}
                          placeholder="Number of holes"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.edgeDistance}
                          onChange={(e) => handleChange("edgeDistance", e.target.value)}
                          placeholder="Edge distance"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mode === "plate" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Plate Utility ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Plate Layout Calculator
                          {showTooltips && (
                            <TooltipBubble text="Estimate parts per plate, yield percentage, and leftover scrap dimensions." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <input
                          type="number"
                          value={inputs.plateLength}
                          onChange={(e) => handleChange("plateLength", e.target.value)}
                          placeholder="Plate length"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.plateWidth}
                          onChange={(e) => handleChange("plateWidth", e.target.value)}
                          placeholder="Plate width"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.partLength}
                          onChange={(e) => handleChange("partLength", e.target.value)}
                          placeholder="Part length"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                        <input
                          type="number"
                          value={inputs.partWidth}
                          onChange={(e) => handleChange("partWidth", e.target.value)}
                          placeholder="Part width"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

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

            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Show The Work ―
                </p>
                <h2 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                  Worked Solution Output
                  {showTooltips && (
                    <TooltipBubble text="This panel shows the formula, worked steps, and final answer for the selected trade utility mode." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, visible steps, worked lines, and a cleaner answer
                  trail for real trade calculations.
                </p>
              </div>

              <div className="min-h-[820px] rounded-[2.3rem] bg-zinc-950/55 p-8 backdrop-blur-sm">
                {!resultData ? (
                  <div className="flex min-h-[740px] items-center justify-center text-center text-zinc-500">
                    Enter values and click calculate to see the worked solution.
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

                    {typeof resultData.volume === "number" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Volume
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {formatNumber(resultData.volume, decimals)} in³
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Estimated Weight
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof resultData.estimatedWeight === "number"
                              ? `${formatNumber(resultData.estimatedWeight, decimals)} lb`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {typeof resultData.totalGallons === "number" && (
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Total Coating Required
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(resultData.totalGallons, decimals)} gal
                        </p>
                      </div>
                    )}

                    {typeof resultData.spacing === "number" && (
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Center-to-Center Spacing
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(resultData.spacing, decimals)} in
                        </p>
                      </div>
                    )}

                    {(typeof resultData.quantity === "number" ||
                      typeof resultData.yieldPercent === "number") && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Quantity Per Plate
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof resultData.quantity === "number"
                              ? formatNumber(resultData.quantity, 0)
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Yield
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof resultData.yieldPercent === "number"
                              ? `${formatNumber(resultData.yieldPercent, decimals)}%`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {(typeof resultData.scrapLength === "number" ||
                      typeof resultData.scrapWidth === "number") && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Scrap Length
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof resultData.scrapLength === "number"
                              ? `${formatNumber(resultData.scrapLength, decimals)} in`
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Scrap Width
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {typeof resultData.scrapWidth === "number"
                              ? `${formatNumber(resultData.scrapWidth, decimals)} in`
                              : "-"}
                          </p>
                        </div>
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
                Built for practical trade and fabrication support work
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This trade utility calculator is designed to cover practical
                shop, fabrication, layout, and field support math that does not
                always fit into a single narrow tool. Use it for weld volume
                estimates, paint and coating coverage, bolt spacing layout, and
                plate layout yield checks with visible formulas and worked
                output that is easier to verify on the fly.
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
                  to="/knowledge-library/calculators-charts-conversions/area-volume-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Area & Volume Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/production-rate-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Production Rate Calculator
                </Link>

                <Link
                  to="/knowledge-library/calculators-charts-conversions/pipe-tank-fill-calculator"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Pipe / Tank Fill Calculator
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
            resultData={resultData}
          />
        </div>
      </section>
    </div>
  );
}