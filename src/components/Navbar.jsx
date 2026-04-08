import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { scrollToId } from '../utils/homeUtils'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (location.pathname !== '/') return

    const sectionIds = ['services', 'work', 'about', 'contact']
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const updateActiveSection = () => {
      const scrollY = window.scrollY
      const viewportMid = scrollY + window.innerHeight * 0.35

      if (scrollY < 120) {
        setActiveSection('home')
        return
      }

      let current = 'home'

      for (const el of sectionElements) {
        if (el.offsetTop <= viewportMid) {
          current = el.id
        }
      }

      setActiveSection(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [location.pathname])

  const goToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')

      window.setTimeout(() => {
        scrollToId(sectionId)
      }, 120)

      return
    }

    scrollToId(sectionId)
  }

  const goHomeTop = () => {
    if (location.pathname !== '/') {
      navigate('/')
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const navButtonClass = (isActive) =>
    `relative transition ${
      isActive ? 'text-green-300' : 'text-white hover:text-green-400'
    }`

  const navUnderline = (isActive) =>
    isActive
      ? 'scale-x-100 opacity-100'
      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const isHomePage = location.pathname === '/'
  const isAegisOnePage = location.pathname === '/aegisone'
  const isFileRouterPage = location.pathname === '/file-router'
  const isKnowledgePage = location.pathname === '/knowledge-library'

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button type="button" onClick={goHomeTop} className="block text-left">
          <div className="text-2xl font-bold tracking-[0.2em] text-white">RUNTWERKX</div>
          <div className="text-sm text-green-400">Tools Built For Industry</div>
        </button>

        <nav className="hidden gap-6 text-sm md:flex">
          <button
            type="button"
            onClick={goHomeTop}
            className={`group ${navButtonClass(isHomePage && activeSection === 'home')}`}
          >
            Home
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${navUnderline(
                isHomePage && activeSection === 'home'
              )}`}
            />
          </button>

          <button
            type="button"
            onClick={() => goToSection('work')}
            className={`group ${navButtonClass(isHomePage && activeSection === 'work')}`}
          >
            Products
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${navUnderline(
                isHomePage && activeSection === 'work'
              )}`}
            />
          </button>

          <button
            type="button"
            onClick={() => goToSection('about')}
            className={`group ${navButtonClass(isHomePage && activeSection === 'about')}`}
          >
            About
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${navUnderline(
                isHomePage && activeSection === 'about'
              )}`}
            />
          </button>

          <button
            type="button"
            onClick={() => goToSection('contact')}
            className={`group ${navButtonClass(isHomePage && activeSection === 'contact')}`}
          >
            Contact
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${navUnderline(
                isHomePage && activeSection === 'contact'
              )}`}
            />
          </button>

          <Link
            to="/aegisone"
            className={`group relative transition ${
              isAegisOnePage ? 'text-green-300' : 'text-white hover:text-green-400'
            }`}
          >
            AegisOne
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${
                isAegisOnePage
                  ? 'scale-x-100 opacity-100'
                  : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              }`}
            />
          </Link>

          <Link
            to="/file-router"
            className={`group relative transition ${
              isFileRouterPage ? 'text-green-300' : 'text-white hover:text-green-400'
            }`}
          >
            File Router
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${
                isFileRouterPage
                  ? 'scale-x-100 opacity-100'
                  : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              }`}
            />
          </Link>

          {/* 🔥 NEW MEDIA CENTER LINK */}
          <Link to="/knowledge-library"
                className={`group relative transition ${
                  isKnowledgePage ? 'text-green-300' : 'text-white hover:text-green-400'
              }`}
          >
            Knowledge Library
            <span
              className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-gradient-to-r from-green-500 via-green-300 to-transparent transition duration-300 ${
                isKnowledgePage
                  ? 'scale-x-100 opacity-100'
                  : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
              }`}
            />
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white hover:text-green-400 transition"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur" onClick={closeMobileMenu} />
            <div className="relative ml-auto h-full w-80 bg-black border-l border-white/10 p-6">
              <div className="flex flex-col space-y-6">
                <button
                  type="button"
                  onClick={() => { goHomeTop(); closeMobileMenu(); }}
                  className={`text-left text-lg ${navButtonClass(isHomePage && activeSection === 'home')}`}
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() => { goToSection('work'); closeMobileMenu(); }}
                  className={`text-left text-lg ${navButtonClass(isHomePage && activeSection === 'work')}`}
                >
                  Products
                </button>

                <button
                  type="button"
                  onClick={() => { goToSection('about'); closeMobileMenu(); }}
                  className={`text-left text-lg ${navButtonClass(isHomePage && activeSection === 'about')}`}
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() => { goToSection('contact'); closeMobileMenu(); }}
                  className={`text-left text-lg ${navButtonClass(isHomePage && activeSection === 'contact')}`}
                >
                  Contact
                </button>

                <Link
                  to="/aegisone"
                  onClick={closeMobileMenu}
                  className={`text-left text-lg ${isAegisOnePage ? 'text-green-300' : 'text-white hover:text-green-400'}`}
                >
                  AegisOne
                </Link>

                <Link
                  to="/file-router"
                  onClick={closeMobileMenu}
                  className={`text-left text-lg ${isFileRouterPage ? 'text-green-300' : 'text-white hover:text-green-400'}`}
                >
                  File Router
                </Link>

                <Link
                  to="/knowledge-library"
                  onClick={closeMobileMenu}
                  className={`text-left text-lg ${isKnowledgePage ? 'text-green-300' : 'text-white hover:text-green-400'}`}
                >
                  Knowledge Library
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}