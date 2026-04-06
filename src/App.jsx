import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import AegisOne from './pages/AegisOne'
import FileRouter from './pages/FileRouter'
import MediaCenter from './pages/MediaCenter'
import Fabrication from './pages/library/Fabrication.jsx'
import Success from './pages/Success'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import CalculatorsChartsConversionsPage from './pages/library/CalculatorsChartsConversionsPage'
import ShopMathCalculator from './pages/library/CCCPageContent/ShopMathCalculator'
import MaterialWeightCalculator from './pages/library/CCCPageContent/MaterialWeightCalculator'
import AreaVolumeCalculator from './pages/library/CCCPageContent/AreaVolumeCalculator'
import ProductionRateCalculator from './pages/library/CCCPageContent/ProductionRateCalculator'
import PipeTankFillCalculator from './pages/library/CCCPageContent/PipeTankFillCalculator'
import CustomTradeCalculator from './pages/library/CCCPageContent/CustomTradeCalculator'
import DecimalFractionChart from './pages/library/CCCPageContent/DecimalFractionChart'
import TapDrillChart from './pages/library/CCCPageContent/TapDrillChart'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    requestAnimationFrame(() => {
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    })
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
        <Route path="/success" element={<Success />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/knowledge-library" element={<MediaCenter />} />
        <Route path="/fabrication" element={<Fabrication />} />

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
        <Route
          path="/knowledge-library/calculators-charts-conversions/area-volume-calculator"
          element={<AreaVolumeCalculator />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/production-rate-calculator"
          element={<ProductionRateCalculator />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/pipe-tank-fill-calculator"
          element={<PipeTankFillCalculator />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/custom-trade-calculator"
          element={<CustomTradeCalculator />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/decimal-fraction-chart"
          element={<DecimalFractionChart />}
        />
        <Route
          path="/knowledge-library/calculators-charts-conversions/tap-drill-chart"
          element={<TapDrillChart />}
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}