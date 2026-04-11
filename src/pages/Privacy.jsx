import { useLayoutEffect } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'

export default function Privacy() {
  const lastUpdated = 'April 4, 2026'
  const navigate = useNavigate()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative overflow-hidden pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_22%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_18%)]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.14)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute -left-24 top-[-4rem] h-72 w-72 rounded-full bg-green-500/20 blur-[110px]" />
          <div className="absolute right-[-5rem] top-[-3rem] h-80 w-80 rounded-full bg-green-400/10 blur-[130px]" />
        </div>

        <section className="relative z-10 border-b border-white/10">
          <div className="relative h-[50vh] min-h-[420px] overflow-hidden">
            <img
              src="/images/policy.png"
              alt="RuntWerkx privacy policy background"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_24%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black" />

            <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center justify-center px-6">
              <div className="w-full rounded-[2rem] border border-green-500/20 bg-black/60 p-8 text-center backdrop-blur-sm md:p-12">
                <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                  ― Privacy Statement ―
                </p>

                <h1 className="mt-4 text-4xl font-black md:text-6xl">
                  Privacy Policy
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                  RuntWerkx Systems LLC (“RuntWerkx,” “we,” “our,” or “us”) respects your
                  privacy and is committed to handling information in a straightforward and
                  responsible way. This Privacy Policy explains what information we may collect,
                  how we may use it, and the choices you have when interacting with our website,
                  products, services, and communications.
                </p>

                <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/55">
                  Last Updated: {lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10">
          <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 md:py-16">
            <PolicyCard title="1. Information We Collect">
              <p>
                We may collect limited information you choose to provide directly to us, such as:
              </p>
              <ul className="mt-4 space-y-3 text-white/72">
                <li>• Name</li>
                <li>• Email address</li>
                <li>• Company name</li>
                <li>• Phone number</li>
                <li>• Message or inquiry details you submit to us</li>
              </ul>

              <p className="mt-5">
                We may also receive basic technical information that is commonly made available
                when you visit a website, such as browser type, device type, general usage
                information, referring pages, and approximate site activity needed to operate,
                secure, or improve the website.
              </p>
            </PolicyCard>

            <PolicyCard title="2. Information We Do Not Sell">
              <p>
                RuntWerkx does <span className="font-semibold text-white">not sell</span> your
                personal information.
              </p>

              <p className="mt-4">
                We do not trade, rent, or sell customer or visitor personal information to
                outside parties for their own marketing purposes.
              </p>
            </PolicyCard>

            <PolicyCard title="3. How We Use Information">
              <p>We may use information we collect to:</p>
              <ul className="mt-4 space-y-3 text-white/72">
                <li>• Respond to inquiries, demo requests, support requests, or business questions</li>
                <li>• Communicate about our software, services, updates, or project discussions</li>
                <li>• Provide customer service and operational support</li>
                <li>• Maintain, protect, and improve our website, tools, and systems</li>
                <li>• Detect security issues, misuse, fraud, or unauthorized activity</li>
                <li>• Comply with legal obligations when required</li>
              </ul>
            </PolicyCard>

            <PolicyCard title="4. Payments and Third-Party Services">
              <p>
                If you choose to make a payment, register interest, or use a third-party service
                connected to RuntWerkx, your information may also be processed by that provider
                under its own terms and privacy practices.
              </p>

              <p className="mt-4">
                For example, payment processing, subscription management, hosted forms, email
                platforms, analytics tools, or other service providers may collect or process
                information necessary to provide those services.
              </p>

              <p className="mt-4">
                RuntWerkx does not control the privacy practices of third-party services, and
                we encourage you to review their policies before submitting information through
                those systems.
              </p>
            </PolicyCard>

            <PolicyCard title="5. Cookies and Similar Technologies">
              <p>
                Our website may use standard website technologies such as cookies, local storage,
                or related tools to support website functionality, performance, security, and
                general user experience.
              </p>

              <p className="mt-4">
                You can usually control cookie settings through your browser. Disabling certain
                browser storage or cookie functions may affect how parts of the site work.
              </p>
            </PolicyCard>

            <PolicyCard title="6. Data Retention">
              <p>
                We keep information only for as long as reasonably necessary for the purposes
                described in this Privacy Policy, including responding to inquiries, maintaining
                business records, supporting products or services, resolving disputes, enforcing
                agreements, and meeting legal or operational requirements.
              </p>
            </PolicyCard>

            <PolicyCard title="7. Data Security">
              <p>
                RuntWerkx takes reasonable steps to protect information from unauthorized access,
                misuse, disclosure, alteration, or destruction.
              </p>

              <p className="mt-4">
                However, no website, platform, email transmission, or electronic storage method
                can be guaranteed to be completely secure. For that reason, while we work to
                protect information responsibly, we cannot guarantee absolute security.
              </p>
            </PolicyCard>

            <PolicyCard title="8. Children’s Privacy">
              <p>
                Our website, software, and services are intended for business, professional, and
                general commercial use and are not directed to children under 13. We do not
                knowingly collect personal information from children under 13.
              </p>

              <p className="mt-4">
                If you believe a child has submitted personal information to us, please contact
                us and we will take appropriate steps to review and remove the information when
                appropriate.
              </p>
            </PolicyCard>

            <PolicyCard title="9. Your Choices and Requests">
              <p>
                You may contact us at any time to:
              </p>

              <ul className="mt-4 space-y-3 text-white/72">
                <li>• Ask what information you have submitted to us directly</li>
                <li>• Request corrections to inaccurate information</li>
                <li>• Request deletion of information where appropriate</li>
                <li>• Ask questions about how your information is used</li>
              </ul>

              <p className="mt-4">
                We will review requests in a commercially reasonable manner and respond as
                appropriate, subject to legal, security, contractual, or recordkeeping needs.
              </p>
            </PolicyCard>

            <PolicyCard title="10. California Privacy Notice">
              <p>
                If you are a California resident, you may have additional privacy rights under
                applicable California law depending on the nature of your relationship with us
                and the data involved.
              </p>

              <p className="mt-4">
                RuntWerkx does not sell personal information. If you are a California resident
                and would like to make a privacy-related request, contact us using the contact
                information below.
              </p>
            </PolicyCard>

            <PolicyCard title="11. External Links">
              <p>
                Our website may contain links to third-party websites, tools, or services.
                Once you leave our website, this Privacy Policy no longer applies to those
                external sites or providers.
              </p>
            </PolicyCard>

            <PolicyCard title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                business, website functionality, legal requirements, or operational practices.
              </p>

              <p className="mt-4">
                Any updates will be posted on this page with a revised “Last Updated” date.
              </p>
            </PolicyCard>

            <PolicyCard title="13. Contact Us">
              <p>
                If you have questions about this Privacy Policy or would like to make a
                privacy-related request, you can contact:
              </p>

              <div className="mt-5 rounded-[1.25rem] border border-green-400/15 bg-green-500/[0.04] p-5 text-center">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
                  RuntWerkx Systems LLC
                </div>
                <div className="mt-3 space-y-2 text-white/72">
                  <p>Email: runtwerkx.dev@gmail.com</p>
                  <p>Phone: (417) 988-7395</p>
                  <p>Website: RuntWerkx.com</p>
                </div>
              </div>
            </PolicyCard>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 text-center text-sm leading-7 text-white/55">
              Thank You For Making RuntWerkx Part Of Your Journey!
            </div>
          </div>
        </section>

        <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3 md:bottom-6 md:right-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-green-400/30 bg-black/75 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 backdrop-blur transition hover:scale-[1.02] hover:border-green-300 hover:text-green-200"
          >
            Back To Previous Page
          </button>

          <Link
            to="/"
            className="rounded-full border border-white/15 bg-black/75 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur transition hover:scale-[1.02] hover:border-green-400 hover:text-green-300"
          >
            Home
          </Link>

          <Link
            to="/knowledge-library"
            className="rounded-full border border-white/15 bg-black/75 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur transition hover:scale-[1.02] hover:border-green-400 hover:text-green-300"
          >
            Knowledge Library
          </Link>
        </div>
      </main>
    </div>
  )
}

function PolicyCard({ title, children }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/50 p-6 md:p-8">
      <h2 className="text-center text-xl font-bold text-white md:text-2xl">{title}</h2>
      <div className="mt-4 text-base leading-8 text-white/68">{children}</div>
    </section>
  )
}