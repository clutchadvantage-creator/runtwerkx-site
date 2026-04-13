import { Suspense, lazy, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AegisOne from './pages/AegisOne'
import FileRouter from './pages/FileRouter'
import MediaCenter from './pages/MediaCenter'
import Success from './pages/Success'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

const DailySafety = lazy(() => import('./pages/DailySafety'))
const Fabrication = lazy(() => import('./pages/library/Fabrication.jsx'))
const Manufacturing = lazy(() => import('./pages/library/Manufacturing.jsx'))
const Shipping = lazy(() => import('./pages/library/Shipping.jsx'))
const Construction = lazy(() => import('./pages/library/Construction.jsx'))
const ConstructionWorksheets = lazy(() => import('./pages/library/ConstructionWorksheets.jsx'))
const ManufacturingWorksheets = lazy(() => import('./pages/library/ManufacturingWorksheets.jsx'))
const ShippingWorksheets = lazy(() => import('./pages/library/ShippingWorksheets.jsx'))
const FabricationWorksheets = lazy(() => import('./pages/library/FabricationWorksheets.jsx'))
const IndustryStandards = lazy(() => import('./pages/library/IndustryStandards'))
const EmergencyProtocols = lazy(() => import('./pages/library/EmergencyProtocols'))
const MaintenanceSchedules = lazy(() => import('./pages/library/MaintenanceSchedules'))
const RegulatoryUpdates = lazy(() => import('./pages/library/RegulatoryUpdates'))
const ProfessionalTips = lazy(() => import('./pages/library/ProfessionalTips'))
const CalculatorsChartsConversionsPage = lazy(() =>
  import('./pages/library/CalculatorsChartsConversionsPage')
)
const ShopMathCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/ShopMathCalculator')
)
const MaterialWeightCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/MaterialWeightCalculator')
)
const AreaVolumeCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/AreaVolumeCalculator')
)
const ProductionRateCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/ProductionRateCalculator')
)
const PipeTankFillCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/PipeTankFillCalculator')
)
const CustomTradeCalculator = lazy(() =>
  import('./pages/library/CCCPageContent/CustomTradeCalculator')
)
const DecimalFractionChart = lazy(() => import('./pages/library/CCCPageContent/DecimalFractionChart'))
const CommonMaterialReferenceCharts = lazy(() =>
  import('./pages/library/CCCPageContent/CommonMaterialReferenceCharts')
)
const FieldReferenceCharts = lazy(() =>
  import('./pages/library/CCCPageContent/FieldReferenceCharts')
)
const FastenerHardwareReference = lazy(() =>
  import('./pages/library/CCCPageContent/FastenerHardwareReference')
)
const SteelGaugeThicknessChart = lazy(() =>
  import('./pages/library/CCCPageContent/SteelGaugeThicknessChart')
)
const TapDrillChart = lazy(() => import('./pages/library/CCCPageContent/TapDrillChart'))
const LengthConversions = lazy(() => import('./pages/library/CCCPageContent/LengthConversions'))
const WeightConversions = lazy(() => import('./pages/library/CCCPageContent/WeightConversions'))
const AreaConversions = lazy(() => import('./pages/library/CCCPageContent/AreaConversions'))
const VolumeConversions = lazy(() => import('./pages/library/CCCPageContent/VolumeConversions'))
const TemperatureConversions = lazy(() => import('./pages/library/CCCPageContent/TemperatureConversions'))
const PressureSpecialtyConversions = lazy(() =>
  import('./pages/library/CCCPageContent/PressureSpecialtyConversions')
)

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const previousSetting = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'

      return () => {
        window.history.scrollRestoration = previousSetting
      }
    }
  }, [pathname, hash])

  useLayoutEffect(() => {
    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    if (hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }

        scrollToPageTop()
      })

      return
    }

    scrollToPageTop()
    requestAnimationFrame(scrollToPageTop)
  }, [pathname, hash])

  return null
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#050816] px-6 py-24 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
        Loading resource
      </p>
      <p className="mt-4 text-base text-white/70">
        Pulling in the selected library page and tools.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aegisone" element={<AegisOne />} />
          <Route path="/file-router" element={<FileRouter />} />
          <Route path="/success" element={<Success />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/knowledge-library" element={<MediaCenter />} />
          <Route path="/daily-safety" element={<DailySafety />} />
          <Route path="/knowledge-library/industry-standards" element={<IndustryStandards />} />
          <Route path="/knowledge-library/emergency-protocols" element={<EmergencyProtocols />} />
          <Route path="/knowledge-library/maintenance-schedules" element={<MaintenanceSchedules />} />
          <Route path="/knowledge-library/regulatory-updates" element={<RegulatoryUpdates />} />
          <Route path="/knowledge-library/professional-tips" element={<ProfessionalTips />} />
          <Route path="/fabrication" element={<Fabrication />} />
          <Route path="/fabrication/worksheets" element={<FabricationWorksheets />} />
          <Route path="/knowledge-library/manufacturing" element={<Manufacturing />} />
          <Route path="/knowledge-library/manufacturing/worksheets" element={<ManufacturingWorksheets />} />
          <Route path="/knowledge-library/shipping" element={<Shipping />} />
          <Route path="/knowledge-library/shipping/worksheets" element={<ShippingWorksheets />} />
          <Route path="/knowledge-library/construction" element={<Construction />} />
          <Route path="/knowledge-library/construction/worksheets" element={<ConstructionWorksheets />} />

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
            path="/knowledge-library/calculators-charts-conversions/common-material-reference-charts"
            element={<CommonMaterialReferenceCharts />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/field-reference-charts"
            element={<FieldReferenceCharts />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/fastener-hardware-reference"
            element={<FastenerHardwareReference />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/steel-gauge-thickness-chart"
            element={<SteelGaugeThicknessChart />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/tap-drill-chart"
            element={<TapDrillChart />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/length-conversions"
            element={<LengthConversions />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/weight-conversions"
            element={<WeightConversions />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/area-conversions"
            element={<AreaConversions />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/volume-conversions"
            element={<VolumeConversions />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/temperature-conversions"
            element={<TemperatureConversions />}
          />
          <Route
            path="/knowledge-library/calculators-charts-conversions/pressure-specialty-conversions"
            element={<PressureSpecialtyConversions />}
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  )
}