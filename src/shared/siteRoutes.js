import { consultationRoutes } from './consult/recommendationRoutes.js'

export const siteRoutes = Object.freeze({
  home: '/',
  about: '/about',
  contact: '/contact',
})

export const recommendationRouteList = Object.freeze(Object.values(consultationRoutes))

export const primaryNavLinks = Object.freeze([
  { label: 'Home', path: siteRoutes.home },
  { label: 'About', path: siteRoutes.about },
  { label: 'Contact', path: siteRoutes.contact },
])

export const homeNavLinks = Object.freeze(primaryNavLinks.filter((link) => link.path !== siteRoutes.home))

export const publicSiteRoutes = Object.freeze([
  siteRoutes.home,
  siteRoutes.about,
  siteRoutes.contact,
  ...recommendationRouteList,
])

const blockedPrefixes = ['/api/', '/internal/', '/private/']

const routeSitemapMetadata = {
  [siteRoutes.home]: { changefreq: 'weekly', priority: 1.0 },
  [siteRoutes.about]: { changefreq: 'monthly', priority: 0.8 },
  [siteRoutes.contact]: { changefreq: 'monthly', priority: 0.9 },
}

function normalizeRoutePath(path) {
  if (!path || typeof path !== 'string') {
    return '/'
  }

  const trimmed = path.trim()
  if (!trimmed) {
    return '/'
  }

  if (trimmed === '/') {
    return '/'
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function isPublicSiteRoute(path) {
  const normalized = normalizeRoutePath(path)

  if (normalized.includes('*') || normalized.includes(':')) {
    return false
  }

  return !blockedPrefixes.some((prefix) => normalized.startsWith(prefix))
}

export function getSitemapMetadataForRoute(path) {
  const normalized = normalizeRoutePath(path)

  if (routeSitemapMetadata[normalized]) {
    return routeSitemapMetadata[normalized]
  }

  if (normalized.startsWith('/recommendation/')) {
    return { changefreq: 'monthly', priority: 0.8 }
  }

  return { changefreq: 'monthly', priority: 0.7 }
}

export function buildPublicSitemapEntries({ lastmod } = {}) {
  const resolvedLastmod = lastmod || new Date().toISOString()

  return publicSiteRoutes
    .map((path) => normalizeRoutePath(path))
    .filter(isPublicSiteRoute)
    .map((path) => {
      const metadata = getSitemapMetadataForRoute(path)

      return {
        path,
        changefreq: metadata.changefreq,
        priority: metadata.priority,
        lastmod: resolvedLastmod,
      }
    })
}
