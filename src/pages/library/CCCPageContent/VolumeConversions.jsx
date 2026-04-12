import ConversionReferencePage from './ConversionReferencePage'
import { VOLUME_CONVERSIONS_CONFIG } from './conversionReferenceConfigs'

export default function VolumeConversions() {
  return <ConversionReferencePage config={VOLUME_CONVERSIONS_CONFIG} />
}
