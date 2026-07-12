import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { buildPublicSitemapEntries } from './src/shared/siteRoutes.js'

const CANONICAL_HOSTNAME = 'https://runtwerkx.com'

function runtwerkxSitemapPlugin() {
  let resolvedConfig

  return {
    name: 'runtwerkx-sitemap-and-robots',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const outputDir = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const lastmod = new Date().toISOString()
      const sitemapEntries = buildPublicSitemapEntries({ lastmod })
      const sitemap = new SitemapStream({ hostname: CANONICAL_HOSTNAME })

      for (const entry of sitemapEntries) {
        sitemap.write({
          url: entry.path,
          changefreq: entry.changefreq,
          priority: entry.priority,
          lastmod: entry.lastmod,
        })
      }

      sitemap.end()

      const sitemapXml = (await streamToPromise(sitemap)).toString()
      const robotsTxt = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        'Disallow: /internal/',
        'Disallow: /private/',
        '',
        `Sitemap: ${CANONICAL_HOSTNAME}/sitemap.xml`,
        '',
      ].join('\n')

      await mkdir(outputDir, { recursive: true })
      await Promise.all([
        writeFile(path.join(outputDir, 'sitemap.xml'), sitemapXml, 'utf8'),
        writeFile(path.join(outputDir, 'robots.txt'), robotsTxt, 'utf8'),
      ])
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), runtwerkxSitemapPlugin()],
})
