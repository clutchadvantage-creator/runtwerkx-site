import { useLayoutEffect } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'

export default function Terms() {
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
              alt="RuntWerkx terms background"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_24%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black" />

            <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center justify-center px-6">
              <div className="w-full rounded-[2rem] border border-green-500/20 bg-black/60 p-8 text-center backdrop-blur-sm md:p-12">
                <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                  ― Terms & Conditions ―
                </p>

                <h1 className="mt-4 text-4xl font-black md:text-6xl">
                  Terms of Use
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                  These Terms of Use govern your access to and use of the RuntWerkx
                  website, products, services, downloads, communications, and related
                  content. By accessing or using our website or services, you agree to
                  these Terms.
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
            <TermsCard title="1. Acceptance of Terms">
              <p>
                By accessing or using the RuntWerkx website, products, services, software,
                downloads, or related communications, you agree to be bound by these Terms
                of Use. If you do not agree with these Terms, do not use the website or
                services.
              </p>
            </TermsCard>

            <TermsCard title="2. Use of Website and Services">
              <p>
                You may use the RuntWerkx website and services only for lawful purposes and
                in a manner consistent with these Terms.
              </p>

              <p className="mt-4">
                You agree not to use the website or services in a way that could damage,
                disable, overburden, interfere with, or impair the operation, security,
                integrity, or availability of RuntWerkx systems, content, or services.
              </p>
            </TermsCard>

            <TermsCard title="3. Product and Service Information">
              <p>
                RuntWerkx may provide information about software, pricing, development
                status, product concepts, pre-orders, support options, service offerings,
                and related materials.
              </p>

              <p className="mt-4">
                We reserve the right to modify, update, discontinue, or revise any product,
                service, feature, pricing, or offering at any time without prior notice,
                unless otherwise required by a separate written agreement.
              </p>
            </TermsCard>

            <TermsCard title="4. Intellectual Property">
              <p>
                All content on this website, including but not limited to text, branding,
                logos, graphics, images, software descriptions, layouts, page design,
                downloads, and related materials, is owned by or licensed to RuntWerkx
                Systems LLC unless otherwise stated.
              </p>

              <p className="mt-4">
                You may not reproduce, distribute, modify, republish, scrape, reverse
                engineer, or commercially exploit website content or materials without prior
                written permission from RuntWerkx, except as otherwise allowed by law or by
                separate written agreement.
              </p>
            </TermsCard>

            <TermsCard title="5. Acceptable Use">
              <p>You agree not to:</p>

              <ul className="mt-4 space-y-3 text-white/72">
                <li>• Use the website or services for unlawful, fraudulent, abusive, or deceptive purposes</li>
                <li>• Attempt unauthorized access to systems, accounts, data, or infrastructure</li>
                <li>• Interfere with site operation, uptime, security, or performance</li>
                <li>• Copy, scrape, mirror, or harvest content or information in an unauthorized way</li>
                <li>• Upload or transmit malicious code, spam, malware, or harmful material</li>
                <li>• Misrepresent your identity, affiliation, or business relationship with RuntWerkx</li>
              </ul>
            </TermsCard>

            <TermsCard title="6. Payments, Billing, and Third-Party Providers">
              <p>
                Some RuntWerkx products or services may involve payments, billing portals,
                subscriptions, software licensing, support plans, or third-party service
                providers.
              </p>

              <p className="mt-4">
                Payment processing, billing management, and related services may be handled
                by third-party providers. Your use of those systems may also be subject to
                the provider’s own terms, policies, and conditions.
              </p>

              <p className="mt-4">
                RuntWerkx is not responsible for the independent policies or practices of
                third-party payment, billing, hosting, analytics, or communication providers.
              </p>
            </TermsCard>

            <TermsCard title="7. Pre-Orders, Development Access, and Future Products">
              <p>
                If RuntWerkx offers pre-orders, early access, founder programs, development
                support options, or other limited offerings, those offerings may be subject
                to additional terms, notices, eligibility requirements, or product-specific
                conditions.
              </p>

              <p className="mt-4">
                Unless expressly stated otherwise in writing, a pre-order, founder support
                contribution, or development-access offering does not automatically grant
                ownership of software, transfer of intellectual property, or perpetual support
                rights beyond what is specifically described by RuntWerkx.
              </p>
            </TermsCard>

            <TermsCard title="8. No Warranty">
              <p>
                The website and its content are provided on an “as is” and “as available”
                basis, without warranties of any kind, whether express or implied, to the
                fullest extent permitted by law.
              </p>

              <p className="mt-4">
                RuntWerkx does not guarantee that the website, content, downloads, or services
                will always be uninterrupted, error-free, secure, complete, accurate, or free
                from harmful components.
              </p>
            </TermsCard>

            <TermsCard title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, RuntWerkx Systems LLC shall not be
                liable for any indirect, incidental, special, consequential, exemplary, or
                punitive damages arising out of or related to your use of, inability to use,
                or reliance on the website, services, content, downloads, or communications.
              </p>

              <p className="mt-4">
                This includes, without limitation, loss of data, loss of profits, business
                interruption, system failure, security incidents, or other commercial damages
                or losses, even if RuntWerkx has been advised of the possibility of such damages.
              </p>
            </TermsCard>

            <TermsCard title="10. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless RuntWerkx Systems LLC and
                its affiliates, representatives, officers, members, contractors, and service
                providers from and against claims, liabilities, damages, losses, and expenses
                arising out of or related to your misuse of the website or services, your
                violation of these Terms, or your violation of any applicable law or third-party right.
              </p>
            </TermsCard>

            <TermsCard title="11. External Links">
              <p>
                The website may contain links to third-party websites, software platforms,
                documentation sources, payment systems, or outside services. These links are
                provided for convenience only.
              </p>

              <p className="mt-4">
                RuntWerkx does not control and is not responsible for the content, security,
                terms, availability, or privacy practices of third-party sites or services.
              </p>
            </TermsCard>

            <TermsCard title="12. Termination or Restriction of Access">
              <p>
                RuntWerkx reserves the right to suspend, limit, or terminate access to the
                website, services, or related content at any time, with or without notice,
                if we believe a user has violated these Terms, created risk, misused the site,
                or acted in a way that harms RuntWerkx, its users, or its systems.
              </p>
            </TermsCard>

            <TermsCard title="13. Changes to These Terms">
              <p>
                We may update these Terms of Use from time to time to reflect changes in our
                business, offerings, operations, legal requirements, or website functionality.
              </p>

              <p className="mt-4">
                Updated Terms will be posted on this page with a revised “Last Updated” date.
                Continued use of the website or services after changes are posted constitutes
                acceptance of the updated Terms.
              </p>
            </TermsCard>

            <TermsCard title="14. Governing Principles">
              <p>
                These Terms are intended to be interpreted and enforced to the fullest extent
                permitted by applicable law. If any provision is found to be unenforceable,
                the remaining provisions will continue in full force to the extent permitted.
              </p>
            </TermsCard>

            <TermsCard title="15. Contact Us">
              <p>
                If you have questions about these Terms of Use, product terms, support, or
                service-related conditions, you can contact:
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
            </TermsCard>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 text-center text-sm leading-7 text-white/55">
              These Terms are a general website and product-use statement for RuntWerkx and
              should be updated over time if your software licensing, subscriptions, customer
              accounts, hosted services, reseller terms, enterprise contracts, or legal
              requirements become more detailed.
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

function TermsCard({ title, children }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/50 p-6 md:p-8">
      <h2 className="text-center text-xl font-bold text-white md:text-2xl">{title}</h2>
      <div className="mt-4 text-base leading-8 text-white/68">{children}</div>
    </section>
  )
}