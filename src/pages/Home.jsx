import Navbar from '../components/Navbar'

import HeroSection from '../components/home/HeroSection'
import ModernSystemsSection from '../components/home/ModernSystemsSection'
import ServicesSection from '../components/home/ServicesSection'
import ProductShowcaseSection from '../components/home/ProductShowcaseSection'
import AboutSection from '../components/home/AboutSection'
import ContactSection from '../components/home/ContactSection'
import ImageScrollRail from '../components/home/ImageScrollRail'

const PAGE_BACKGROUND_IMAGE_SRC = '/images/hero-background2.png'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: PAGE_BACKGROUND_IMAGE_SRC
            ? `url(${PAGE_BACKGROUND_IMAGE_SRC})`
            : 'none',
        }}
      />

      <div className="fixed inset-0 z-0 bg-black/78" />

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <ModernSystemsSection />
        <ServicesSection />
        <ProductShowcaseSection />
        <AboutSection />
        <ContactSection />
        <ImageScrollRail />
      </main>
    </div>
  )
}