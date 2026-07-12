import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import IndustrialCore from './IndustrialCore'
import useCubeInteraction from './useCubeInteraction'

const CUBE_STATE_PROFILE = {
  idle: {
    glow: 0.96,
    floatSpeed: 1,
    rotate: 1,
    float: 1,
    sparkles: 1,
    particle: 1,
  },
  listening: {
    glow: 1.12,
    floatSpeed: 0.85,
    rotate: 0.82,
    float: 0.88,
    sparkles: 0.74,
    particle: 0.72,
  },
  thinking: {
    glow: 1.24,
    floatSpeed: 1.16,
    rotate: 1.2,
    float: 1.08,
    sparkles: 1.2,
    particle: 1.36,
  },
  answering: {
    glow: 1.02,
    floatSpeed: 0.92,
    rotate: 0.88,
    float: 0.9,
    sparkles: 0.84,
    particle: 0.86,
  },
  recommending: {
    glow: 1.34,
    floatSpeed: 1.24,
    rotate: 1.26,
    float: 1.14,
    sparkles: 1.34,
    particle: 1.56,
  },
  complete: {
    glow: 1.1,
    floatSpeed: 0.84,
    rotate: 0.78,
    float: 0.82,
    sparkles: 0.72,
    particle: 0.76,
  },
}

function HeroLights({ reducedMotion = false, energy = 0, interactionBoost = 1, sparkleScale = 1 }) {
  const energyBoost = (1 + energy * 0.42) * interactionBoost

  return (
    <>
      <ambientLight intensity={0.26 * energyBoost} color="#ecfff5" />
      <directionalLight position={[3.8, 4, 2.2]} intensity={1.2 * energyBoost} color="#f8fff9" />
      <pointLight position={[-2.6, -1.4, -2]} intensity={3.15 * energyBoost} color="#5bff7a" />
      <pointLight position={[2, 1.2, 2.8]} intensity={1.8 * energyBoost} color="#5bff7a" />
      <pointLight position={[0.3, 2.6, -1.5]} intensity={1.25 * energyBoost} color="#5bff7a" />

      <Sparkles
        count={reducedMotion ? 24 : Math.round((48 + energy * 20) * sparkleScale)}
        scale={[5.8, 3.5, 5.8]}
        size={1.6}
        speed={reducedMotion ? 0 : (0.24 + energy * 0.18) * sparkleScale}
        opacity={0.68}
        color="#5bff7a"
      />
    </>
  )
}

function ResponseSpinGroup({ reducedMotion = false, pulseToken = 0, pulseKind = 'rotation', children }) {
  const groupRef = useRef(null)
  const burstVelocityRef = useRef(0)

  useEffect(() => {
    if (!reducedMotion && pulseKind === 'rotation') {
      burstVelocityRef.current = Math.max(burstVelocityRef.current, 7.2)
    }
  }, [pulseKind, pulseToken, reducedMotion])

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) {
      return
    }

    burstVelocityRef.current = Math.max(0, burstVelocityRef.current - delta * 4.8)
    groupRef.current.rotation.y += burstVelocityRef.current * delta
  })

  return <group ref={groupRef}>{children}</group>
}

export default function RuntWerkxHeroScene({ reducedMotion = false, energy = 0 }) {
  const { cubeState = 'idle', pulseToken = 0, pulseKind = 'rotation', focusTarget = { x: 0, y: 0, intensity: 0 } } = useCubeInteraction()
  const stateProfile = CUBE_STATE_PROFILE[cubeState] || CUBE_STATE_PROFILE.idle

  return (
    <Canvas
      dpr={reducedMotion ? 1 : [1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows={false}
      frameloop={reducedMotion ? 'demand' : 'always'}
      performance={{ min: 0.68, max: 1, debounce: 220 }}
    >
      <PerspectiveCamera makeDefault fov={36} position={[0, 0.25, 6]} />
      <color attach="background" args={["#000000"]} />

      <HeroLights
        reducedMotion={reducedMotion}
        energy={energy}
        interactionBoost={stateProfile.glow}
        sparkleScale={stateProfile.sparkles}
      />

      <Float
        speed={reducedMotion ? 0 : (0.55 + energy * 0.16) * stateProfile.floatSpeed}
        rotationIntensity={reducedMotion ? 0 : (0.26 + energy * 0.08) * stateProfile.rotate}
        floatIntensity={reducedMotion ? 0 : (0.34 + energy * 0.1) * stateProfile.float}
      >
        <ResponseSpinGroup reducedMotion={reducedMotion} pulseToken={pulseToken} pulseKind={pulseKind}>
          <IndustrialCore
            reducedMotion={reducedMotion}
            energy={energy}
            interactionState={cubeState}
            interactionProfile={stateProfile}
            pulseToken={pulseToken}
            pulseKind={pulseKind}
            focusTarget={focusTarget}
          />
        </ResponseSpinGroup>
      </Float>
    </Canvas>
  )
}
