import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

export default function LibraryPageLayout({
  eyebrow,
  title,
  description,
  intro,
  sections = [],
  links = [],
  customContent,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <video
        src="/videos/library3.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 h-full w-full object-cover z-0"
      />

      <div className="fixed inset-0 bg-black/75 z-0" />

      <main className="relative z-10">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.10)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.10),transparent_24%),radial-gradient(circle_at_85%_30%,rgba(34,197,94,0.06),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.04),transparent_18%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 space-y-12">
          <div className="mb-6">
            <Link
              to="/knowledge-library"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/50 hover:text-white"
            >
              ← Back to Knowledge Library
            </Link>
          </div>

          <section className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
              {eyebrow}
            </p>

            <h1 className="mt-6 text-5xl font-bold text-white">
              {title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {description}
            </p>

            {intro && (
              <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/65">
                {intro}
              </p>
            )}
          </section>

          {/* Render custom content (e.g., quick reference panel) if provided */}
          {customContent && (
            <div>{customContent}</div>
          )}

          {sections.map((section, idx) => (
            <section key={idx} className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                  {section.eyebrow || '― Section ―'}
                </p>
                <h2 className="mt-4 text-3xl font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-4 text-white/70">
                {section.content.map((block, blockIdx) => (
                  <p key={blockIdx} className="text-sm leading-7">
                    {block}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {links.length > 0 && (
            <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
                  ― Official Links ―
                </p>
                <h2 className="mt-4 text-3xl font-bold text-white">
                  Trusted Safety & Industry Resources
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-lg border border-white/10 bg-black/40 p-6 transition hover:border-green-400/30 hover:bg-black/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition">
                          {link.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-white/65">
                          {link.description}
                        </p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-white/40 group-hover:text-green-400 transition" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
