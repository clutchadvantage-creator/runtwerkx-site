import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const RANDOM_TECH_TEXT = [
  "RWX",
  "FLOW",
  "1011",
  "SYNC",
  "A1",
  "PWR",
  "DATA",
  "X7",
  "42",
  "GRID",
  "CLK",
  "0xA",
  "RT",
  "NODE",
];

const AISC_SHAPES_DATABASE_URL =
  "https://www.aisc.org/aisc/publications/steel-construction-manual/aisc-shapes-database-v160/";
const AISC_DIMENSION_TOOL_URL =
  "https://www.aisc.org/aisc/explore-aisc/structural-steel-dimensioning-tool/";

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/material-weight-calculator";

const MATERIALS = {
  steel: {
    label: "Steel",
    densityLbPerIn3: 0.2836,
    group: "metal",
    trustNote: "Standard engineering density",
  },
  stainless: {
    label: "Stainless Steel",
    densityLbPerIn3: 0.289,
    group: "metal",
    trustNote: "Standard engineering density",
  },
  aluminum: {
    label: "Aluminum",
    densityLbPerIn3: 0.0975,
    group: "metal",
    trustNote: "Standard engineering density",
  },
  pine: {
    label: "Pine / Softwood",
    densityLbPerIn3: 0.0208,
    group: "wood",
    trustNote: "Estimated wood density",
  },
  oak: {
    label: "Oak / Hardwood",
    densityLbPerIn3: 0.0434,
    group: "wood",
    trustNote: "Estimated wood density",
  },
  treated: {
    label: "Pressure Treated Lumber",
    densityLbPerIn3: 0.0295,
    group: "wood",
    trustNote: "Estimated wood density",
  },
};

const SHAPES = {
  plate: "Plate / Flat",
  round: "Round Bar",
  square: "Square / Rectangular Bar",
  pipe: "Pipe",
  tube: "Tube / Rectangular Tube",
  beam: "Beam",
  channel: "Channel",
  angle: "Angle",
  lumber: "Lumber",
};

const LUMBER_SIZES = {
  "2x4": { label: "2x4", widthIn: 1.5, heightIn: 3.5 },
  "2x6": { label: "2x6", widthIn: 1.5, heightIn: 5.5 },
  "2x8": { label: "2x8", widthIn: 1.5, heightIn: 7.25 },
  "2x10": { label: "2x10", widthIn: 1.5, heightIn: 9.25 },
  "2x12": { label: "2x12", widthIn: 1.5, heightIn: 11.25 },
  "4x4": { label: "4x4", widthIn: 3.5, heightIn: 3.5 },
  "4x6": { label: "4x6", widthIn: 3.5, heightIn: 5.5 },
  "6x6": { label: "6x6", widthIn: 5.5, heightIn: 5.5 },
};

const STRUCTURAL_SHAPES = new Set(["beam", "channel", "angle"]);
const WOOD_SHAPES = new Set(["lumber"]);

function formatNumber(value, decimals = 4) {
  if (typeof value !== "number" || Number.isNaN(value)) return String(value);
  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString();
}

function convertToInches(value, unit) {
  if (!Number.isFinite(value)) return NaN;
  if (unit === "in") return value;
  if (unit === "ft") return value * 12;
  if (unit === "mm") return value / 25.4;
  return value;
}

function convertToFeet(value, unit) {
  if (!Number.isFinite(value)) return NaN;
  if (unit === "ft") return value;
  if (unit === "in") return value / 12;
  if (unit === "mm") return value / 304.8;
  return value;
}

function poundsToKg(lb) {
  return lb * 0.45359237;
}

function getMaterialOptionsForShape(shape) {
  const wantWood = WOOD_SHAPES.has(shape);
  return Object.entries(MATERIALS).filter(([, item]) =>
    wantWood ? item.group === "wood" : item.group === "metal"
  );
}

function getDefaultMaterialForShape(shape) {
  return WOOD_SHAPES.has(shape) ? "pine" : "steel";
}

function getMoistureAdjustedDensity(baseDensity, moistureMode, shape) {
  if (!WOOD_SHAPES.has(shape)) return baseDensity;
  if (moistureMode === "green") return baseDensity * 1.15;
  return baseDensity;
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
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-30 w-72 -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-zinc-950/95 p-3 text-sm leading-6 text-zinc-200 opacity-0 shadow-[0_0_18px_rgba(16,185,129,0.14)] transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

function FooterStatusPanel({
  material,
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
              Material Weight Environment Status
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
              Active Material
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {MATERIALS[material].label}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Active Shape
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {SHAPES[shape]}
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
  );
}

function TrustPanel({
  shape,
  material,
  moistureMode,
  useDensityOverride,
  densityOverride,
}) {
  const materialInfo = MATERIALS[material];
  const isWood = WOOD_SHAPES.has(shape);
  const isStructural = STRUCTURAL_SHAPES.has(shape);

  return (
    <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-zinc-950/75 p-6 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
          ― Trust & Reference Notes ―
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Data source and input guidance
        </h3>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Material Basis
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {materialInfo.trustNote}.{" "}
            {isWood
              ? `Wood values are estimation-grade and vary with species and moisture. Current moisture mode: ${
                  moistureMode === "green" ? "Green / wetter" : "Dry / standard"
                }.`
              : "Metal values are engineering defaults suitable for general weight estimation."}
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Structural Shape Note
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {isStructural
              ? "Beam, channel, and angle modes use manual lb/ft input. Use official AISC or manufacturer shape data for the entered weight-per-foot."
              : "This mode calculates from entered dimensions and density."}
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
            Advanced Override
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {useDensityOverride
              ? `Density override is active at ${densityOverride || "custom"} lb/in³.`
              : "Density override is off. Calculator uses built-in defaults for the selected material."}
          </p>
        </div>
      </div>

      {isStructural && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            href={AISC_SHAPES_DATABASE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-[1.4rem] border border-emerald-500/25 bg-emerald-500/8 p-4 text-center transition hover:border-emerald-400/45 hover:bg-emerald-500/12"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
              Official AISC Link
            </p>
            <p className="mt-3 text-base font-semibold text-white">
              Open AISC Shapes Database
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Use this to verify shape properties and weight-per-foot data.
            </p>
          </a>

          <a
            href={AISC_DIMENSION_TOOL_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-[1.4rem] border border-emerald-500/25 bg-emerald-500/8 p-4 text-center transition hover:border-emerald-400/45 hover:bg-emerald-500/12"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
              Official AISC Tool
            </p>
            <p className="mt-3 text-base font-semibold text-white">
              Open Structural Steel Dimensioning Tool
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Use this for section dimensions and rolled-shape reference help.
            </p>
          </a>
        </div>
      )}
    </div>
  );
}

function buildWeightWork({
  material,
  shape,
  length,
  width,
  height,
  thickness,
  diameter,
  outerDiameter,
  wallThickness,
  weightPerFoot,
  quantity,
  lengthUnit,
  sectionUnit,
  decimals,
  lumberSize,
  moistureMode,
  useDensityOverride,
  densityOverride,
}) {
  const baseDensity = MATERIALS[material].densityLbPerIn3;
  const moistureAdjustedDensity = getMoistureAdjustedDensity(
    baseDensity,
    moistureMode,
    shape
  );
  const overrideDensityNum = Number(densityOverride);

  const density =
    useDensityOverride && Number.isFinite(overrideDensityNum) && overrideDensityNum > 0
      ? overrideDensityNum
      : moistureAdjustedDensity;

  const quantityNum = Number(quantity);

  if (!Number.isFinite(quantityNum) || quantityNum <= 0) {
    return {
      error: "Enter a quantity greater than zero.",
      title: "Material Weight",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  if (useDensityOverride && (!Number.isFinite(overrideDensityNum) || overrideDensityNum <= 0)) {
    return {
      error: "Enter a valid density override greater than zero.",
      title: "Material Weight",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  const lenRaw = Number(length);
  const widthRaw = Number(width);
  const heightRaw = Number(height);
  const thickRaw = Number(thickness);
  const diaRaw = Number(diameter);
  const odRaw = Number(outerDiameter);
  const wallRaw = Number(wallThickness);
  const wpfRaw = Number(weightPerFoot);

  const lenIn = convertToInches(lenRaw, lengthUnit);
  const lenFt = convertToFeet(lenRaw, lengthUnit);
  const widthIn = convertToInches(widthRaw, sectionUnit);
  const heightIn = convertToInches(heightRaw, sectionUnit);
  const thickIn = convertToInches(thickRaw, sectionUnit);
  const diaIn = convertToInches(diaRaw, sectionUnit);
  const odIn = convertToInches(odRaw, sectionUnit);
  const wallIn = convertToInches(wallRaw, sectionUnit);

  let title = "Material Weight";
  let formula = "";
  let steps = [];
  let visualWork = "";
  let volumePerPiece = 0;
  let densityUsed = density;
  let weightPerPieceLb = 0;
  let dataNote = "";

  if (shape === "plate") {
    if (![lenIn, widthIn, thickIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length, width, and thickness values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    title = "Plate / Flat Weight";
    formula = "Volume = Length × Width × Thickness, then Weight = Volume × Density";
    volumePerPiece = lenIn * widthIn * thickIn;
    dataNote = useDensityOverride
      ? "Custom density override in use."
      : WOOD_SHAPES.has(shape)
      ? "Estimated wood density in use."
      : "Standard engineering density in use.";

    steps = [
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `Width in inches = ${formatNumber(widthIn, decimals)}`,
      `Thickness in inches = ${formatNumber(thickIn, decimals)}`,
      `Volume per piece = ${formatNumber(lenIn, decimals)} × ${formatNumber(widthIn, decimals)} × ${formatNumber(thickIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
      dataNote,
    ];

    weightPerPieceLb = volumePerPiece * densityUsed;

    visualWork = `${formatNumber(lenIn, decimals)} × ${formatNumber(widthIn, decimals)} × ${formatNumber(thickIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (shape === "round") {
    if (![lenIn, diaIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length and diameter values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const radius = diaIn / 2;
    const area = Math.PI * radius * radius;
    title = "Round Bar Weight";
    formula = "Area = πr², Volume = Area × Length, Weight = Volume × Density";
    volumePerPiece = area * lenIn;

    steps = [
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `Diameter in inches = ${formatNumber(diaIn, decimals)}`,
      `Radius = ${formatNumber(diaIn, decimals)} ÷ 2 = ${formatNumber(radius, decimals)}`,
      `Area = π × ${formatNumber(radius, decimals)}²`,
      `Area = ${formatNumber(area, decimals)} in²`,
      `Volume per piece = ${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
    ];

    weightPerPieceLb = volumePerPiece * densityUsed;

    visualWork = `Radius = ${formatNumber(diaIn, decimals)} ÷ 2 = ${formatNumber(radius, decimals)}
Area = π × ${formatNumber(radius, decimals)}² = ${formatNumber(area, decimals)} in²
${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (shape === "square") {
    if (![lenIn, widthIn, heightIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length, width, and height values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    title = "Square / Rectangular Bar Weight";
    formula = "Volume = Width × Height × Length, then Weight = Volume × Density";
    volumePerPiece = widthIn * heightIn * lenIn;

    steps = [
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `Width in inches = ${formatNumber(widthIn, decimals)}`,
      `Height in inches = ${formatNumber(heightIn, decimals)}`,
      `Volume per piece = ${formatNumber(widthIn, decimals)} × ${formatNumber(heightIn, decimals)} × ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
    ];

    weightPerPieceLb = volumePerPiece * densityUsed;

    visualWork = `${formatNumber(widthIn, decimals)} × ${formatNumber(heightIn, decimals)} × ${formatNumber(lenIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (shape === "pipe") {
    if (![lenIn, odIn, wallIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length, outside diameter, and wall thickness values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const idIn = odIn - 2 * wallIn;

    if (idIn <= 0) {
      return {
        error: "Wall thickness is too large for the selected outside diameter.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const area = (Math.PI / 4) * (odIn * odIn - idIn * idIn);
    title = "Pipe Weight";
    formula = "Inside Diameter = OD - 2 × Wall, Area = (π/4)(OD² - ID²), Volume = Area × Length";
    volumePerPiece = area * lenIn;

    steps = [
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `OD in inches = ${formatNumber(odIn, decimals)}`,
      `Wall in inches = ${formatNumber(wallIn, decimals)}`,
      `ID = ${formatNumber(odIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(idIn, decimals)}`,
      `Area = (π / 4) × (OD² - ID²)`,
      `Area = ${formatNumber(area, decimals)} in²`,
      `Volume per piece = ${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
    ];

    weightPerPieceLb = volumePerPiece * densityUsed;

    visualWork = `ID = ${formatNumber(odIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(idIn, decimals)}
Area = (π / 4) × (${formatNumber(odIn, decimals)}² - ${formatNumber(idIn, decimals)}²)
Area = ${formatNumber(area, decimals)} in²
${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (shape === "tube") {
    if (![lenIn, widthIn, heightIn, wallIn].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length, width, height, and wall thickness values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const innerWidth = widthIn - 2 * wallIn;
    const innerHeight = heightIn - 2 * wallIn;

    if (innerWidth <= 0 || innerHeight <= 0) {
      return {
        error: "Wall thickness is too large for the selected tube dimensions.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const area = widthIn * heightIn - innerWidth * innerHeight;
    title = "Tube / Rectangular Tube Weight";
    formula = "Area = (Outer Width × Outer Height) - (Inner Width × Inner Height), Volume = Area × Length";
    volumePerPiece = area * lenIn;

    steps = [
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `Outer width in inches = ${formatNumber(widthIn, decimals)}`,
      `Outer height in inches = ${formatNumber(heightIn, decimals)}`,
      `Wall in inches = ${formatNumber(wallIn, decimals)}`,
      `Inner width = ${formatNumber(widthIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(innerWidth, decimals)}`,
      `Inner height = ${formatNumber(heightIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(innerHeight, decimals)}`,
      `Area = (${formatNumber(widthIn, decimals)} × ${formatNumber(heightIn, decimals)}) - (${formatNumber(innerWidth, decimals)} × ${formatNumber(innerHeight, decimals)})`,
      `Area = ${formatNumber(area, decimals)} in²`,
      `Volume per piece = ${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
    ];

    weightPerPieceLb = volumePerPiece * densityUsed;

    visualWork = `Inner width = ${formatNumber(widthIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(innerWidth, decimals)}
Inner height = ${formatNumber(heightIn, decimals)} - 2 × ${formatNumber(wallIn, decimals)} = ${formatNumber(innerHeight, decimals)}
Area = (${formatNumber(widthIn, decimals)} × ${formatNumber(heightIn, decimals)}) - (${formatNumber(innerWidth, decimals)} × ${formatNumber(innerHeight, decimals)})
Area = ${formatNumber(area, decimals)} in²
${formatNumber(area, decimals)} × ${formatNumber(lenIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (STRUCTURAL_SHAPES.has(shape)) {
    if (![lenFt, wpfRaw].every((n) => Number.isFinite(n) && n > 0)) {
      return {
        error: "Enter valid length and weight-per-foot values.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    title =
      shape === "beam"
        ? "Beam Weight"
        : shape === "channel"
        ? "Channel Weight"
        : "Angle Weight";

    formula =
      "Weight per piece = Weight per Foot × Length in Feet, then Total = Piece Weight × Quantity";

    weightPerPieceLb = wpfRaw * lenFt;

    steps = [
      `Length in feet = ${formatNumber(lenFt, decimals)}`,
      `Weight per foot = ${formatNumber(wpfRaw, decimals)} lb/ft`,
      `Weight per piece = ${formatNumber(wpfRaw, decimals)} × ${formatNumber(lenFt, decimals)}`,
      `Weight per piece = ${formatNumber(weightPerPieceLb, decimals)} lb`,
      `Manual lb/ft input should be verified from AISC or manufacturer data.`,
    ];

    visualWork = `${formatNumber(wpfRaw, decimals)} lb/ft × ${formatNumber(lenFt, decimals)} ft = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  if (shape === "lumber") {
    const lumber = LUMBER_SIZES[lumberSize];

    if (!lumber) {
      return {
        error: "Select a lumber size.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    if (!Number.isFinite(lenIn) || lenIn <= 0) {
      return {
        error: "Enter a valid length for the lumber.",
        title,
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    title = "Lumber Weight";
    formula = "Volume = Actual Width × Actual Height × Length, then Weight = Volume × Density";

    const actualWidth = lumber.widthIn;
    const actualHeight = lumber.heightIn;
    volumePerPiece = actualWidth * actualHeight * lenIn;
    densityUsed = density;
    weightPerPieceLb = volumePerPiece * densityUsed;

    steps = [
      `Nominal size = ${lumber.label}`,
      `Actual width = ${formatNumber(actualWidth, decimals)} in`,
      `Actual height = ${formatNumber(actualHeight, decimals)} in`,
      `Length in inches = ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(actualWidth, decimals)} × ${formatNumber(actualHeight, decimals)} × ${formatNumber(lenIn, decimals)}`,
      `Volume per piece = ${formatNumber(volumePerPiece, decimals)} in³`,
      `Weight per piece = ${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)}`,
      useDensityOverride
        ? "Custom density override in use."
        : moistureMode === "green"
        ? "Green / wetter wood estimate in use."
        : "Dry / standard wood estimate in use.",
    ];

    visualWork = `${lumber.label} actual size = ${formatNumber(actualWidth, decimals)} × ${formatNumber(actualHeight, decimals)} in
${formatNumber(actualWidth, decimals)} × ${formatNumber(actualHeight, decimals)} × ${formatNumber(lenIn, decimals)} = ${formatNumber(volumePerPiece, decimals)} in³
${formatNumber(volumePerPiece, decimals)} × ${formatNumber(densityUsed, 4)} = ${formatNumber(weightPerPieceLb, decimals)} lb`;
  }

  const totalWeightLb = weightPerPieceLb * quantityNum;
  const weightPerPieceKg = poundsToKg(weightPerPieceLb);
  const totalWeightKg = poundsToKg(totalWeightLb);

  const summary = `Per Piece: ${formatNumber(weightPerPieceLb, decimals)} lb | Total: ${formatNumber(totalWeightLb, decimals)} lb`;

  const finalSteps = [
    ...steps,
    `Weight per piece = ${formatNumber(weightPerPieceLb, decimals)} lb`,
    `Total weight = ${formatNumber(weightPerPieceLb, decimals)} × ${formatNumber(quantityNum, 0)} = ${formatNumber(totalWeightLb, decimals)} lb`,
  ];

  const finalVisual = `${visualWork}
${formatNumber(weightPerPieceLb, decimals)} × ${formatNumber(quantityNum, 0)} = ${formatNumber(totalWeightLb, decimals)} lb total`;

  const copyText = `${finalVisual}

Per Piece: ${formatNumber(weightPerPieceLb, decimals)} lb
Per Piece: ${formatNumber(weightPerPieceKg, decimals)} kg
Total: ${formatNumber(totalWeightLb, decimals)} lb
Total: ${formatNumber(totalWeightKg, decimals)} kg`;

  return {
    error: null,
    title,
    formula,
    summary,
    steps: finalSteps,
    visualWork: finalVisual,
    copyText,
    density: densityUsed,
    volumePerPiece,
    weightPerPieceLb,
    totalWeightLb,
    weightPerPieceKg,
    totalWeightKg,
    quantity: quantityNum,
  };
}

function InputLabel({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.28em] text-emerald-400">
      {children}
    </label>
  );
}

export default function MaterialWeightCalculator() {
  const [material, setMaterial] = useState("steel");
  const [shape, setShape] = useState("plate");
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [decimals, setDecimals] = useState(4);

  const [lengthUnit, setLengthUnit] = useState("in");
  const [sectionUnit, setSectionUnit] = useState("in");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState("");
  const [diameter, setDiameter] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [wallThickness, setWallThickness] = useState("");
  const [weightPerFoot, setWeightPerFoot] = useState("");
  const [lumberSize, setLumberSize] = useState("2x4");
  const [moistureMode, setMoistureMode] = useState("dry");
  const [useDensityOverride, setUseDensityOverride] = useState(false);
  const [densityOverride, setDensityOverride] = useState("");
  const [quantity, setQuantity] = useState("1");

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

  useEffect(() => {
    const nextDefault = getDefaultMaterialForShape(shape);
    if (!getMaterialOptionsForShape(shape).some(([key]) => key === material)) {
      setMaterial(nextDefault);
    }

    if (!WOOD_SHAPES.has(shape)) {
      setMoistureMode("dry");
    }
  }, [shape, material]);

  const calculate = () => {
    setResultData(
      buildWeightWork({
        material,
        shape,
        length,
        width,
        height,
        thickness,
        diameter,
        outerDiameter,
        wallThickness,
        weightPerFoot,
        quantity,
        lengthUnit,
        sectionUnit,
        decimals,
        lumberSize,
        moistureMode,
        useDensityOverride,
        densityOverride,
      })
    );
  };

  const clearAll = () => {
    setLength("");
    setWidth("");
    setHeight("");
    setThickness("");
    setDiameter("");
    setOuterDiameter("");
    setWallThickness("");
    setWeightPerFoot("");
    setDensityOverride("");
    setUseDensityOverride(false);
    setMoistureMode("dry");
    setQuantity("1");
    setResultData(null);
  };

  const loadExample = () => {
    if (shape === "plate") {
      setMaterial("steel");
      setLengthUnit("in");
      setSectionUnit("in");
      setLength("120");
      setWidth("48");
      setThickness("0.5");
      setHeight("");
      setDiameter("");
      setOuterDiameter("");
      setWallThickness("");
      setWeightPerFoot("");
      setQuantity("4");
      setUseDensityOverride(false);
      setDensityOverride("");
    }

    if (shape === "beam") {
      setMaterial("steel");
      setLengthUnit("ft");
      setLength("20");
      setWeightPerFoot("26");
      setQuantity("4");
      setUseDensityOverride(false);
      setDensityOverride("");
    }

    if (shape === "channel") {
      setMaterial("steel");
      setLengthUnit("ft");
      setLength("18");
      setWeightPerFoot("20.7");
      setQuantity("2");
      setUseDensityOverride(false);
      setDensityOverride("");
    }

    if (shape === "angle") {
      setMaterial("steel");
      setLengthUnit("ft");
      setLength("12");
      setWeightPerFoot("7.3");
      setQuantity("6");
      setUseDensityOverride(false);
      setDensityOverride("");
    }

    if (shape === "lumber") {
      setMaterial("pine");
      setLengthUnit("ft");
      setLumberSize("2x10");
      setLength("16");
      setQuantity("12");
      setMoistureMode("dry");
      setUseDensityOverride(false);
      setDensityOverride("");
    }

    setResultData(null);
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
    "Select a material and shape, enter dimensions or weight-per-foot data, and the calculator will show weight per piece, total weight, density used where applicable, and the full worked breakdown.";

  const materialOptions = getMaterialOptionsForShape(shape);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>
          Material Weight Calculator (Steel, Aluminum, Lumber, Beams) | RuntWerkx
        </title>
        <meta
          name="description"
          content="Calculate material weight for steel, stainless, aluminum, lumber, beams, channel, angle, pipe, and tube. Includes formulas, density references, worked steps, and AISC verification links."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta
          property="og:title"
          content="Material Weight Calculator (Steel, Aluminum, Lumber, Beams) | RuntWerkx"
        />
        <meta
          property="og:description"
          content="Calculate steel, aluminum, lumber, beam, pipe, and tube weight with formulas, worked steps, and AISC reference links."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Material Weight Calculator (Steel, Aluminum, Lumber, Beams) | RuntWerkx"
        />
        <meta
          name="twitter:description"
          content="Calculate steel, aluminum, lumber, beam, pipe, and tube weight with formulas, worked steps, and AISC reference links."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "RuntWerkx Material Weight Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            url: PAGE_URL,
            description:
              "Calculate material weight for steel, stainless, aluminum, lumber, beams, channel, angle, pipe, and tube with formulas, worked steps, and AISC reference links.",
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
              Material Weight Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Calculate material weight with full visibility into the shape
              formula, density used, per-piece result, and total weight. Built
              to make weight math easy to follow, easy to trust, and easy to
              recreate.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page as a steel weight calculator, beam weight calculator,
              metal weight calculator, pipe weight calculator, or lumber weight
              calculator for real-world fabrication, construction, manufacturing,
              shipping, and planning work.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="rounded-full border border-zinc-700 bg-black/40 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400"
              >
                Calculator Settings
              </button>
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
                  <TogglePill
                    label="Density Override"
                    checked={useDensityOverride}
                    onChange={setUseDensityOverride}
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

                  {useDensityOverride && (
                    <div className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2.5 text-sm text-zinc-300">
                      <span className="mr-3">lb/in³</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={densityOverride}
                        onChange={(e) => setDensityOverride(e.target.value)}
                        placeholder="Custom density"
                        className="w-28 bg-transparent text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <TrustPanel
            shape={shape}
            material={material}
            moistureMode={moistureMode}
            useDensityOverride={useDensityOverride}
            densityOverride={densityOverride}
          />

          <div className="mt-16 grid gap-12 xl:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Working Surface ―
                </p>
                <h2 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                  Material Weight Workstation
                  {showTooltips && <TooltipBubble text={helperText} />}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Set material, select shape, enter dimensions, and get weight
                  output with a fully visible calculation path.
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
                        ― Weight Input Workspace ―
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                        Shape, Material & Dimensions
                      </h3>
                      <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400">
                        Start with your material and shape, then enter the
                        dimensions you know. The calculator will convert units
                        internally and show the worked result.
                      </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <InputLabel>Material</InputLabel>
                            <select
                              value={material}
                              onChange={(e) => setMaterial(e.target.value)}
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            >
                              {materialOptions.map(([key, item]) => (
                                <option key={key} value={key}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <InputLabel>Shape</InputLabel>
                            <select
                              value={shape}
                              onChange={(e) => {
                                setShape(e.target.value);
                                setResultData(null);
                              }}
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            >
                              {Object.entries(SHAPES).map(([key, item]) => (
                                <option key={key} value={key}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>

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

                          {!STRUCTURAL_SHAPES.has(shape) && !WOOD_SHAPES.has(shape) && (
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
                          )}

                          <div className={`${STRUCTURAL_SHAPES.has(shape) || WOOD_SHAPES.has(shape) ? "" : "md:col-span-2"}`}>
                            <InputLabel>Quantity</InputLabel>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              placeholder="Enter quantity"
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            />
                          </div>

                          {WOOD_SHAPES.has(shape) && (
                            <>
                              <div>
                                <InputLabel>Lumber Size</InputLabel>
                                <select
                                  value={lumberSize}
                                  onChange={(e) => setLumberSize(e.target.value)}
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                >
                                  {Object.entries(LUMBER_SIZES).map(([key, item]) => (
                                    <option key={key} value={key}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <InputLabel>Wood Moisture</InputLabel>
                                <select
                                  value={moistureMode}
                                  onChange={(e) => setMoistureMode(e.target.value)}
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                >
                                  <option value="dry">Dry / Standard</option>
                                  <option value="green">Green / Wetter</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <InputLabel>Length</InputLabel>
                            <input
                              type="number"
                              value={length}
                              onChange={(e) => setLength(e.target.value)}
                              placeholder="Enter length"
                              className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                            />
                          </div>

                          {shape === "plate" && (
                            <>
                              <div>
                                <InputLabel>Width</InputLabel>
                                <input
                                  type="number"
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                  placeholder="Enter width"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Thickness</InputLabel>
                                <input
                                  type="number"
                                  value={thickness}
                                  onChange={(e) => setThickness(e.target.value)}
                                  placeholder="Enter thickness"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {shape === "round" && (
                            <div className="md:col-span-2">
                              <InputLabel>Diameter</InputLabel>
                              <input
                                type="number"
                                value={diameter}
                                onChange={(e) => setDiameter(e.target.value)}
                                placeholder="Enter diameter"
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                              />
                            </div>
                          )}

                          {shape === "square" && (
                            <>
                              <div>
                                <InputLabel>Width</InputLabel>
                                <input
                                  type="number"
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                  placeholder="Enter width"
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

                          {shape === "pipe" && (
                            <>
                              <div>
                                <InputLabel>Outside Diameter</InputLabel>
                                <input
                                  type="number"
                                  value={outerDiameter}
                                  onChange={(e) => setOuterDiameter(e.target.value)}
                                  placeholder="Enter OD"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Wall Thickness</InputLabel>
                                <input
                                  type="number"
                                  value={wallThickness}
                                  onChange={(e) => setWallThickness(e.target.value)}
                                  placeholder="Enter wall"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {shape === "tube" && (
                            <>
                              <div>
                                <InputLabel>Outside Width</InputLabel>
                                <input
                                  type="number"
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                  placeholder="Enter outside width"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div>
                                <InputLabel>Outside Height</InputLabel>
                                <input
                                  type="number"
                                  value={height}
                                  onChange={(e) => setHeight(e.target.value)}
                                  placeholder="Enter outside height"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <InputLabel>Wall Thickness</InputLabel>
                                <input
                                  type="number"
                                  value={wallThickness}
                                  onChange={(e) => setWallThickness(e.target.value)}
                                  placeholder="Enter wall thickness"
                                  className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                                />
                              </div>
                            </>
                          )}

                          {STRUCTURAL_SHAPES.has(shape) && (
                            <div className="md:col-span-2">
                              <InputLabel>Weight Per Foot</InputLabel>
                              <input
                                type="number"
                                value={weightPerFoot}
                                onChange={(e) => setWeightPerFoot(e.target.value)}
                                placeholder="Enter pounds per foot"
                                className="mt-3 w-full rounded-[1.2rem] border border-zinc-800 bg-black/50 px-5 py-4 text-lg text-white outline-none"
                              />
                              <p className="mt-2 text-xs leading-6 text-zinc-500">
                                Enter lb/ft from official AISC or manufacturer data.
                                Structural shape weight is not automatically looked
                                up on this page.
                              </p>
                            </div>
                          )}

                          {shape === "lumber" && (
                            <div className="md:col-span-2 rounded-[1.4rem] border border-zinc-800 bg-black/35 p-5 text-center">
                              <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                                Actual Lumber Dimensions
                              </p>
                              <p className="mt-3 text-lg text-zinc-200">
                                {LUMBER_SIZES[lumberSize].label} = {formatNumber(LUMBER_SIZES[lumberSize].widthIn, 2)} in × {formatNumber(LUMBER_SIZES[lumberSize].heightIn, 2)} in
                              </p>
                            </div>
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
                  Worked Weight Output
                  {showTooltips && (
                    <TooltipBubble text="This area shows density used, worked formula path, per-piece weight, and total weight." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, converted dimensions, density used, per-piece result,
                  and total weight with a visible answer trail.
                </p>
              </div>

              <div className="min-h-[820px] rounded-[2.3rem] bg-zinc-950/55 p-8 backdrop-blur-sm">
                {!resultData ? (
                  <div className="flex min-h-[740px] items-center justify-center text-center text-zinc-500">
                    Enter your material and dimensions, then click calculate to
                    see the worked weight result.
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

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Density Used
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(resultData.density, 4)} lb/in³
                        </p>
                      </div>

                      <div className="rounded-[1.6rem] bg-black/45 p-5 text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Quantity
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {formatNumber(resultData.quantity, 0)}
                        </p>
                      </div>
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

                    <div className="grid gap-4">
                      <div className="rounded-[1.8rem] bg-emerald-500/10 p-6 text-center">
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                          ― Per Piece ―
                        </p>
                        <p className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                          {formatNumber(resultData.weightPerPieceLb, decimals)} lb
                        </p>
                        <p className="mt-2 text-zinc-300">
                          {formatNumber(resultData.weightPerPieceKg, decimals)} kg
                        </p>
                      </div>

                      <div className="rounded-[1.8rem] bg-emerald-500/10 p-6 text-center">
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                          ― Total Weight ―
                        </p>
                        <p className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                          {formatNumber(resultData.totalWeightLb, decimals)} lb
                        </p>
                        <p className="mt-2 text-zinc-300">
                          {formatNumber(resultData.totalWeightKg, decimals)} kg
                        </p>
                      </div>
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
                Built for real material weight calculations
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This material weight calculator is built for real-world
                fabrication, manufacturing, construction, and planning work. Use
                it as a steel weight calculator, beam weight calculator, metal
                weight calculator, pipe weight calculator, or lumber weight
                calculator. The page shows formulas, density values, worked
                steps, and final totals so results are easier to verify and
                trust before ordering, quoting, rigging, or moving material.
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
              </div>
            </div>
          </section>

          <FooterStatusPanel
            material={material}
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
  );
}