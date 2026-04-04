import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const AEGISONE_PREORDER_LINKS = {
  bronze: 'https://buy.stripe.com/00wfZhcLsgoc5kj0pu4ZG05',
  silver: 'https://buy.stripe.com/28E7sL4eW5JydQPegk4ZG04',
  gold: 'https://buy.stripe.com/cNi8wPh1I8VK3cba044ZG03',
}

const AEGISONE_BILLING = {
  portal: 'https://billing.stripe.com/YOUR_PORTAL_LINK',
}

function mailtoLink(subject, body = '') {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body) params.set('body', body)
  return `mailto:runtwerkx.dev@gmail.com?${params.toString()}`
}

function ModuleSection({ module, reverse = false, featured = false }) {
  return (
    <div className="group grid animate-[fadeUp_0.6s_ease-out_forwards] items-center gap-12 opacity-0 translate-y-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <div className={`${reverse ? 'md:order-2' : ''} text-center`}>
        <div className="mx-auto max-w-xl">
          <div className="text-center text-[10px] uppercase tracking-[0.28em] text-green-400">
            {module.eyebrow}
          </div>

          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            {module.title}
          </h3>

          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/68 md:text-lg">
            {module.summary}
          </p>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/56 md:text-base">
            {module.detail}
          </p>
        </div>
      </div>

      <div className={`${reverse ? 'md:order-1' : ''}`}>
        <div className="relative group">
          <div className="absolute -inset-6 bg-green-500/10 blur-3xl opacity-30 transition duration-500 group-hover:opacity-50" />

          <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#0a0d0b] shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
            <img
              src={module.image}
              alt={module.title}
              className={`w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 ${
                featured ? 'h-[360px] md:h-[540px]' : 'h-[320px] md:h-[460px]'
              }`}
            />

            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MicroCTA() {
  return (
    <div className="animate-[fadeUp_0.6s_ease-out_forwards] py-16 text-center opacity-0 translate-y-6">
      <div className="inline-block rounded-[1.5rem] border border-white/10 bg-white/[0.02] px-8 py-10 backdrop-blur-sm">
        <h4 className="text-xl font-semibold text-white md:text-2xl">
          See how AegisOne works in your operation
        </h4>

        <p className="mt-3 text-sm text-white/60 md:text-base">
          Get a walkthrough of the platform and how it fits into your workflow.
        </p>

        <a
          href={mailtoLink(
            'AegisOne Demo Request',
            'Hello RuntWerkx,%0D%0A%0D%0AI would like to request an AegisOne demo.'
          )}
          className="mt-6 inline-flex rounded-xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.03]"
        >
          Request Demo →
        </a>
      </div>
    </div>
  )
}

function PlatformShowcase() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-10 md:pb-12 md:pt-14">
      <div className="mb-8 mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-green-400">
          ― Platform Overview ―
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl">
          A unified command surface for industrial safety operations
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
          AegisOne brings incidents, investigations, inspections, corrective actions,
          training visibility, and analytics into one operational platform designed for
          real-world industrial environments.
        </p>
      </div>

      <div className="group relative">
        <div className="absolute -inset-6 rounded-[2.5rem] bg-green-500/10 blur-3xl opacity-35 transition duration-500 group-hover:opacity-55" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0d0b] shadow-[0_30px_100px_rgba(0,0,0,0.72)]">
          <img
            src="/images/AegisOnePrototype.png"
            alt="AegisOne platform overview"
            className="h-[320px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.015] md:h-[620px]"
          />

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/25 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/20 to-transparent" />

          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-sm md:left-6 md:top-6">
            Working Prototype
          </div>

          <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6">
            <div className="max-w-2xl rounded-[1.25rem] border border-white/10 bg-black/38 px-4 py-4 backdrop-blur-md md:px-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-green-400">
                ― Built For Industry ―
              </div>
              <p className="mt-2 text-sm leading-7 text-white/78 md:text-base">
                One connected system for reporting, accountability, follow-up, and visibility
                across your safety workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SafetyScanBand() {
  const nodes = [
    { left: '8%', top: '48%', delay: '0s', duration: '4.5s' },
    { left: '18%', top: '30%', delay: '0.8s', duration: '5.2s' },
    { left: '30%', top: '62%', delay: '1.4s', duration: '4.8s' },
    { left: '42%', top: '24%', delay: '0.4s', duration: '5.5s' },
    { left: '55%', top: '54%', delay: '1.1s', duration: '4.6s' },
    { left: '66%', top: '34%', delay: '1.8s', duration: '5.1s' },
    { left: '78%', top: '64%', delay: '0.6s', duration: '4.9s' },
    { left: '90%', top: '40%', delay: '1.5s', duration: '5.4s' },
  ]

  const ringNodes = [
    { left: '30%', top: '62%', delay: '0.5s' },
    { left: '55%', top: '54%', delay: '2.8s' },
    { left: '78%', top: '64%', delay: '1.7s' },
  ]

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-6 md:py-8">
      <div className="relative overflow-hidden rounded-[1.9rem] border border-green-500/15 bg-[#08100b]/90 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(34,197,94,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="absolute inset-y-0 left-0 w-[24%] bg-gradient-to-r from-transparent via-green-400/18 to-transparent blur-2xl animate-[scanSweep_7.5s_linear_infinite]" />

        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-green-400/25 to-transparent" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M96 118 L216 74 L360 148 L504 56 L660 128 L792 82 L936 154 L1080 96"
            fill="none"
            stroke="rgba(34,197,94,0.20)"
            strokeWidth="1.5"
          />
          <path
            d="M96 118 L216 74 L360 148 L504 56 L660 128 L792 82 L936 154 L1080 96"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.75"
            strokeDasharray="5 10"
          />
        </svg>

        {nodes.map((node, index) => (
          <div
            key={`node-${index}`}
            className="absolute"
            style={{ left: node.left, top: node.top }}
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-green-400/10 blur-md"
              style={{
                animation: `nodePulse ${node.duration} ease-in-out infinite`,
                animationDelay: node.delay,
              }}
            />
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border border-green-300/70 bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.55)]"
              style={{
                animation: `nodeCore ${node.duration} ease-in-out infinite`,
                animationDelay: node.delay,
              }}
            />
          </div>
        ))}

        {ringNodes.map((node, index) => (
          <div
            key={`ring-${index}`}
            className="absolute"
            style={{ left: node.left, top: node.top }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-green-400/80" />
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/35"
              style={{
                width: '18px',
                height: '18px',
                animation: 'ringPulse 4.8s ease-out infinite',
                animationDelay: node.delay,
              }}
            />
          </div>
        ))}

        <div className="relative z-10 flex min-h-[180px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[220px]">
          <div className="text-[10px] uppercase tracking-[0.32em] text-green-400">
            ― Live Safety Visibility ―
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            Monitor. Detect. Respond.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
            A connected operational safety layer built to surface issues, support follow-up,
            and improve visibility across incidents, inspections, actions, and training.
          </p>
        </div>
      </div>
    </section>
  )
}

function SafetyCommitmentSection() {
  return (
    <section className="mx-auto max-w-7xl animate-[fadeUp_0.8s_ease-out_forwards] px-6 pb-24 pt-10 opacity-0 translate-y-6 md:pt-16">
      <div className="relative">
        <img
          src="/images/sheildswordnew2.png"
          alt="Industrial safety leadership and field operations"
          className="h-[320px] w-full object-cover object-center md:h-[560px]"
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-green-400">
          ― RuntWerkx Safety Commitment ―
        </p>

        <p className="mt-5 text-base leading-8 text-white/72 md:text-lg md:leading-9">
          RuntWerkx believes that safety implementation should be practical, visible, and
          supported at every level of an operation. Across manufacturing, fabrication,
          logistics, construction, energy, and other industrial environments, strong safety
          systems help teams communicate better, respond faster, stay accountable, and build
          a healthier operational culture. AegisOne is designed to support that mission by
          giving organizations a connected platform for reporting, follow-up, training,
          visibility, and continuous improvement — because safer operations are stronger
          operations.
        </p>
      </div>
    </section>
  )
}

function AegisOnePreorderSection({ isHighlighted = false }) {
  return (
    <section
      id="founders"
      className="border-t border-white/10 bg-black scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div
          className={`mx-auto rounded-[2rem] border px-6 py-10 transition-all duration-700 md:px-10 ${
            isHighlighted
              ? 'border-green-400/45 bg-green-500/[0.04] shadow-[0_0_40px_rgba(34,197,94,0.16)]'
              : 'border-transparent bg-transparent shadow-none'
          }`}
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              ― Founder Pre-Orders ―
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Reserve early access to AegisOne
            </h2>

            <p className="mt-6 text-white/70 max-w-3xl mx-auto leading-8">
              AegisOne is currently in development. Founder pre-orders help support development
              and secure priority access to install packages when the platform is ready.
            </p>

            <p className="mt-4 text-sm text-white/50 max-w-3xl mx-auto leading-7">
              Founder supporters will be the first to receive AegisOne install packages and
              their version of the platform will include a permanent Founder watermark badge.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            <div className="rounded-3xl border border-[#cd7f32]/30 bg-black/60 p-8 text-center transition hover:shadow-[0_0_24px_rgba(205,127,50,0.14)]">
              <div className="text-[#cd7f32] text-sm uppercase tracking-[0.2em]">
                Bronze Founder
              </div>

              <div className="mt-4 text-4xl font-bold text-white">$250</div>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Early project support for AegisOne development with priority access
                to install packages at launch.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>✔ Bronze Founder Watermark</li>
                <li>✔ Early Access Queue</li>
                <li>✔ Priority Install Delivery</li>
              </ul>

              <a
                href={AEGISONE_PREORDER_LINKS.bronze}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#cd7f32] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Pre-Order Bronze
              </a>
            </div>

            <div className="rounded-3xl border border-[#c0c0c0]/30 bg-black/60 p-8 text-center transition hover:shadow-[0_0_24px_rgba(192,192,192,0.12)]">
              <div className="text-[#c0c0c0] text-sm uppercase tracking-[0.2em]">
                Silver Founder
              </div>

              <div className="mt-4 text-4xl font-bold text-white">$500</div>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Stronger early support tier with higher priority access when AegisOne
                is ready for rollout.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>✔ Silver Founder Watermark</li>
                <li>✔ Higher Priority Access</li>
                <li>✔ Early Install Delivery</li>
              </ul>

              <a
                href={AEGISONE_PREORDER_LINKS.silver}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#c0c0c0] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Pre-Order Silver
              </a>
            </div>

            <div className="rounded-3xl border border-[#d4af37]/30 bg-black/70 p-8 text-center transition hover:shadow-[0_0_24px_rgba(212,175,55,0.16)]">
              <div className="flex items-center justify-center gap-2">
                <div className="text-[#d4af37] text-sm uppercase tracking-[0.2em]">
                  Gold Founder
                </div>
                <span className="rounded-full border border-[#d4af37]/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                  Top Tier
                </span>
              </div>

              <div className="mt-4 text-4xl font-bold text-white">$1000</div>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Highest early support tier with first priority for install packages
                and the most premium founder designation.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>✔ Gold Founder Watermark</li>
                <li>✔ Highest Priority Access</li>
                <li>✔ First Install Releases</li>
              </ul>

              <a
                href={AEGISONE_PREORDER_LINKS.gold}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Pre-Order Gold
              </a>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.12)]">
              <h3 className="text-xl font-bold text-green-400">~In The Know~</h3>

              <p className="mt-4 text-sm leading-7 text-white/70">
                AegisOne is currently in active development and Founder pre-orders
                help support the build as it moves toward launch.
              </p>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Founder supporters will be first in line for install packages and
                will receive a Founder badge watermark inside their app version.
              </p>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Billing, support, cancellations, and founder questions can be handled
                through the billing portal and support links below.
              </p>

              <a
                href={AEGISONE_BILLING.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-green-400/30 px-4 py-2 text-sm font-semibold text-green-300 transition hover:border-green-300 hover:text-green-200"
              >
                Manage Billing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AegisOneFooter() {
  return (
    <section className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">
            ― AegisOne ―
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Enterprise safety management built for real operations
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-white/70">
            AegisOne is designed to bring incidents, inspections, corrective actions,
            training visibility, and operational safety intelligence into one connected system.
          </p>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">AegisOne</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">
              A connected industrial safety management platform designed for visibility,
              accountability, follow-up, and stronger operational control.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href={mailtoLink(
                  'AegisOne Demo Request',
                  'Hello RuntWerkx,%0D%0A%0D%0AI would like to request a demo of AegisOne.'
                )}
                className="inline-flex rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Request Demo
              </a>

              <a
                href={mailtoLink(
                  'AegisOne Information Request',
                  'Hello RuntWerkx,%0D%0A%0D%0AI would like more information about AegisOne.'
                )}
                className="inline-flex rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-green-400 hover:text-green-400"
              >
                Request Info
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
              Founder Access
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <a
                href={AEGISONE_PREORDER_LINKS.bronze}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Bronze Founder Pre-Order
              </a>
              <a
                href={AEGISONE_PREORDER_LINKS.silver}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Silver Founder Pre-Order
              </a>
              <a
                href={AEGISONE_PREORDER_LINKS.gold}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Gold Founder Pre-Order
              </a>
              <a href="#top" className="transition hover:text-green-400">
                Platform Overview
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
              Customer Tools
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <a
                href={AEGISONE_BILLING.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Manage Billing
              </a>
              <a
                href={AEGISONE_BILLING.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Billing Portal
              </a>
              <a
                href={AEGISONE_BILLING.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-green-400"
              >
                Cancel / Billing Access
              </a>
              <a
                href={mailtoLink(
                  'AegisOne Founder Support Request',
                  'Hello RuntWerkx,%0D%0A%0D%0AI need support related to my AegisOne founder pre-order.'
                )}
                className="transition hover:text-green-400"
              >
                Founder Support
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-sm uppercase tracking-[0.2em] text-green-400">
              Resources
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <a
                href={mailtoLink(
                  'AegisOne Documentation Request',
                  'Hello RuntWerkx,%0D%0A%0D%0AI would like documentation or rollout updates for AegisOne.'
                )}
                className="transition hover:text-green-400"
              >
                Documentation / Rollout Updates
              </a>
              <a
                href={mailtoLink(
                  'AegisOne General Inquiry',
                  'Hello RuntWerkx,%0D%0A%0D%0AI have a general question about AegisOne.'
                )}
                className="transition hover:text-green-400"
              >
                General Inquiry
              </a>
              <Link to="/knowledge-library" className="transition hover:text-green-400">
                Knowledge Library
              </Link>
              <Link to="/file-router" className="transition hover:text-green-400">
                File Router
              </Link>
              <Link to="/" className="transition hover:text-green-400">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              RuntWerkx Systems ― AegisOne ― Built for Industry
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.18em] text-white/35 md:justify-end">
              <a
                href={mailtoLink('AegisOne Privacy Question')}
                className="transition hover:text-green-400"
              >
                Privacy
              </a>
              <a
                href={mailtoLink('AegisOne Terms Question')}
                className="transition hover:text-green-400"
              >
                Terms
              </a>
              <a
                href={mailtoLink('AegisOne Cancellation Question')}
                className="transition hover:text-green-400"
              >
                Cancellation
              </a>
              <a
                href={mailtoLink('AegisOne Support Request')}
                className="transition hover:text-green-400"
              >
                Support
              </a>
              <a href="tel:4179887395" className="transition hover:text-green-400">
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AegisOne() {
  const [parallaxY, setParallaxY] = useState(0)
  const [highlightFounders, setHighlightFounders] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = Math.min(window.scrollY * 0.18, 80)
      setParallaxY(offset)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const scrollToHashSection = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return

      const target = document.getElementById(hash)
      if (!target) return

      window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })

        if (hash === 'founders') {
          setHighlightFounders(true)
          window.setTimeout(() => {
            setHighlightFounders(false)
          }, 2600)
        }
      }, 120)
    }

    scrollToHashSection()
    window.addEventListener('hashchange', scrollToHashSection)

    return () => {
      window.removeEventListener('hashchange', scrollToHashSection)
    }
  }, [])

  const modules = useMemo(
    () => [
      {
        id: 'incident',
        eyebrow: '― Incident Reporting ―',
        title: 'Incident Management',
        summary:
          'Capture incidents, near misses, and safety events in one connected workflow.',
        detail:
          'Log events, assign ownership, track status, and maintain a clean operational record without relying on scattered emails or spreadsheets.',
        image: '/images/incidentreport.png',
      },
      {
        id: 'audits-risk',
        eyebrow: '― Audits, Inspections & Risk ―',
        title: 'Audits & Risk Control',
        summary:
          'Run inspections, observations, audits, and risk reviews in one system.',
        detail:
          'Document findings, evaluate exposure, and connect hazards directly to follow-up actions with better visibility across teams.',
        image: '/images/inspections.png',
      },
      {
        id: 'actions',
        eyebrow: '― Action Tracking ―',
        title: 'Corrective Actions',
        summary:
          'Assign, track, and verify corrective actions without losing ownership.',
        detail:
          'Tie follow-up work to incidents and audits with due dates, status tracking, and clear closure visibility.',
        image: '/images/correctiveaction.png',
      },
      {
        id: 'training',
        eyebrow: '― Training & Qualifications ―',
        title: 'Training Tracking',
        summary:
          'Track qualifications, expirations, and required workforce training.',
        detail:
          'Maintain visibility into workforce readiness and reduce surprises from expired or missing certifications.',
        image: '/images/trainingrecord.png',
      },
      {
        id: 'analytics',
        eyebrow: '― Analytics & Visibility ―',
        title: 'Analytics Dashboard',
        summary:
          'Monitor trends, backlog pressure, and safety performance in real time.',
        detail:
          'Turn safety data into actionable insight so leadership can identify problems early and act faster.',
        image: '/images/riskmatrix.png',
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative overflow-hidden" id="top">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_18%)]" />
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,197,94,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.18)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-green-500/20 blur-[110px] animate-pulse" />
          <div className="absolute right-[-5rem] top-[-3rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px] animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/8 to-transparent" />
        </div>

        <section className="relative z-10 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="relative overflow-hidden rounded-[2rem] border border-green-500/20 bg-black/70">
              <img
                src="/images/AegisOne4.png"
                alt="AegisOne"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: `translate3d(0, ${parallaxY * 0.12}px, 0)` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

              <div className="relative z-10 px-8 py-20 text-center md:px-12">
                <div className="mx-auto max-w-4xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                    ― Safety Platform ―
                  </p>

                  <h1 className="mt-6 text-5xl font-black md:text-7xl">
                    Industrial Safety Management & EHS
                  </h1>

                  <p className="mx-auto mt-6 max-w-2xl text-white/75">
                    A modular, enterprise-grade safety management system built for real operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PlatformShowcase />
        <SafetyScanBand />

        <section className="mx-auto max-w-7xl space-y-20 px-6 pb-20 pt-10">
          {modules.map((module, index) => (
            <div key={module.id}>
              <ModuleSection
                module={module}
                reverse={index % 2 === 1}
                featured={index === 0}
              />

              {index < modules.length - 1 && (
                <div className="my-16 h-px w-full bg-white/5" />
              )}

              {index === 1 && <MicroCTA />}
            </div>
          ))}
        </section>

        <SafetyCommitmentSection />
        <AegisOnePreorderSection isHighlighted={highlightFounders} />
      </main>

      <AegisOneFooter />

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scanSweep {
          0% {
            transform: translateX(-130%);
          }
          100% {
            transform: translateX(520%);
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes nodeCore {
          0%, 100% {
            opacity: 0.65;
            transform: translate(-50%, -50%) scale(0.95);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes ringPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.45);
          }
          18% {
            opacity: 0.55;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(5.5);
          }
        }
      `}</style>
    </div>
  )
}