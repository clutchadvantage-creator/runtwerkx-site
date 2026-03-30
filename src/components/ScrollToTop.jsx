import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Force immediate reset BEFORE paint
    window.scrollTo(0, 0)

    // Backup to ensure it sticks after render
    const id = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    return () => clearTimeout(id)
  }, [pathname])

  return null
}