import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PAGE_URL =
  "https://runtwerkx.com/knowledge-library/calculators-charts-conversions/tap-drill-chart";

const UNC_ROWS = [
  { thread: "#0-80", major: "0.0600", tpi: "80", tapDrill: "#56", decimal: "0.0465" },
  { thread: "#1-64", major: "0.0730", tpi: "64", tapDrill: "#53", decimal: "0.0595" },
  { thread: "#2-56", major: "0.0860", tpi: "56", tapDrill: "#50", decimal: "0.0700" },
  { thread: "#3-48", major: "0.0990", tpi: "48", tapDrill: "#47", decimal: "0.0785" },
  { thread: "#4-40", major: "0.1120", tpi: "40", tapDrill: "#43", decimal: "0.0890" },
  { thread: "#5-40", major: "0.1250", tpi: "40", tapDrill: "#38", decimal: "0.1015" },
  { thread: "#6-32", major: "0.1380", tpi: "32", tapDrill: "#36", decimal: "0.1065" },
  { thread: "#8-32", major: "0.1640", tpi: "32", tapDrill: "#29", decimal: "0.1360" },
  { thread: "#10-24", major: "0.1900", tpi: "24", tapDrill: "#25", decimal: "0.1495" },
  { thread: "#12-24", major: "0.2160", tpi: "24", tapDrill: "#16", decimal: "0.1770" },
  { thread: "1/4-20", major: "0.2500", tpi: "20", tapDrill: "#7", decimal: "0.2010" },
  { thread: "5/16-18", major: "0.3125", tpi: "18", tapDrill: "F", decimal: "0.2570" },
  { thread: "3/8-16", major: "0.3750", tpi: "16", tapDrill: "5/16", decimal: "0.3125" },
  { thread: "7/16-14", major: "0.4375", tpi: "14", tapDrill: "U", decimal: "0.3680" },
  { thread: "1/2-13", major: "0.5000", tpi: "13", tapDrill: "27/64", decimal: "0.4219" },
  { thread: "9/16-12", major: "0.5625", tpi: "12", tapDrill: "31/64", decimal: "0.4844" },
  { thread: "5/8-11", major: "0.6250", tpi: "11", tapDrill: "17/32", decimal: "0.5313" },
  { thread: "3/4-10", major: "0.7500", tpi: "10", tapDrill: "21/32", decimal: "0.6563" },
  { thread: "7/8-9", major: "0.8750", tpi: "9", tapDrill: "49/64", decimal: "0.7656" },
  { thread: "1-8", major: "1.0000", tpi: "8", tapDrill: "7/8", decimal: "0.8750" },
];

const UNF_ROWS = [
  { thread: "#0-80", major: "0.0600", tpi: "80", tapDrill: "#56", decimal: "0.0465" },
  { thread: "#1-72", major: "0.0730", tpi: "72", tapDrill: "#53", decimal: "0.0595" },
  { thread: "#2-64", major: "0.0860", tpi: "64", tapDrill: "#50", decimal: "0.0700" },
  { thread: "#3-56", major: "0.0990", tpi: "56", tapDrill: "#47", decimal: "0.0785" },
  { thread: "#4-48", major: "0.1120", tpi: "48", tapDrill: "#43", decimal: "0.0890" },
  { thread: "#5-44", major: "0.1250", tpi: "44", tapDrill: "#38", decimal: "0.1015" },
  { thread: "#6-40", major: "0.1380", tpi: "40", tapDrill: "#33", decimal: "0.1130" },
  { thread: "#8-36", major: "0.1640", tpi: "36", tapDrill: "#29", decimal: "0.1360" },
  { thread: "#10-32", major: "0.1900", tpi: "32", tapDrill: "#21", decimal: "0.1590" },
  { thread: "#12-28", major: "0.2160", tpi: "28", tapDrill: "#3", decimal: "0.2130" },
  { thread: "1/4-28", major: "0.2500", tpi: "28", tapDrill: "7/32", decimal: "0.2188" },
  { thread: "5/16-24", major: "0.3125", tpi: "24", tapDrill: "I", decimal: "0.2720" },
  { thread: "3/8-24", major: "0.3750", tpi: "24", tapDrill: "Q", decimal: "0.3320" },
  { thread: "7/16-20", major: "0.4375", tpi: "20", tapDrill: "25/64", decimal: "0.3906" },
  { thread: "1/2-20", major: "0.5000", tpi: "20", tapDrill: "29/64", decimal: "0.4531" },
  { thread: "9/16-18", major: "0.5625", tpi: "18", tapDrill: "33/64", decimal: "0.5156" },
  { thread: "5/8-18", major: "0.6250", tpi: "18", tapDrill: "37/64", decimal: "0.5781" },
  { thread: "3/4-16", major: "0.7500", tpi: "16", tapDrill: "11/16", decimal: "0.6875" },
  { thread: "7/8-14", major: "0.8750", tpi: "14", tapDrill: "13/16", decimal: "0.8125" },
  { thread: "1-12", major: "1.0000", tpi: "12", tapDrill: "59/64", decimal: "0.9219" },
];

const CLEARANCE_ROWS = [
  { size: "#0", close: "0.067", normal: "0.073", loose: "0.081" },
  { size: "#1", close: "0.081", normal: "0.086", loose: "0.093" },
  { size: "#2", close: "0.094", normal: "0.099", loose: "0.106" },
  { size: "#3", close: "0.107", normal: "0.112", loose: "0.120" },
  { size: "#4", close: "0.120", normal: "0.125", loose: "0.1285" },
  { size: "#5", close: "0.133", normal: "0.138", loose: "0.144" },
  { size: "#6", close: "0.144", normal: "0.1495", loose: "0.156" },
  { size: "#8", close: "0.173", normal: "0.177", loose: "0.182" },
  { size: "#10", close: "0.201", normal: "0.196", loose: "0.201" },
  { size: "#12", close: "0.221", normal: "0.228", loose: "0.238" },
  { size: "1/4", close: "0.257", normal: "0.266", loose: "0.281" },
  { size: "5/16", close: "0.323", normal: "0.332", loose: "0.344" },
  { size: "3/8", close: "0.386", normal: "0.397", loose: "0.406" },
  { size: "7/16", close: "0.453", normal: "0.453", loose: "0.468" },
  { size: "1/2", close: "0.515", normal: "0.531", loose: "0.562" },
  { size: "9/16", close: "0.578", normal: "0.593", loose: "0.625" },
  { size: "5/8", close: "0.640", normal: "0.656", loose: "0.688" },
  { size: "3/4", close: "0.765", normal: "0.781", loose: "0.812" },
  { size: "7/8", close: "0.890", normal: "0.906", loose: "0.938" },
  { size: "1", close: "1.015", normal: "1.031", loose: "1.062" },
];

const DRILL_ROWS = [
  { type: "Number", size: "#80", decimal: "0.0135" },
  { type: "Number", size: "#70", decimal: "0.0280" },
  { type: "Number", size: "#60", decimal: "0.0400" },
  { type: "Number", size: "#56", decimal: "0.0465" },
  { type: "Number", size: "#53", decimal: "0.0595" },
  { type: "Number", size: "#50", decimal: "0.0700" },
  { type: "Number", size: "#43", decimal: "0.0890" },
  { type: "Number", size: "#36", decimal: "0.1065" },
  { type: "Number", size: "#29", decimal: "0.1360" },
  { type: "Number", size: "#25", decimal: "0.1495" },
  { type: "Number", size: "#21", decimal: "0.1590" },
  { type: "Number", size: "#16", decimal: "0.1770" },
  { type: "Number", size: "#7", decimal: "0.2010" },
  { type: "Number", size: "#3", decimal: "0.2130" },
  { type: "Letter", size: "F", decimal: "0.2570" },
  { type: "Letter", size: "I", decimal: "0.2720" },
  { type: "Letter", size: "Q", decimal: "0.3320" },
  { type: "Letter", size: "U", decimal: "0.3680" },
  { type: "Fraction", size: "7/32", decimal: "0.2188" },
  { type: "Fraction", size: "1/4", decimal: "0.2500" },
  { type: "Fraction", size: "5/16", decimal: "0.3125" },
  { type: "Fraction", size: "25/64", decimal: "0.3906" },
  { type: "Fraction", size: "27/64", decimal: "0.4219" },
  { type: "Fraction", size: "29/64", decimal: "0.4531" },
  { type: "Fraction", size: "1/2", decimal: "0.5000" },
  { type: "Fraction", size: "17/32", decimal: "0.5313" },
  { type: "Fraction", size: "11/16", decimal: "0.6875" },
  { type: "Fraction", size: "7/8", decimal: "0.8750" },
];

const FASTENER_ROWS = [
  { size: "#10", hexHead: "3/8", nut: "3/8", washer: "#10" },
  { size: "1/4", hexHead: "7/16", nut: "7/16", washer: "1/4" },
  { size: "5/16", hexHead: "1/2", nut: "1/2", washer: "5/16" },
  { size: "3/8", hexHead: "9/16", nut: "9/16", washer: "3/8" },
  { size: "7/16", hexHead: "5/8", nut: "5/8", washer: "7/16" },
  { size: "1/2", hexHead: "3/4", nut: "3/4", washer: "1/2" },
  { size: "9/16", hexHead: "13/16", nut: "13/16", washer: "9/16" },
  { size: "5/8", hexHead: "15/16", nut: "15/16", washer: "5/8" },
  { size: "3/4", hexHead: "1-1/8", nut: "1-1/8", washer: "3/4" },
  { size: "7/8", hexHead: "1-5/16", nut: "1-5/16", washer: "7/8" },
  { size: "1", hexHead: "1-1/2", nut: "1-1/2", washer: "1" },
];

const QUICK_PILLS = [
  "10-24",
  "10-32",
  "1/4-20",
  "1/4-28",
  "5/16-18",
  "3/8-16",
  "3/8-24",
  "1/2-13",
];

const NOTEBOOK_TABS = [
  { key: "tap", label: "Tap Drill", activeClass: "bg-emerald-600 text-white", idleClass: "bg-white/80 text-black/70" },
  { key: "clearance", label: "Clearance", activeClass: "bg-blue-600 text-white", idleClass: "bg-white/80 text-black/70" },
  { key: "drill", label: "Drill Sizes", activeClass: "bg-amber-600 text-white", idleClass: "bg-white/80 text-black/70" },
  { key: "fastener", label: "Fasteners", activeClass: "bg-zinc-700 text-white", idleClass: "bg-white/80 text-black/70" },
];

function GraphBackdrop() {
  const horizontal = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        top: `${8 + i * 6.6}%`,
        delay: `${(i % 6) * 0.35}s`,
      })),
    []
  );

  const vertical = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${6 + i * 7.8}%`,
        delay: `${(i % 5) * 0.45}s`,
      })),
    []
  );

  const points = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${8 + i * 4.6}%`,
        top: `${18 + ((i * 11) % 36)}%`,
        delay: `${(i % 8) * 0.3}s`,
      })),
    []
  );

  const labels = useMemo(
    () =>
      ["#29", "#21", "#7", "F", "5/16", "Q", "29/64", "11/16"].map(
        (value, i) => ({
          id: i,
          value,
          left: `${10 + i * 10.2}%`,
          top: `${14 + (i % 2) * 8}%`,
          delay: `${i * 0.32}s`,
        })
      ),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_42%),linear-gradient(to_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(16,185,129,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.14)_1px,transparent_1px)] [background-size:42px_42px]" />

      {horizontal.map((line) => (
        <span
          key={`h-${line.id}`}
          className="absolute left-0 right-0 h-px bg-emerald-400/20 animate-pulse"
          style={{ top: line.top, animationDelay: line.delay }}
        />
      ))}

      {vertical.map((line) => (
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
          d="M40 560 C150 490, 260 520, 360 450 S580 300, 720 360 S930 520, 1160 290"
          fill="none"
          stroke="rgba(52,211,153,0.34)"
          strokeWidth="2"
        />
        <path
          d="M40 620 C180 580, 290 640, 420 600 S710 500, 840 560 S1030 620, 1170 520"
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
  );
}

function QuickRefPill({ value, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        isActive
          ? "border-emerald-400 bg-emerald-500/15 text-white"
          : "border-emerald-500/20 bg-emerald-500/8 text-zinc-200 hover:border-emerald-400"
      }`}
    >
      {value}
    </button>
  );
}

function NotebookTab({ tab, activeTab, onClick }) {
  const isActive = activeTab === tab.key;

  return (
    <button
      onClick={() => onClick(tab.key)}
      className={`rounded-t-xl border border-black/20 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
        isActive
          ? `${tab.activeClass} translate-y-[2px] shadow-[0_8px_18px_rgba(0,0,0,0.20)]`
          : `${tab.idleClass} hover:-translate-y-[1px]`
      }`}
    >
      {tab.label}
    </button>
  );
}

function NotebookPanel({ activeTab, children }) {
  return (
    <div
      key={activeTab}
      className="animate-[pageFlip_340ms_ease] will-change-transform"
    >
      {children}
    </div>
  );
}

function FooterStatusPanel({ activeTab, family, searchTerm }) {
  const tabLabel =
    activeTab === "tap"
      ? `Tap Drill / ${family}`
      : activeTab === "clearance"
      ? "Clearance Holes"
      : activeTab === "drill"
      ? "Drill Bit Sizes"
      : "Fastener Reference";

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
              Drilling & Fastener Notebook
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Active Tab
            </p>
            <p className="mt-3 text-xl font-semibold text-white">{tabLabel}</p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Search Filter
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {searchTerm ? `Active: ${searchTerm}` : "No filter active"}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Companion Tabs
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Tap Drill, Clearance, Drill Sizes, Fasteners
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TapDrillChart() {
  const [family, setFamily] = useState("UNC");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tap");

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
      @keyframes pageFlip {
        0% { opacity: 0; transform: perspective(1000px) rotateY(-8deg) translateX(18px); }
        100% { opacity: 1; transform: perspective(1000px) rotateY(0deg) translateX(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const rows = family === "UNC" ? UNC_ROWS : UNF_ROWS;

  const filteredTapRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter(
      (row) =>
        row.thread.toLowerCase().includes(term) ||
        row.tapDrill.toLowerCase().includes(term) ||
        row.decimal.toLowerCase().includes(term) ||
        row.major.toLowerCase().includes(term) ||
        row.tpi.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  const filteredClearanceRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return CLEARANCE_ROWS;

    return CLEARANCE_ROWS.filter(
      (row) =>
        row.size.toLowerCase().includes(term) ||
        row.close.toLowerCase().includes(term) ||
        row.normal.toLowerCase().includes(term) ||
        row.loose.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredDrillRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return DRILL_ROWS;

    return DRILL_ROWS.filter(
      (row) =>
        row.type.toLowerCase().includes(term) ||
        row.size.toLowerCase().includes(term) ||
        row.decimal.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredFastenerRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return FASTENER_ROWS;

    return FASTENER_ROWS.filter(
      (row) =>
        row.size.toLowerCase().includes(term) ||
        row.hexHead.toLowerCase().includes(term) ||
        row.nut.toLowerCase().includes(term) ||
        row.washer.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const tabTitle =
    activeTab === "tap"
      ? "Tap Drill Lookup"
      : activeTab === "clearance"
      ? "Clearance Hole Lookup"
      : activeTab === "drill"
      ? "Drill Bit Size Lookup"
      : "Fastener Reference Lookup";

  const tabDescription =
    activeTab === "tap"
      ? "Search by thread, drill size, or decimal and switch between UNC and UNF thread families."
      : activeTab === "clearance"
      ? "Compare close, normal, and loose clearance hole values for common fastener sizes."
      : activeTab === "drill"
      ? "Quick lookup for number, letter, and fractional drill sizes with decimal equivalents."
      : "Quick fastener companion reference for common bolt sizes, hex heads, nuts, and washers.";

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Tap Drill Chart | RuntWerkx</title>
        <meta
          name="description"
          content="Use the RuntWerkx Tap Drill Chart notebook for quick tap drill lookup, clearance holes, drill bit sizes, and fastener reference values."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Tap Drill Chart | RuntWerkx" />
        <meta
          property="og:description"
          content="Drilling and fastener reference notebook with tap drill, clearance hole, drill size, and fastener lookup tables."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="RuntWerkx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tap Drill Chart | RuntWerkx" />
        <meta
          name="twitter:description"
          content="Drilling and fastener reference notebook with tap drill, clearance hole, drill size, and fastener lookup tables."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            name: "RuntWerkx Tap Drill Chart",
            url: PAGE_URL,
            description:
              "Drilling and fastener reference notebook with tap drill lookup, clearance holes, drill sizes, and fastener references.",
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
              Drilling & Fastener Reference
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300 md:text-xl">
              Quick notebook-style reference for tap drill sizes, clearance holes,
              drill bit sizes, and common fastener dimensions.
            </p>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-zinc-400">
              Use this page to move quickly between thread size, TPI, tap drill,
              decimal drill equivalents, clearance holes, and common fastener
              reference values without leaving the page.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {QUICK_PILLS.map((item) => (
                <QuickRefPill
                  key={item}
                  value={item}
                  isActive={searchTerm === item.toLowerCase()}
                  onClick={() =>
                    setSearchTerm((prev) =>
                      prev.toLowerCase() === item.toLowerCase() ? "" : item
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Reference Sheet ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  {tabTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  {tabDescription}
                </p>
              </div>

              <div className="relative overflow-visible rounded-[2.2rem] border border-zinc-700/60 bg-[#f6f3e8] text-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="absolute -top-10 left-10 z-20 flex flex-wrap gap-2">
                  {NOTEBOOK_TABS.map((tab) => (
                    <NotebookTab
                      key={tab.key}
                      tab={tab}
                      activeTab={activeTab}
                      onClick={setActiveTab}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:100%_38px] opacity-80" />
                <div className="absolute bottom-0 left-[68px] top-0 w-px bg-red-400/60" />
                <div className="absolute inset-0 animate-[notebookDrift_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%)]" />

                <div className="relative z-10 px-6 pb-8 pt-8 md:px-10">
                  <div className="ml-[22px] md:ml-[30px]">
                    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
                          RuntWerkx Reference
                        </p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">
                          Drilling & Fastener Notebook
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70">
                          Unified quick reference for tap drill sizes, clearance
                          holes, drill bit sizes, and common fastener dimensions.
                        </p>
                      </div>

                      <div className="flex w-full flex-col gap-3 xl:w-[420px]">
                        {activeTab === "tap" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => setFamily("UNC")}
                              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                                family === "UNC"
                                  ? "bg-emerald-600 text-white"
                                  : "border border-black/10 bg-white/70 text-black/70"
                              }`}
                            >
                              UNC
                            </button>
                            <button
                              onClick={() => setFamily("UNF")}
                              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                                family === "UNF"
                                  ? "bg-emerald-600 text-white"
                                  : "border border-black/10 bg-white/70 text-black/70"
                              }`}
                            >
                              UNF
                            </button>
                          </div>
                        )}

                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            activeTab === "tap"
                              ? "Try 1/4-20, #7, 10-32, or 0.2010"
                              : activeTab === "clearance"
                              ? "Try 1/4, 3/8, or 0.531"
                              : activeTab === "drill"
                              ? "Try #21, F, 5/16, or 0.257"
                              : "Try 1/2, 3/4, or washer"
                          }
                          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-base outline-none placeholder:text-black/35"
                        />
                      </div>
                    </div>

                    <NotebookPanel activeTab={activeTab}>
                      {activeTab === "tap" && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-5 border-b border-black/10 bg-emerald-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Thread</div>
                              <div>Major</div>
                              <div>TPI</div>
                              <div>Tap Drill</div>
                              <div>Decimal</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredTapRows.map((row, index) => (
                                <div
                                  key={`${family}-${row.thread}`}
                                  className={`grid grid-cols-5 px-5 py-3 text-base ${
                                    index % 2 === 0 ? "bg-black/[0.02]" : "bg-transparent"
                                  }`}
                                >
                                  <div className="font-semibold">{row.thread}</div>
                                  <div>{row.major}</div>
                                  <div>{row.tpi}</div>
                                  <div>{row.tapDrill}</div>
                                  <div>{row.decimal}</div>
                                </div>
                              ))}

                              {filteredTapRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Reverse Lookup Notes
                              </p>
                              <div className="mt-4 space-y-2 font-mono text-base leading-7 text-black/78">
                                <p>#7 → 1/4-20</p>
                                <p>#21 → 10-32</p>
                                <p>F → 5/16-18</p>
                                <p>Q → 3/8-24</p>
                                <p>29/64 → 1/2-20</p>
                                <p>11/16 → 3/4-16</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                                Use Notes
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>
                                  UNC is the coarse thread series and UNF is the fine
                                  thread series.
                                </p>
                                <p>
                                  Tap drill size is chosen to leave enough material for
                                  thread formation without making tapping unnecessarily hard.
                                </p>
                                <p>
                                  Always confirm requirements for material, fit class,
                                  and shop standard before drilling production parts.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "clearance" && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-blue-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Size</div>
                              <div>Close Fit</div>
                              <div>Normal Fit</div>
                              <div>Loose Fit</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredClearanceRows.map((row, index) => (
                                <div
                                  key={`clearance-${row.size}`}
                                  className={`grid grid-cols-4 px-5 py-3 text-base ${
                                    index % 2 === 0 ? "bg-black/[0.02]" : "bg-transparent"
                                  }`}
                                >
                                  <div className="font-semibold">{row.size}</div>
                                  <div>{row.close}</div>
                                  <div>{row.normal}</div>
                                  <div>{row.loose}</div>
                                </div>
                              ))}

                              {filteredClearanceRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Fit Guidance
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Close fit is tighter and used when movement should be limited.</p>
                                <p>Normal fit is the general-use go-to in many shop applications.</p>
                                <p>Loose fit gives extra room for alignment or easier field assembly.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                                Shop Note
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Always check print requirements and tolerance expectations before drilling holes intended for bolted assembly.</p>
                                <p>Coatings, galvanizing, and field fit conditions can all affect the final hole choice.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "drill" && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-3 border-b border-black/10 bg-amber-900/[0.06] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Type</div>
                              <div>Size</div>
                              <div>Decimal</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredDrillRows.map((row, index) => (
                                <div
                                  key={`drill-${row.type}-${row.size}`}
                                  className={`grid grid-cols-3 px-5 py-3 text-base ${
                                    index % 2 === 0 ? "bg-black/[0.02]" : "bg-transparent"
                                  }`}
                                >
                                  <div className="font-semibold">{row.type}</div>
                                  <div>{row.size}</div>
                                  <div>{row.decimal}</div>
                                </div>
                              ))}

                              {filteredDrillRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Bit Type Notes
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Number drills are common in tapping and smaller hole work.</p>
                                <p>Letter drills fill the gap between many number and fractional sizes.</p>
                                <p>Fractional drills are common in fabrication and general shop drilling.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                                Quick Match
                              </p>
                              <div className="mt-4 space-y-2 font-mono text-base leading-7 text-black/78">
                                <p>#7 = 0.2010</p>
                                <p>#21 = 0.1590</p>
                                <p>F = 0.2570</p>
                                <p>Q = 0.3320</p>
                                <p>5/16 = 0.3125</p>
                                <p>11/16 = 0.6875</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "fastener" && (
                        <>
                          <div className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/45">
                            <div className="grid grid-cols-4 border-b border-black/10 bg-zinc-900/[0.08] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black/70">
                              <div>Size</div>
                              <div>Hex Head</div>
                              <div>Nut Size</div>
                              <div>Washer</div>
                            </div>

                            <div className="max-h-[900px] overflow-auto">
                              {filteredFastenerRows.map((row, index) => (
                                <div
                                  key={`fastener-${row.size}`}
                                  className={`grid grid-cols-4 px-5 py-3 text-base ${
                                    index % 2 === 0 ? "bg-black/[0.02]" : "bg-transparent"
                                  }`}
                                >
                                  <div className="font-semibold">{row.size}</div>
                                  <div>{row.hexHead}</div>
                                  <div>{row.nut}</div>
                                  <div>{row.washer}</div>
                                </div>
                              ))}

                              {filteredFastenerRows.length === 0 && (
                                <div className="px-5 py-8 text-center text-black/60">
                                  No chart rows matched that search.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">
                                Fastener Note
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>These are quick common-use reference values and should be confirmed against the exact fastener standard, grade, and spec in use.</p>
                                <p>Different standards and specialty hardware can vary.</p>
                              </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-black/10 bg-white/50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-700">
                                Good Companion Uses
                              </p>
                              <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
                                <p>Quick head wrench size checks.</p>
                                <p>Washer selection reference.</p>
                                <p>Assembly prep and field hardware verification.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </NotebookPanel>

                    <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-emerald-950/[0.04] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
                        Fast Read Strip
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {activeTab === "tap" &&
                          [
                            "10-24 → #25",
                            "10-32 → #21",
                            "1/4-20 → #7",
                            "1/4-28 → 7/32",
                            "5/16-18 → F",
                            "3/8-16 → 5/16",
                            "3/8-24 → Q",
                            "1/2-13 → 27/64",
                          ].map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80"
                            >
                              {item}
                            </span>
                          ))}

                        {activeTab === "clearance" &&
                          [
                            "1/4 normal → 0.266",
                            "5/16 normal → 0.332",
                            "3/8 normal → 0.397",
                            "1/2 normal → 0.531",
                          ].map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80"
                            >
                              {item}
                            </span>
                          ))}

                        {activeTab === "drill" &&
                          [
                            "#7 = 0.2010",
                            "#21 = 0.1590",
                            "F = 0.2570",
                            "Q = 0.3320",
                            "5/16 = 0.3125",
                            "11/16 = 0.6875",
                          ].map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80"
                            >
                              {item}
                            </span>
                          ))}

                        {activeTab === "fastener" &&
                          [
                            "1/4 → 7/16 head",
                            "3/8 → 9/16 head",
                            "1/2 → 3/4 head",
                            "3/4 → 1-1/8 head",
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

            <div>
              <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-400">
                  ― Quick Notes ―
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Reference Companion
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-400">
                  Fast grab notes for everyday drilling and fastener work.
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Active Reference
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>
                      {activeTab === "tap" &&
                        "Tap drill lookup for UNC and UNF threads with decimal drill equivalents."}
                      {activeTab === "clearance" &&
                        "Clearance hole reference for close, normal, and loose fit conditions."}
                      {activeTab === "drill" &&
                        "Drill bit reference covering number, letter, and fractional sizes."}
                      {activeTab === "fastener" &&
                        "Fastener companion reference for common bolt, head, nut, and washer sizes."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Why It Matters
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Helps reduce hunting through multiple references during setup.</p>
                    <p>Keeps drilling, tapping, and assembly info in one place.</p>
                    <p>Useful for shop prep, field checks, and layout support.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-zinc-800 bg-zinc-950/65 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">
                    Notebook System
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Tap Drill tab for threading prep.</p>
                    <p>Clearance tab for assembly holes.</p>
                    <p>Drill Size tab for direct bit lookup.</p>
                    <p>Fastener tab for common hardware reference.</p>
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
                Built for practical drilling, tapping, and fastener reference
              </h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">
                This notebook-style reference is built for quick use during
                machining, fabrication, and general shop work. Use it to find
                common tap drill values, clearance hole sizes, drill bit size
                conversions, and basic fastener dimensions so setup decisions
                are faster and easier to verify.
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
                  to="/knowledge-library/calculators-charts-conversions/decimal-fraction-chart"
                  className="rounded-full border border-zinc-700 bg-black/40 px-5 py-3 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                >
                  Decimal / Fraction Chart
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
            activeTab={activeTab}
            family={family}
            searchTerm={searchTerm}
          />
        </div>
      </section>
    </div>
  );
}