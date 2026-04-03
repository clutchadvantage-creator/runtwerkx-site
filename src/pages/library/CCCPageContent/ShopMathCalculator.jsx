import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

function formatNumber(value, decimals = 4) {
  if (typeof value !== "number" || Number.isNaN(value)) return String(value);
  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString();
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

function sanitizeExpression(raw) {
  return raw.replace(/×/g, "*").replace(/÷/g, "/");
}

function safeEvaluateExpression(expression) {
  const cleaned = sanitizeExpression(expression).trim();

  if (!cleaned) {
    return { ok: false, error: "Enter a calculation to begin." };
  }

  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    return {
      ok: false,
      error:
        "Only numbers, spaces, parentheses, and + - * / operators are allowed in Basic Math mode.",
    };
  }

  try {
    const result = Function(`"use strict"; return (${cleaned})`)();
    if (
      typeof result !== "number" ||
      !Number.isFinite(result) ||
      Number.isNaN(result)
    ) {
      return { ok: false, error: "The expression could not be evaluated cleanly." };
    }
    return { ok: true, cleaned, result };
  } catch {
    return {
      ok: false,
      error: "Check the expression for missing numbers, operators, or parentheses.",
    };
  }
}

function displayOperator(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  return op;
}

function tokenizeFlatExpression(expression) {
  const cleaned = sanitizeExpression(expression).replace(/\s+/g, "");
  const tokens = [];
  let current = "";

  for (let i = 0; i < cleaned.length; i += 1) {
    const char = cleaned[i];

    if ((char >= "0" && char <= "9") || char === ".") {
      current += char;
      continue;
    }

    if ("+-*/".includes(char)) {
      const prev = cleaned[i - 1];

      if (char === "-" && (i === 0 || "+-*/(".includes(prev))) {
        current += char;
        continue;
      }

      if (current === "" || current === "-") {
        return null;
      }

      tokens.push(Number(current));
      tokens.push(char);
      current = "";
      continue;
    }

    if (char === "(" || char === ")") {
      return null;
    }

    return null;
  }

  if (current === "" || current === "-") return null;
  tokens.push(Number(current));

  if (tokens.length % 2 === 0) return null;

  for (let i = 0; i < tokens.length; i += 1) {
    if (i % 2 === 0 && typeof tokens[i] !== "number") return null;
    if (i % 2 === 1 && typeof tokens[i] !== "string") return null;
  }

  return tokens;
}

function buildPlaybackFromTokens(tokens, decimals) {
  const working = [...tokens];
  const steps = [];

  while (working.includes("*") || working.includes("/")) {
    const index = working.findIndex((item) => item === "*" || item === "/");
    const left = working[index - 1];
    const op = working[index];
    const right = working[index + 1];

    if (op === "/" && right === 0) {
      return {
        error: "Division by zero is undefined.",
        title: "Basic Math",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const result = op === "*" ? left * right : left / right;

    steps.push(
      `${formatNumber(left, decimals)} ${displayOperator(op)} ${formatNumber(
        right,
        decimals
      )} = ${formatNumber(result, decimals)}`
    );

    working.splice(index - 1, 3, result);
  }

  while (working.length > 1) {
    const left = working[0];
    const op = working[1];
    const right = working[2];

    const result = op === "+" ? left + right : left - right;

    steps.push(
      `${formatNumber(left, decimals)} ${displayOperator(op)} ${formatNumber(
        right,
        decimals
      )} = ${formatNumber(result, decimals)}`
    );

    working.splice(0, 3, result);
  }

  const finalResult = working[0];
  const visualWork = steps.join("\n");
  const copyText = `${visualWork}\n\nFinal Result: ${formatNumber(
    finalResult,
    decimals
  )}`;

  return {
    error: null,
    title: "Basic Math",
    formula: "Playback engine: multiply/divide first, then add/subtract",
    summary: `Final Result: ${formatNumber(finalResult, decimals)}`,
    steps,
    visualWork,
    copyText,
    result: finalResult,
  };
}

function buildExpressionWork(expression, decimals) {
  const evaluation = safeEvaluateExpression(expression);

  if (!evaluation.ok) {
    return {
      error: evaluation.error,
      title: "Basic Math",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  const flatTokens = tokenizeFlatExpression(evaluation.cleaned);

  if (flatTokens) {
    const playback = buildPlaybackFromTokens(flatTokens, decimals);
    if (!playback.error) {
      return playback;
    }
  }

  const visual = `${evaluation.cleaned}
= ${formatNumber(evaluation.result, decimals)}`;

  return {
    error: null,
    title: "Basic Math",
    formula: "Direct expression evaluation",
    summary: `Final Result: ${formatNumber(evaluation.result, decimals)}`,
    steps: [
      `Expression entered: ${evaluation.cleaned}`,
      `${evaluation.cleaned} = ${formatNumber(evaluation.result, decimals)}`,
    ],
    visualWork: visual,
    copyText: visual,
    result: evaluation.result,
  };
}

function buildPercentageWork(type, aRaw, bRaw, decimals) {
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return {
      error: "Enter both values for this percentage calculation.",
      title: "Percentages",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  if (type === "percent-of") {
    const result = (a / 100) * b;
    const visual = `${a}% of ${b}
= (${a} ÷ 100) × ${b}
= ${a / 100} × ${b}
= ${formatNumber(result, decimals)} = answer`;

    return {
      error: null,
      title: "Percentages",
      formula: "(X ÷ 100) × Y",
      summary: `${a}% of ${formatNumber(b, decimals)} = ${formatNumber(
        result,
        decimals
      )}`,
      steps: [
        `(${a} ÷ 100) × ${b}`,
        `${a / 100} × ${b}`,
        `${formatNumber(result, decimals)} = answer`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (type === "what-percent") {
    if (b === 0) {
      return {
        error: "The second value cannot be zero.",
        title: "Percentages",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const result = (a / b) * 100;
    const visual = `${a} is what % of ${b}?
= (${a} ÷ ${b}) × 100
= ${a / b} × 100
= ${formatNumber(result, decimals)}% = answer`;

    return {
      error: null,
      title: "Percentages",
      formula: "(A ÷ B) × 100",
      summary: `${formatNumber(a, decimals)} is ${formatNumber(
        result,
        decimals
      )}% of ${formatNumber(b, decimals)}`,
      steps: [
        `(${a} ÷ ${b}) × 100`,
        `${a / b} × 100`,
        `${formatNumber(result, decimals)}% = answer`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (type === "increase") {
    if (a === 0) {
      return {
        error: "Original value cannot be zero for percent increase.",
        title: "Percentages",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const diff = b - a;
    const result = (diff / a) * 100;
    const visual = `${b} - ${a} = ${formatNumber(diff, decimals)}
(${formatNumber(diff, decimals)} ÷ ${a}) × 100
= ${formatNumber(diff / a, decimals)} × 100
= ${formatNumber(result, decimals)}% = answer`;

    return {
      error: null,
      title: "Percentages",
      formula: "((New - Original) ÷ Original) × 100",
      summary: `Increase from ${formatNumber(a, decimals)} to ${formatNumber(
        b,
        decimals
      )} = ${formatNumber(result, decimals)}%`,
      steps: [
        `${b} - ${a} = ${formatNumber(diff, decimals)}`,
        `(${formatNumber(diff, decimals)} ÷ ${a}) × 100`,
        `${formatNumber(result, decimals)}% = answer`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  if (a === 0) {
    return {
      error: "Original value cannot be zero for percent decrease.",
      title: "Percentages",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  const diff = a - b;
  const result = (diff / a) * 100;
  const visual = `${a} - ${b} = ${formatNumber(diff, decimals)}
(${formatNumber(diff, decimals)} ÷ ${a}) × 100
= ${formatNumber(diff / a, decimals)} × 100
= ${formatNumber(result, decimals)}% = answer`;

  return {
    error: null,
    title: "Percentages",
    formula: "((Original - New) ÷ Original) × 100",
    summary: `Decrease from ${formatNumber(a, decimals)} to ${formatNumber(
      b,
      decimals
    )} = ${formatNumber(result, decimals)}%`,
    steps: [
      `${a} - ${b} = ${formatNumber(diff, decimals)}`,
      `(${formatNumber(diff, decimals)} ÷ ${a}) × 100`,
      `${formatNumber(result, decimals)}% = answer`,
    ],
    visualWork: visual,
    copyText: visual,
    result,
  };
}

function buildRatioWork(type, leftRaw, rightRaw, targetRaw, decimals) {
  const left = parseFloat(leftRaw);
  const right = parseFloat(rightRaw);

  if (Number.isNaN(left) || Number.isNaN(right)) {
    return {
      error: "Enter both ratio values.",
      title: "Ratios",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  if (type === "simplify") {
    if (left === 0 && right === 0) {
      return {
        error: "A 0:0 ratio cannot be simplified.",
        title: "Ratios",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const divisor = gcd(left, right);
    const a = left / divisor;
    const b = right / divisor;
    const visual = `${left}:${right}
gcd = ${divisor}
${left} ÷ ${divisor} = ${a}
${right} ÷ ${divisor} = ${b}
= ${a}:${b} = answer`;

    return {
      error: null,
      title: "Ratios",
      formula: "Divide both sides by the greatest common divisor",
      summary: `Simplified ratio: ${a}:${b}`,
      steps: [
        `gcd = ${divisor}`,
        `${left} ÷ ${divisor} = ${a}`,
        `${right} ÷ ${divisor} = ${b}`,
      ],
      visualWork: visual,
      copyText: visual,
      result: `${a}:${b}`,
    };
  }

  if (type === "decimal") {
    if (right === 0) {
      return {
        error: "The second value cannot be zero.",
        title: "Ratios",
        formula: null,
        summary: null,
        steps: [],
        visualWork: "",
        copyText: "",
      };
    }

    const result = left / right;
    const visual = `${left} ÷ ${right}
= ${formatNumber(result, decimals)} = answer`;

    return {
      error: null,
      title: "Ratios",
      formula: "A ÷ B",
      summary: `Decimal ratio: ${formatNumber(result, decimals)}`,
      steps: [
        `${left} ÷ ${right}`,
        `${formatNumber(result, decimals)} = answer`,
      ],
      visualWork: visual,
      copyText: visual,
      result,
    };
  }

  const target = parseFloat(targetRaw);
  if (Number.isNaN(target)) {
    return {
      error: "Enter a target value for scale mode.",
      title: "Ratios",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  if (left === 0) {
    return {
      error: "The first ratio value cannot be zero in scale mode.",
      title: "Ratios",
      formula: null,
      summary: null,
      steps: [],
      visualWork: "",
      copyText: "",
    };
  }

  const factor = target / left;
  const scaledRight = right * factor;
  const visual = `${target} ÷ ${left} = ${formatNumber(factor, decimals)}
${right} × ${formatNumber(factor, decimals)} = ${formatNumber(
    scaledRight,
    decimals
  )}
= ${target}:${formatNumber(scaledRight, decimals)} = answer`;

  return {
    error: null,
    title: "Ratios",
    formula: "Target ÷ A = factor, then B × factor",
    summary: `Scaled ratio: ${target}:${formatNumber(scaledRight, decimals)}`,
    steps: [
      `${target} ÷ ${left} = ${formatNumber(factor, decimals)}`,
      `${right} × ${formatNumber(factor, decimals)} = ${formatNumber(
        scaledRight,
        decimals
      )}`,
    ],
    visualWork: visual,
    copyText: visual,
    result: `${target}:${formatNumber(scaledRight, decimals)}`,
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

export default function ShopMathCalculator() {
  const [mode, setMode] = useState("basic");
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [decimals, setDecimals] = useState(4);

  const [expression, setExpression] = useState("");

  const [percentageType, setPercentageType] = useState("percent-of");
  const [percentageA, setPercentageA] = useState("");
  const [percentageB, setPercentageB] = useState("");

  const [ratioType, setRatioType] = useState("simplify");
  const [ratioLeft, setRatioLeft] = useState("");
  const [ratioRight, setRatioRight] = useState("");
  const [ratioTarget, setRatioTarget] = useState("");

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

  const calculate = () => {
    if (mode === "basic") {
      setResultData(buildExpressionWork(expression, decimals));
      return;
    }

    if (mode === "percentage") {
      setResultData(
        buildPercentageWork(percentageType, percentageA, percentageB, decimals)
      );
      return;
    }

    if (mode === "ratio") {
      setResultData(
        buildRatioWork(ratioType, ratioLeft, ratioRight, ratioTarget, decimals)
      );
    }
  };

  const clearAll = () => {
    setExpression("");
    setPercentageA("");
    setPercentageB("");
    setRatioLeft("");
    setRatioRight("");
    setRatioTarget("");
    setResultData(null);
  };

  const loadExample = (type) => {
    if (type === "basic") {
      setMode("basic");
      setExpression("1000 * 7 + 3421 - 58");
      setResultData(null);
    }
    if (type === "percentage") {
      setMode("percentage");
      setPercentageType("increase");
      setPercentageA("120");
      setPercentageB("135");
      setResultData(null);
    }
    if (type === "ratio") {
      setMode("ratio");
      setRatioType("scale");
      setRatioLeft("2");
      setRatioRight("3");
      setRatioTarget("40");
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
    mode === "basic"
      ? "Basic Math"
      : mode === "percentage"
      ? "Percentages"
      : "Ratios";

  const helperText =
    mode === "basic"
      ? "Run long-form chained expressions and see the result written out step-by-step."
      : mode === "percentage"
      ? "Calculate percent-of, what-percent, increase, and decrease."
      : "Simplify, convert, and scale ratios with visible steps.";

  return (
    <div className="min-h-screen bg-black text-white">
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
              Basic Math Calculator
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Perform everyday math with full visibility into the formula, the
              work, and the final result. Built to make the math easy to
              follow, easy to trust, and easy to recreate.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setMode("basic")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "basic"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Basic Math
              </button>
              <button
                onClick={() => setMode("percentage")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "percentage"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Percentages
              </button>
              <button
                onClick={() => setMode("ratio")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === "ratio"
                    ? "bg-emerald-500 text-black"
                    : "border border-emerald-500/30 bg-black/30 text-white hover:border-emerald-400"
                }`}
              >
                Ratios
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
                onClick={() => loadExample("basic")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Long-Form Example
              </button>
              <button
                onClick={() => loadExample("percentage")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Percentage Example
              </button>
              <button
                onClick={() => loadExample("ratio")}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
              >
                Load Ratio Example
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
                  Big open calculation space with room to work through the math
                  without feeling boxed in.
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
                  {mode === "basic" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-8 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Long-Form Basic Math ―
                        </p>
                        <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                          Expression Input
                        </h3>
                        <p className="mx-auto mt-3 max-w-3xl text-lg text-zinc-400">
                          Enter long calculations like:
                          <span className="ml-2 font-mono text-zinc-200">
                            25000 * 134 + 3421 - 58 * 214 - 573
                          </span>
                        </p>
                      </div>

                      <textarea
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        placeholder="Type your calculation here..."
                        className="min-h-[560px] w-full resize-y border-none bg-transparent px-2 py-3 font-mono text-[32px] leading-[2.15] tracking-wide text-zinc-100 outline-none placeholder:text-zinc-600 md:text-[38px]"
                      />

                      {showTooltips && (
                        <div className="mt-5 text-base text-zinc-500">
                          Allowed operators: + - * / ( )
                        </div>
                      )}
                    </div>
                  )}

                  {mode === "percentage" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Percentage Workstation ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Percentage Calculator
                          {showTooltips && (
                            <TooltipBubble text="Use this mode for percent-of, what-percent, increase, and decrease calculations." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={percentageType}
                          onChange={(e) => setPercentageType(e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="percent-of">What is X% of Y</option>
                          <option value="what-percent">What percent is A of B</option>
                          <option value="increase">Percent increase</option>
                          <option value="decrease">Percent decrease</option>
                        </select>

                        <input
                          type="number"
                          value={percentageA}
                          onChange={(e) => setPercentageA(e.target.value)}
                          placeholder="Enter first value"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />

                        <input
                          type="number"
                          value={percentageB}
                          onChange={(e) => setPercentageB(e.target.value)}
                          placeholder="Enter second value"
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mode === "ratio" && (
                    <div className="mx-auto max-w-[1200px]">
                      <div className="mb-10 text-center">
                        <p className="text-xs uppercase tracking-[0.38em] text-emerald-400">
                          ― Ratio Workstation ―
                        </p>
                        <h3 className="mt-3 flex items-center justify-center text-3xl font-semibold md:text-4xl">
                          Ratio Calculator
                          {showTooltips && (
                            <TooltipBubble text="Simplify ratios, convert ratios to decimals, or scale a ratio to a target." />
                          )}
                        </h3>
                      </div>

                      <div className="grid gap-6">
                        <select
                          value={ratioType}
                          onChange={(e) => setRatioType(e.target.value)}
                          className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                        >
                          <option value="simplify">Simplify ratio</option>
                          <option value="decimal">Ratio to decimal</option>
                          <option value="scale">Scale ratio to target</option>
                        </select>

                        <div className="grid gap-6 md:grid-cols-2">
                          <input
                            type="number"
                            value={ratioLeft}
                            onChange={(e) => setRatioLeft(e.target.value)}
                            placeholder="Ratio left value"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                          <input
                            type="number"
                            value={ratioRight}
                            onChange={(e) => setRatioRight(e.target.value)}
                            placeholder="Ratio right value"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
                        </div>

                        {ratioType === "scale" && (
                          <input
                            type="number"
                            value={ratioTarget}
                            onChange={(e) => setRatioTarget(e.target.value)}
                            placeholder="Target value for left side"
                            className="rounded-[1.6rem] border border-zinc-800 bg-zinc-950/90 px-6 py-5 text-2xl text-white outline-none"
                          />
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
                    <TooltipBubble text="This area should feel like the page is actually doing the math in front of you." />
                  )}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Formula, visible steps, equals lines, and a clearer answer
                  trail.
                </p>
              </div>

              <div className="min-h-[820px] rounded-[2.3rem] bg-zinc-950/55 p-8 backdrop-blur-sm">
                {!resultData ? (
                  <div className="flex min-h-[740px] items-center justify-center text-center text-zinc-500">
                    Enter values or a long-form expression and click calculate
                    to see the worked solution.
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