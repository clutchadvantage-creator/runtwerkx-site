import Navbar from '../components/Navbar'
import MediaCenterHero from '../components/media-center/MediaCenterHero'
import MediaCenterStatusBanner from '../components/media-center/MediaCenterStatusBanner'
import MediaCenterSidebar from '../components/media-center/MediaCenterSidebar'
import MediaCenterFeatured from '../components/media-center/MediaCenterFeatured'
import MediaCenterLibrarySection from '../components/media-center/MediaCenterLibrarySection'
import {
  mediaCenterCategories,
  mediaCenterSections,
} from '../data/mediaCenterContent'
import mediaCenterFeatured from '../data/mediaCenterFeatured'

const PAGE_BACKGROUND_IMAGE_SRC = '/images/library2.png'

export default function KnowledgeLibrary() {
  const downloadableTools =
    mediaCenterSections.find((section) => section.id === 'downloadable-tools')?.items ?? []

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* FULL PAGE BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: PAGE_BACKGROUND_IMAGE_SRC
            ? `url(${PAGE_BACKGROUND_IMAGE_SRC})`
            : 'none',
        }}
      />

      {/* GLOBAL DARK OVERLAY */}
      <div className="fixed inset-0 z-0 bg-black/75" />

      <main className="relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.10)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.10),transparent_24%),radial-gradient(circle_at_85%_30%,rgba(34,197,94,0.06),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.04),transparent_18%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <MediaCenterHero />
          <MediaCenterStatusBanner />

          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <MediaCenterSidebar
              categories={mediaCenterCategories}
              tools={downloadableTools}
            />

            <div className="space-y-8">
              <MediaCenterFeatured items={mediaCenterFeatured} />

              <p className="text-center text-sm font-medium text-white/78 md:text-base">
                Get your content featured here. Contact us for details!
              </p>

              {mediaCenterSections.map((section) => (
                <MediaCenterLibrarySection
                  key={section.id}
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  items={section.items}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}