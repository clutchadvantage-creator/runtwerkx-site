import Navbar from '../components/Navbar'

import HeroSection from '../components/home/HeroSection'
import ModernSystemsSection from '../components/home/ModernSystemsSection'
import ServicesSection from '../components/home/ServicesSection'
import ProductShowcaseSection from '../components/home/ProductShowcaseSection'
import AboutSection from '../components/home/AboutSection'
import ContactSection from '../components/home/ContactSection'
import ImageScrollRail from '../components/home/ImageScrollRail'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main>
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