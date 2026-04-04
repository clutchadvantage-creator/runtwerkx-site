import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import AegisOne from './pages/AegisOne'
import FileRouter from './pages/FileRouter'
import MediaCenter from './pages/MediaCenter'
import CalculatorsChartsConversionsPage from './pages/library/CalculatorsChartsConversionsPage'
import ShopMathCalculator from './pages/library/CCCPageContent/ShopMathCalculator'
import MaterialWeightCalculator from './pages/library/CCCPageContent/MaterialWeightCalculator'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aegisone" element={<AegisOne />} />
        <Route path="/file-router" element={<FileRouter />} />
        <Route path="/knowledge-library" element={<MediaCenter />} />
        <Route
          path="/knowledge-library/calculators-charts-conversions"
          element={<CalculatorsChartsConversionsPage />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/shop-math-calculator"
          element={<ShopMathCalculator />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/material-weight-calculator"
          element={<MaterialWeightCalculator />}
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}