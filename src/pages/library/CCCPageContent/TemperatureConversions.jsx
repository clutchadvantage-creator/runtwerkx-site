import ConversionReferencePage from './ConversionReferencePage'
import { TEMPERATURE_CONVERSIONS_CONFIG } from './conversionReferenceConfigs'

export default function TemperatureConversions() {
  return <ConversionReferencePage config={TEMPERATURE_CONVERSIONS_CONFIG} />
}
