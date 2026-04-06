import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Download, ArrowUpRight, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'

const FILE_ROUTER_BILLING_LINKS = {
  portal: 'https://billing.stripe.com/p/login/4gMbJ19zg6NC3cb1ty4ZG00',
}

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Success() {
  const query = useQuery()
  const sessionId = query.get('session_id')

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_20%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-10" />

        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="rounded-[2rem] border border-green-400/20 bg-white/5 p-8 text-center shadow-[0_0_40px_rgba(34,197,94,0.10)] backdrop-blur md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10 text-green-300 shadow-[0_0_24px_rgba(34,197,94,0.18)]">
              <CheckCircle2 size={38} strokeWidth={2.2} />
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.30em] text-green-400">
              ― Subscription Started ―
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Your File Router subscription is active.
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/72">
              Thank you for subscribing to RuntWerkx File Router. Your purchase
              has been received and your access is now being tied into the
              RuntWerkx system.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/10 bg-black/35 p-5 text-center">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Checkout Confirmation
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-white/65">
                {sessionId
                  ? `Stripe session detected: ${sessionId}`
                  : 'Your payment session completed successfully.'}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    'Next step: wire this button to your backend download-token endpoint after webhook + success flow are finished.'
                  )
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-semibold text-black transition hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(34,197,94,0.22)]"
              >
                <Download size={18} />
                Download File Router
              </button>

              <a
                href={FILE_ROUTER_BILLING_LINKS.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 font-semibold text-white transition hover:border-green-400 hover:text-green-400"
              >
                Manage Subscription
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-green-400">
                  Step 1
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Subscription payment completed through Stripe Checkout.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-green-400">
                  Step 2
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Download your installer and keep it available for future setup.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-green-400">
                  Step 3
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Use the billing portal any time to manage or cancel your plan.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/file-router"
                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-green-400 hover:text-green-400"
              >
                Back to File Router
              </Link>

              <Link
                to="/"
                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-green-400 hover:text-green-400"
              >
                Return Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}