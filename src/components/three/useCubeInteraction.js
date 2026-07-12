import { useContext } from 'react'
import { CubeInteractionContext } from './CubeInteractionContext'

const fallback = {
  cubeState: 'idle',
  setCubeState: () => {},
  pulseCube: () => {},
  focusCube: () => {},
  pulseToken: 0,
  pulseKind: 'rotation',
  focusTarget: { x: 0, y: 0, intensity: 0 },
}

export default function useCubeInteraction() {
  const context = useContext(CubeInteractionContext)
  return context || fallback
}
