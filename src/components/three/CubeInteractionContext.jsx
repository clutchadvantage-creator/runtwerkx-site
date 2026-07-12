import { createContext, useCallback, useMemo, useState } from 'react'

const defaultFocus = { x: 0, y: 0, intensity: 0 }

export const CubeInteractionContext = createContext({
  cubeState: 'idle',
  setCubeState: () => {},
  pulseCube: () => {},
  focusCube: () => {},
  pulseToken: 0,
  pulseKind: 'rotation',
  focusTarget: defaultFocus,
})

export function CubeInteractionProvider({ children }) {
  const [cubeState, setCubeState] = useState('idle')
  const [pulseToken, setPulseToken] = useState(0)
  const [pulseKind, setPulseKind] = useState('rotation')
  const [focusTarget, setFocusTarget] = useState(defaultFocus)

  const pulseCube = useCallback((nextKind = 'rotation') => {
    setPulseKind(nextKind)
    setPulseToken((current) => current + 1)
  }, [])

  const focusCube = useCallback((nextFocus) => {
    if (!nextFocus) {
      setFocusTarget(defaultFocus)
      return
    }

    setFocusTarget({
      x: Math.max(-1, Math.min(1, nextFocus.x || 0)),
      y: Math.max(-1, Math.min(1, nextFocus.y || 0)),
      intensity: Math.max(0, Math.min(1, nextFocus.intensity ?? 0.45)),
    })
  }, [])

  const value = useMemo(
    () => ({
      cubeState,
      setCubeState,
      pulseCube,
      focusCube,
      pulseToken,
      pulseKind,
      focusTarget,
    }),
    [cubeState, focusCube, focusTarget, pulseCube, pulseKind, pulseToken],
  )

  return <CubeInteractionContext.Provider value={value}>{children}</CubeInteractionContext.Provider>
}
