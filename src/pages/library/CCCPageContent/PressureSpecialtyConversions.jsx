import ConversionReferencePage from './ConversionReferencePage'
import { PRESSURE_SPECIALTY_CONVERSIONS_CONFIG } from './conversionReferenceConfigs'

export default function PressureSpecialtyConversions() {
  return <ConversionReferencePage config={PRESSURE_SPECIALTY_CONVERSIONS_CONFIG} />
}