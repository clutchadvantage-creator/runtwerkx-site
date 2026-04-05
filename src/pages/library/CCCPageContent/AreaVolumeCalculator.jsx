import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/area-volume-calculator";

const RANDOM_TECH_TEXT = [
  "RWX",
  "AREA",
  "VOL",
  "GRID",
  "FLOW",
  "X7",
  "DATA",
  "NODE",
  "MATH",
  "FORM",
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

function normalizeUnit(unit) {
  return unit || "units";
}

function squaredUnit(unit) {
  return `${normalizeUnit(unit)}²`;
}

function cubedUnit(unit) {
  return `${normalizeUnit(unit)}³`;
}

function buildAreaWork(shape, inputs, decimals, unit) {
  const u2 = squaredUnit(unit);

  if (shape === "rectangle") {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);

    if (Number.isNaN(length) || Number.isNaN(width)) {
      return buildError("Enter both length and width for a rectangle area calculation.", "Area");
    }

    const result = length * width;
    const visual = `Rectangle Area
A = L × W
A = ${length} × ${width}
A = ${formatNumber(result, decimals)} ${u2}`;

    return {
      error: null,
      title: "Area",
      formula: "A = L × W",
      summary: `Rectangle area = ${formatNumber(result, decimals)} ${u2}`,
      steps: [
        `Length = ${formatNumber(length, decimals)} ${normalizeUnit(unit)}`,
        `Width = ${formatNumber(width, decimals)} ${normalizeUnit(unit)}`,
        `${length} × ${width} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "triangle") {
    const base = parseFloat(inputs.base);
    const height = parseFloat(inputs.height);

    if (Number.isNaN(base) || Number.isNaN(height)) {
      return buildError("Enter both base and height for a triangle area calculation.", "Area");
    }

    const result = 0.5 * base * height;
    const visual = `Triangle Area
A = (B × H) ÷ 2
A = (${base} × ${height}) ÷ 2
A = ${base * height} ÷ 2
A = ${formatNumber(result, decimals)} ${u2}`;

    return {
      error: null,
      title: "Area",
      formula: "A = (B × H) ÷ 2",
      summary: `Triangle area = ${formatNumber(result, decimals)} ${u2}`,
      steps: [
        `Base = ${formatNumber(base, decimals)} ${normalizeUnit(unit)}`,
        `Height = ${formatNumber(height, decimals)} ${normalizeUnit(unit)}`,
        `${base} × ${height} = ${formatNumber(base * height, decimals)}`,
        `${formatNumber(base * height, decimals)} ÷ 2 = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "circle") {
    const radius = parseFloat(inputs.radius);

    if (Number.isNaN(radius)) {
      return buildError("Enter the radius for a circle area calculation.", "Area");
    }

    const result = Math.PI * radius * radius;
    const visual = `Circle Area
A = πr²
A = π × ${radius}²
A = π × ${formatNumber(radius * radius, decimals)}
A = ${formatNumber(result, decimals)} ${u2}`;

    return {
      error: null,
      title: "Area",
      formula: "A = πr²",
      summary: `Circle area = ${formatNumber(result, decimals)} ${u2}`,
      steps: [
        `Radius = ${formatNumber(radius, decimals)} ${normalizeUnit(unit)}`,
        `${radius}² = ${formatNumber(radius * radius, decimals)}`,
        `π × ${formatNumber(radius * radius, decimals)} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "trapezoid") {
    const baseA = parseFloat(inputs.baseA);
    const baseB = parseFloat(inputs.baseB);
    const height = parseFloat(inputs.height);

    if (Number.isNaN(baseA) || Number.isNaN(baseB) || Number.isNaN(height)) {
      return buildError("Enter both bases and the height for a trapezoid area calculation.", "Area");
    }

    const result = ((baseA + baseB) / 2) * height;
    const visual = `Trapezoid Area
A = ((a + b) ÷ 2) × h
A = ((${baseA} + ${baseB}) ÷ 2) × ${height}
A = (${formatNumber(baseA + baseB, decimals)} ÷ 2) × ${height}
A = ${formatNumber((baseA + baseB) / 2, decimals)} × ${height}
A = ${formatNumber(result, decimals)} ${u2}`;

    return {
      error: null,
      title: "Area",
      formula: "A = ((a + b) ÷ 2) × h",
      summary: `Trapezoid area = ${formatNumber(result, decimals)} ${u2}`,
      steps: [
        `Base a = ${formatNumber(baseA, decimals)} ${normalizeUnit(unit)}`,
        `Base b = ${formatNumber(baseB, decimals)} ${normalizeUnit(unit)}`,
        `Height = ${formatNumber(height, decimals)} ${normalizeUnit(unit)}`,
        `${baseA} + ${baseB} = ${formatNumber(baseA + baseB, decimals)}`,
        `${formatNumber(baseA + baseB, decimals)} ÷ 2 = ${formatNumber((baseA + baseB) / 2, decimals)}`,
        `${formatNumber((baseA + baseB) / 2, decimals)} × ${height} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  return buildError("Select a valid area shape.", "Area");
}

function buildPerimeterWork(shape, inputs, decimals, unit) {
  const u = normalizeUnit(unit);

  if (shape === "rectangle") {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);

    if (Number.isNaN(length) || Number.isNaN(width)) {
      return buildError("Enter both length and width for a rectangle perimeter calculation.", "Perimeter");
    }

    const result = 2 * (length + width);
    const visual = `Rectangle Perimeter
P = 2(L + W)
P = 2(${length} + ${width})
P = 2(${formatNumber(length + width, decimals)})
P = ${formatNumber(result, decimals)} ${u}`;

    return {
      error: null,
      title: "Perimeter",
      formula: "P = 2(L + W)",
      summary: `Rectangle perimeter = ${formatNumber(result, decimals)} ${u}`,
      steps: [
        `Length = ${formatNumber(length, decimals)} ${u}`,
        `Width = ${formatNumber(width, decimals)} ${u}`,
        `${length} + ${width} = ${formatNumber(length + width, decimals)}`,
        `2 × ${formatNumber(length + width, decimals)} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "triangle") {
    const sideA = parseFloat(inputs.sideA);
    const sideB = parseFloat(inputs.sideB);
    const sideC = parseFloat(inputs.sideC);

    if (Number.isNaN(sideA) || Number.isNaN(sideB) || Number.isNaN(sideC)) {
      return buildError("Enter all three triangle side lengths for a perimeter calculation.", "Perimeter");
    }

    const result = sideA + sideB + sideC;
    const visual = `Triangle Perimeter
P = a + b + c
P = ${sideA} + ${sideB} + ${sideC}
P = ${formatNumber(result, decimals)} ${u}`;

    return {
      error: null,
      title: "Perimeter",
      formula: "P = a + b + c",
      summary: `Triangle perimeter = ${formatNumber(result, decimals)} ${u}`,
      steps: [
        `Side a = ${formatNumber(sideA, decimals)} ${u}`,
        `Side b = ${formatNumber(sideB, decimals)} ${u}`,
        `Side c = ${formatNumber(sideC, decimals)} ${u}`,
        `${sideA} + ${sideB} + ${sideC} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "circle") {
    const radius = parseFloat(inputs.radius);

    if (Number.isNaN(radius)) {
      return buildError("Enter the radius for a circle circumference calculation.", "Perimeter");
    }

    const result = 2 * Math.PI * radius;
    const visual = `Circle Circumference
C = 2πr
C = 2 × π × ${radius}
C = ${formatNumber(result, decimals)} ${u}`;

    return {
      error: null,
      title: "Perimeter",
      formula: "C = 2πr",
      summary: `Circle circumference = ${formatNumber(result, decimals)} ${u}`,
      steps: [
        `Radius = ${formatNumber(radius, decimals)} ${u}`,
        `2 × π × ${radius} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  return buildError("Select a valid perimeter shape.", "Perimeter");
}

function buildVolumeWork(shape, inputs, decimals, unit) {
  const u3 = cubedUnit(unit);

  if (shape === "box") {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);

    if (Number.isNaN(length) || Number.isNaN(width) || Number.isNaN(height)) {
      return buildError("Enter length, width, and height for a box volume calculation.", "Volume");
    }

    const result = length * width * height;
    const visual = `Box Volume
V = L × W × H
V = ${length} × ${width} × ${height}
V = ${formatNumber(result, decimals)} ${u3}`;

    return {
      error: null,
      title: "Volume",
      formula: "V = L × W × H",
      summary: `Box volume = ${formatNumber(result, decimals)} ${u3}`,
      steps: [
        `Length = ${formatNumber(length, decimals)} ${normalizeUnit(unit)}`,
        `Width = ${formatNumber(width, decimals)} ${normalizeUnit(unit)}`,
        `Height = ${formatNumber(height, decimals)} ${normalizeUnit(unit)}`,
        `${length} × ${width} × ${height} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "cylinder") {
    const radius = parseFloat(inputs.radius);
    const height = parseFloat(inputs.height);

    if (Number.isNaN(radius) || Number.isNaN(height)) {
      return buildError("Enter radius and height for a cylinder volume calculation.", "Volume");
    }

    const result = Math.PI * radius * radius * height;
    const visual = `Cylinder Volume
V = πr²h
V = π × ${radius}² × ${height}
V = π × ${formatNumber(radius * radius, decimals)} × ${height}
V = ${formatNumber(result, decimals)} ${u3}`;

    return {
      error: null,
      title: "Volume",
      formula: "V = πr²h",
      summary: `Cylinder volume = ${formatNumber(result, decimals)} ${u3}`,
      steps: [
        `Radius = ${formatNumber(radius, decimals)} ${normalizeUnit(unit)}`,
        `Height = ${formatNumber(height, decimals)} ${normalizeUnit(unit)}`,
        `${radius}² = ${formatNumber(radius * radius, decimals)}`,
        `π × ${formatNumber(radius * radius, decimals)} × ${height} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "sphere") {
    const radius = parseFloat(inputs.radius);

    if (Number.isNaN(radius)) {
      return buildError("Enter the radius for a sphere volume calculation.", "Volume");
    }

    const result = (4 / 3) * Math.PI * radius * radius * radius;
    const visual = `Sphere Volume
V = (4 ÷ 3)πr³
V = (4 ÷ 3) × π × ${radius}³
V = (4 ÷ 3) × π × ${formatNumber(radius * radius * radius, decimals)}
V = ${formatNumber(result, decimals)} ${u3}`;

    return {
      error: null,
      title: "Volume",
      formula: "V = (4/3)πr³",
      summary: `Sphere volume = ${formatNumber(result, decimals)} ${u3}`,
      steps: [
        `Radius = ${formatNumber(radius, decimals)} ${normalizeUnit(unit)}`,
        `${radius}³ = ${formatNumber(radius * radius * radius, decimals)}`,
        `(4 ÷ 3) × π × ${formatNumber(radius * radius * radius, decimals)} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (shape === "cone") {
    const radius = parseFloat(inputs.radius);
    const height = parseFloat(inputs.height);

    if (Number.isNaN(radius) || Number.isNaN(height)) {
      return buildError("Enter radius and height for a cone volume calculation.", "Volume");
    }

    const result = (1 / 3) * Math.PI * radius * radius * height;
    const visual = `Cone Volume
V = (1 ÷ 3)πr²h
V = (1 ÷ 3) × π × ${radius}² × ${height}
V = (1 ÷ 3) × π × ${formatNumber(radius * radius, decimals)} × ${height}
V = ${formatNumber(result, decimals)} ${u3}`;

    return {
      error: null,
      title: "Volume",
      formula: "V = (1/3)πr²h",
      summary: `Cone volume = ${formatNumber(result, decimals)} ${u3}`,
      steps: [
        `Radius = ${formatNumber(radius, decimals)} ${normalizeUnit(unit)}`,
        `Height = ${formatNumber(height, decimals)} ${normalizeUnit(unit)}`,
        `${radius}² = ${formatNumber(radius * radius, decimals)}`,
        `(1 ÷ 3) × π × ${formatNumber(radius * radius, decimals)} × ${height} = ${formatNumber(result, decimals)}`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  return buildError("Select a valid volume shape.", "Volume");
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

export default function AreaVolumeCalculator() {
  const [mode, setMode] = useState("area");
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [decimals, setDecimals] = useState(4);

  const [unit, setUnit] = useState("in");

  const [areaShape, setAreaShape] = useState("rectangle");
  const [perimeterShape, setPerimeterShape] = useState("rectangle");
  const [volumeShape, setVolumeShape] = useState("box");

  const [areaInputs, setAreaInputs] = useState({
    length: "",
    width: "",
    base: "",
    height: "",
    radius: "",
    baseA: "",
    baseB: "",
  });

  const [perimeterInputs, setPerimeterInputs] = useState({
    length: "",
    width: "",
    radius: "",
    sideA: "",
    sideB: "",
    sideC: "",
  });

  const [volumeInputs, setVolumeInputs] = useState({
    length: "",
    width: "",
    height: "",
    radius: "",
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

  const updateAreaInput = (key, value) => {
    setAreaInputs((prev) => ({ ...prev, [key]: value }));
  };

  const updatePerimeterInput = (key, value) => {
    setPerimeterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const updateVolumeInput = (key, value) => {
    setVolumeInputs((prev) => ({ ...prev, [key]: value }));
  };

  const calculate = () => {
    if (mode === "area") {
      setResultData(buildAreaWork(areaShape, areaInputs, decimals, unit));
      return;
    }

    if (mode === "perimeter") {
      setResultData(buildPerimeterWork(perimeterShape, perimeterInputs, decimals, unit));
      return;
    }

    if (mode === "volume") {
      setResultData(buildVolumeWork(volumeShape, volumeInputs, decimals, unit));
    }
  };

  const clearAll = () => {
    setAreaInputs({
      length: "",
      width: "",
      base: "",
      height: "",
      radius: "",
      baseA: "",
      baseB: "",
    });
    setPerimeterInputs({
      length: "",
      width: "",
      radius: "",
      sideA: "",
      sideB: "",
      sideC: "",
    });
    setVolumeInputs({
      length: "",
      width: "",
      height: "",
      radius: "",
    });
    setResultData(null);
  };

  const loadExample = (type) => {
    if (type === "area") {
      setMode("area");
      setAreaShape("rectangle");
      setAreaInputs({
        length: "24",
        width: "18",
        base: "",
        height: "",
        radius: "",
        baseA: "",
        baseB: "",
      });
      setResultData(null);
    }

    if (type === "perimeter") {
      setMode("perimeter");
      setPerimeterShape("triangle");
      setPerimeterInputs({
        length: "",
        width: "",
        radius: "",
        sideA: "12",
        sideB: "15",
        sideC: "19",
      });
      setResultData(null);
    }

    if (type === "volume") {
      setMode("volume");
      setVolumeShape("cylinder");
      setVolumeInputs({
        length: "",
        width: "",
        height: "36",
        radius: "8",
      });
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

  const currentModeTitle =
    mode === "area"
      ? "Area"
      : mode === "perimeter"
      ? "Perimeter"
      : "Volume";

  const helperText =
    mode === "area"
      ? "Calculate area for common shapes with visible formulas and worked steps."
      : mode === "perimeter"
      ? "Calculate perimeter and circumference with a clearer work trail."
      : "Calculate volume for common solids with full worked output.";

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Area & Volume Calculator With Steps | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Area & Volume Calculator to calculate area, perimeter, circumference, and volume with worked formulas and visible step-by-step output."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta
          property="og:title"
          content="Area & Volume Calculator With Steps | RuntWerkx"
        />
        <meta
          property="og:description"
          content="Calculate area, perimeter, circumference, and volume with visible formulas and worked solution output."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Area & Volume Calculator With Steps | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Calculate area, perimeter, circumference, and volume with visible formulas and worked solution output."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RuntWerkx Area & Volume Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            url: PAGE_URL,
            description:
              "Area and volume calculator with visible formulas, step-by-step worked output, and shape-based geometry workflows.",
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
              Area & Volume Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Calculate area, perimeter, circumference, and volume with full
              visibility into the formula, the work, and the final result.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Built for layout work, estimating, planning, fabrication math,
              field checks, and general geometry calculations that need to be
              easy to verify.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setMode("area")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "area"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setMode("perimeter")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "perimeter"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Perimeter
              </button>
              <button
                onClick={() => setMode("volume")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "volume"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Volume
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
                onClick={() => loadExample("area")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Area Example
              </button>
              <button
                onClick={() => loadExample("perimeter")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Perimeter Example
              </button>
              <button
                onClick={() => loadExample("volume")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Volume Example
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

                  <div className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2.5 text-sm text-zinc-300">
                    <span className="mr-3">Units</span>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="bg-transparent text-white outline-none"
                    >
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="yd">yd</option>
                      <option value="units">units</option>
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
                  Shape-based geometry input with room to work through the math
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
                  {mode === "area" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Area Workstation ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Area Calculator
                          {showTooltips && (
                            <TooltipBubble text="Calculate area for rectangle, triangle, circle, and trapezoid." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={areaShape}
                          onChange={(e) => setAreaShape(e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="rectangle">Rectangle</option>
                          <option value="triangle">Triangle</option>
                          <option value="circle">Circle</option>
                          <option value="trapezoid">Trapezoid</option>
                        </select>

                        {areaShape === "rectangle" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={areaInputs.length}
                              onChange={(e) => updateAreaInput("length", e.target.value)}
                              placeholder="Length"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={areaInputs.width}
                              onChange={(e) => updateAreaInput("width", e.target.value)}
                              placeholder="Width"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {areaShape === "triangle" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={areaInputs.base}
                              onChange={(e) => updateAreaInput("base", e.target.value)}
                              placeholder="Base"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={areaInputs.height}
                              onChange={(e) => updateAreaInput("height", e.target.value)}
                              placeholder="Height"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {areaShape === "circle" && (
                          <input
                            type="number"
                            value={areaInputs.radius}
                            onChange={(e) => updateAreaInput("radius", e.target.value)}
                            placeholder="Radius"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                        )}

                        {areaShape === "trapezoid" && (
                          <div className="grid gap-6 md:grid-cols-3">
                            <input
                              type="number"
                              value={areaInputs.baseA}
                              onChange={(e) => updateAreaInput("baseA", e.target.value)}
                              placeholder="Base a"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={areaInputs.baseB}
                              onChange={(e) => updateAreaInput("baseB", e.target.value)}
                              placeholder="Base b"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={areaInputs.height}
                              onChange={(e) => updateAreaInput("height", e.target.value)}
                              placeholder="Height"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {mode === "perimeter" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Perimeter Workstation ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Perimeter Calculator
                          {showTooltips && (
                            <TooltipBubble text="Calculate rectangle perimeter, triangle perimeter, or circle circumference." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={perimeterShape}
                          onChange={(e) => setPerimeterShape(e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="rectangle">Rectangle</option>
                          <option value="triangle">Triangle</option>
                          <option value="circle">Circle</option>
                        </select>

                        {perimeterShape === "rectangle" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={perimeterInputs.length}
                              onChange={(e) => updatePerimeterInput("length", e.target.value)}
                              placeholder="Length"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={perimeterInputs.width}
                              onChange={(e) => updatePerimeterInput("width", e.target.value)}
                              placeholder="Width"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {perimeterShape === "triangle" && (
                          <div className="grid gap-6 md:grid-cols-3">
                            <input
                              type="number"
                              value={perimeterInputs.sideA}
                              onChange={(e) => updatePerimeterInput("sideA", e.target.value)}
                              placeholder="Side a"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={perimeterInputs.sideB}
                              onChange={(e) => updatePerimeterInput("sideB", e.target.value)}
                              placeholder="Side b"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={perimeterInputs.sideC}
                              onChange={(e) => updatePerimeterInput("sideC", e.target.value)}
                              placeholder="Side c"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {perimeterShape === "circle" && (
                          <input
                            type="number"
                            value={perimeterInputs.radius}
                            onChange={(e) => updatePerimeterInput("radius", e.target.value)}
                            placeholder="Radius"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {mode === "volume" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Volume Workstation ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Volume Calculator
                          {showTooltips && (
                            <TooltipBubble text="Calculate box, cylinder, sphere, and cone volume with visible worked steps." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={volumeShape}
                          onChange={(e) => setVolumeShape(e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="box">Box / Rectangular Prism</option>
                          <option value="cylinder">Cylinder</option>
                          <option value="sphere">Sphere</option>
                          <option value="cone">Cone</option>
                        </select>

                        {volumeShape === "box" && (
                          <div className="grid gap-6 md:grid-cols-3">
                            <input
                              type="number"
                              value={volumeInputs.length}
                              onChange={(e) => updateVolumeInput("length", e.target.value)}
                              placeholder="Length"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={volumeInputs.width}
                              onChange={(e) => updateVolumeInput("width", e.target.value)}
                              placeholder="Width"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={volumeInputs.height}
                              onChange={(e) => updateVolumeInput("height", e.target.value)}
                              placeholder="Height"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {volumeShape === "cylinder" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={volumeInputs.radius}
                              onChange={(e) => updateVolumeInput("radius", e.target.value)}
                              placeholder="Radius"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={volumeInputs.height}
                              onChange={(e) => updateVolumeInput("height", e.target.value)}
                              placeholder="Height"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}

                        {volumeShape === "sphere" && (
                          <input
                            type="number"
                            value={volumeInputs.radius}
                            onChange={(e) => updateVolumeInput("radius", e.target.value)}
                            placeholder="Radius"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                        )}

                        {volumeShape === "cone" && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <input
                              type="number"
                              value={volumeInputs.radius}
                              onChange={(e) => updateVolumeInput("radius", e.target.value)}
                              placeholder="Radius"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                            <input
                              type="number"
                              value={volumeInputs.height}
                              onChange={(e) => updateVolumeInput("height", e.target.value)}
                              placeholder="Height"
                              className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                            />
                          </div>
                        )}
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
                    <TooltipBubble text="This panel shows the formula, the work trail, and the final result in a clearer format." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, visible steps, worked lines, and a cleaner answer
                  trail.
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
                        <pre className="whitespace-pre-wrap break-words font-mono text-[28px] leading-[1.9] text-zinc-100 md:text-[32px]">
                          {resultData.visualWork}
                        </pre>
                      </div>
                    </div>

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
                Built for practical geometry and layout work
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This calculator is designed for real-world geometry work where
                the formula needs to be visible and the steps need to be easy to
                follow. Use it for area checks, perimeter and circumference
                checks, and volume calculations for common shapes.
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