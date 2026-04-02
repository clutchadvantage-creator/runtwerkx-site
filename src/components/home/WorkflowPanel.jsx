export default function WorkflowPanel() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] overflow-hidden px-6 pt-2 pb-1">
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.16)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,197,94,0.10),transparent_42%)]" />

      {/* HEADER */}
      <div className="relative mb-3 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-green-400">
          ― Systems Minded ―
        </div>
        <div className="mt-1 text-[2rem] font-bold leading-none text-white sm:text-[2.15rem]">
          Our Development Process
        </div>
      </div>

      {/* FLOW */}
      <div className="relative mx-auto h-[190px] w-full max-w-[420px] text-center">
        
        {/* TOP */}
        <div className="absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 text-[20px] font-bold uppercase tracking-[0.12em] text-green-300">
          Prototype
        </div>

        {/* LEFT */}
        <div className="absolute left-[18%] top-[36%] -translate-x-1/2 -translate-y-1/2 text-[18px] font-bold uppercase tracking-[0.12em] text-green-300">
          Observe
        </div>

        {/* RIGHT */}
        <div className="absolute left-[82%] top-[36%] -translate-x-1/2 -translate-y-1/2 text-[18px] font-bold uppercase tracking-[0.12em] text-green-300">
          Test
        </div>

        {/* BOTTOM */}
        <div className="absolute left-1/2 top-[90%] -translate-x-1/2 -translate-y-1/2 text-[20px] font-bold uppercase tracking-[0.12em] text-green-300">
          Build
        </div>

        <svg
          viewBox="0 0 420 190"
          className="absolute inset-0 h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.0)" />
              <stop offset="50%" stopColor="rgba(74,222,128,0.95)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.0)" />
            </linearGradient>
            <radialGradient id="flowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(134,239,172,0.95)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </radialGradient>
          </defs>

          <path d="M102 58 C138 58, 156 42, 188 42" stroke="url(#flowLine)" strokeWidth="2" strokeLinecap="round" />
          <path d="M232 42 C264 42, 282 58, 318 58" stroke="url(#flowLine)" strokeWidth="2" strokeLinecap="round" />
          <path d="M210 66 C160 90, 145 120, 145 150" stroke="url(#flowLine)" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <path d="M210 66 C260 90, 275 120, 275 150" stroke="url(#flowLine)" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <path d="M210 66 L210 150" stroke="url(#flowLine)" strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />

          <circle cx="140" cy="52" r="3.2" fill="#4ade80" />
          <circle cx="210" cy="42" r="3.2" fill="#4ade80" />
          <circle cx="280" cy="52" r="3.2" fill="#4ade80" />
          <circle cx="210" cy="150" r="3.8" fill="url(#flowGlow)" />
          <circle cx="145" cy="150" r="3.2" fill="#4ade80" opacity="0.95" />
          <circle cx="275" cy="150" r="3.2" fill="#4ade80" opacity="0.95" />

          <circle cx="122" cy="56" r="2.8" fill="#86efac">
            <animate attributeName="cx" values="102;188;102" dur="3.2s" repeatCount="indefinite" />
          </circle>

          <circle cx="298" cy="56" r="2.8" fill="#86efac">
            <animate attributeName="cx" values="232;318;232" dur="3.6s" repeatCount="indefinite" />
          </circle>

          <circle cx="210" cy="92" r="2.8" fill="#86efac">
            <animate attributeName="cy" values="66;150;66" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  )
}