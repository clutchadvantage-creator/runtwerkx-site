import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://runtwerkx.com',
      generateRobotsTxt: false,
      dynamicRoutes: [
        '/file-router',
        '/aegisone',
        '/knowledge-library',
        '/knowledge-library/calculators-charts-conversions',
        '/knowledge-library/calculators-charts-conversions/shop-math-calculator',
        '/knowledge-library/calculators-charts-conversions/material-weight-calculator',
      ],
    }),
  ],
})