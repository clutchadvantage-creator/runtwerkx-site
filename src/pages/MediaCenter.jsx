import Navbar from '../components/Navbar'
import MediaCenterHero from '../components/media-center/MediaCenterHero'
import MediaCenterStatusBanner from '../components/media-center/MediaCenterStatusBanner'
import MediaCenterSidebar from '../components/media-center/MediaCenterSidebar'
import MediaCenterFeatured from '../components/media-center/MediaCenterFeatured'
import MediaCenterLibrarySection from '../components/media-center/MediaCenterLibrarySection'
import {
  mediaCenterCategories,
  mediaCenterFeatured,
  mediaCenterSections,
} from '../data/mediaCenterContent'

export default function MediaCenter() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="relative">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.10)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.10),transparent_24%),radial-gradient(circle_at_85%_30%,rgba(34,197,94,0.06),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.04),transparent_18%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <MediaCenterHero />
          <MediaCenterStatusBanner />

          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <MediaCenterSidebar categories={mediaCenterCategories} />

            <div className="space-y-8">
              <MediaCenterFeatured items={mediaCenterFeatured} />

              {mediaCenterSections.map((section) => (
                <MediaCenterLibrarySection
                  key={section.id}
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