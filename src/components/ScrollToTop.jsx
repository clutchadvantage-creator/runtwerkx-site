import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return

    window.scrollTo(0, 0)

    const id = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    return () => clearTimeout(id)
  }, [pathname, hash])

  return null
}