import { AdditiveBlending, CanvasTexture, DynamicDrawUsage, MeshBasicMaterial, SphereGeometry } from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function makeNodePositions(count = 36, radius = 1.95) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2
    const verticalBand = ((index % 6) - 2.5) * 0.12
    const wobble = ((index * 17) % 9) * 0.015

    return [
      Math.cos(angle) * (radius + wobble),
      verticalBand,
      Math.sin(angle) * (radius - wobble),
    ]
  })
}

function makeCubeSurfacePoints(steps = 4, size = 1.18) {
  const points = []
  const half = size / 2
  const step = size / (steps - 1)

  for (let x = 0; x < steps; x += 1) {
    for (let y = 0; y < steps; y += 1) {
      for (let z = 0; z < steps; z += 1) {
        const onSurface =
          x === 0 || x === steps - 1 || y === 0 || y === steps - 1 || z === 0 || z === steps - 1

        if (!onSurface) {
          continue
        }

        points.push([
          -half + x * step,
          -half + y * step,
          -half + z * step,
        ])
      }
    }
  }

  return points
}

function smooth01(value) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function makeParticleSeeds(cubePoints, mergeTargets, count = 260) {
  return Array.from({ length: count }, (_, index) => {
    const from = cubePoints[index % cubePoints.length]
    const to = mergeTargets[index % mergeTargets.length]

    const driftX = (Math.random() - 0.5) * 2.2
    const driftY = (Math.random() - 0.5) * 2
    const driftZ = (Math.random() - 0.5) * 2.2

    return {
      from,
      to,
      drift: [driftX, driftY, driftZ],
      jitter: Math.random() * Math.PI * 2,
      speed: 0.45 + Math.random() * 0.5,
      orbitRadius: 0.04 + Math.random() * 0.11,
      orbitSpeed: 0.55 + Math.random() * 0.9,
      orbitTilt: (Math.random() - 0.5) * 0.7,
      spiral: 0.08 + Math.random() * 0.16,
    }
  })
}

function makeMetalGradientMap() {
  if (typeof document === 'undefined') {
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#f0f4f9')
  gradient.addColorStop(0.24, '#cbd2db')
  gradient.addColorStop(0.55, '#9aa3af')
  gradient.addColorStop(1, '#626a75')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < 70; index += 1) {
    const y = Math.random() * canvas.height
    const alpha = 0.03 + Math.random() * 0.05
    context.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)
    context.stroke()
  }

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}

export default function IndustrialCore({
  reducedMotion = false,
  energy = 0,
  interactionState = 'idle',
  interactionProfile,
  focusTarget = { x: 0, y: 0, intensity: 0 },
}) {
  const coreRef = useRef(null)
  const cubeMeshRef = useRef(null)
  const nodesRef = useRef(null)
  const morphOrbRefs = useRef([])
  const particleGeometryRef = useRef(null)
  const particleMaterialRef = useRef(null)
  const focusRef = useRef({ x: 0, y: 0, intensity: 0 })
  const profileRef = useRef({ glow: 1, rotate: 1, particle: 1 })
  const spinRef = useRef({ x: 0, y: 0 })
  const motionRef = useRef({
    tiltX: 0,
    tiltY: 0,
    posX: 0,
    posY: 0,
  })
  const metalGradientMap = useMemo(() => makeMetalGradientMap(), [])
  const nodePositions = useMemo(() => makeNodePositions(), [])
  const cubePoints = useMemo(() => makeCubeSurfacePoints(), [])
  const mergeTargets = useMemo(
    () => cubePoints.map((_, index) => nodePositions[index % nodePositions.length]),
    [cubePoints, nodePositions],
  )
  const particleSeeds = useMemo(() => makeParticleSeeds(cubePoints, mergeTargets), [cubePoints, mergeTargets])
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleSeeds.length * 3)

    particleSeeds.forEach((seed, index) => {
      positions[index * 3] = seed.from[0]
      positions[index * 3 + 1] = seed.from[1]
      positions[index * 3 + 2] = seed.from[2]
    })

    return positions
  }, [particleSeeds])
  const sharedNodeGeometry = useMemo(() => new SphereGeometry(0.06, 10, 10), [])
  const sharedNodeMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#5bff7a',
        transparent: true,
        opacity: 0.98,
        toneMapped: false,
      }),
    [],
  )
  const sharedMorphGeometry = useMemo(() => new SphereGeometry(0.06, 10, 10), [])
  const sharedMorphMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#5bff7a',
        transparent: true,
        opacity: 0.9,
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      metalGradientMap?.dispose()
    }
  }, [metalGradientMap])

  useEffect(() => {
    return () => {
      sharedNodeGeometry.dispose()
      sharedNodeMaterial.dispose()
      sharedMorphGeometry.dispose()
      sharedMorphMaterial.dispose()
    }
  }, [sharedMorphGeometry, sharedMorphMaterial, sharedNodeGeometry, sharedNodeMaterial])

  useEffect(() => {
    const positionAttribute = particleGeometryRef.current?.attributes?.position

    if (positionAttribute) {
      positionAttribute.setUsage(DynamicDrawUsage)
    }
  }, [])

  useEffect(() => {
    focusRef.current = {
      x: focusTarget?.x || 0,
      y: focusTarget?.y || 0,
      intensity: focusTarget?.intensity || 0,
    }
  }, [focusTarget])

  useFrame((state, delta) => {
    if (reducedMotion) {
      if (coreRef.current) {
        coreRef.current.visible = true
        coreRef.current.scale.setScalar(1)
      }

      if (cubeMeshRef.current) {
        cubeMeshRef.current.material.opacity = 1
      }

      if (particleMaterialRef.current) {
        particleMaterialRef.current.opacity = 0
      }

      morphOrbRefs.current.forEach((orb) => {
        if (orb) {
          orb.visible = false
        }
      })

      return
    }

    const elapsed = state.clock.elapsedTime
    const targetStateBoost = interactionProfile || {
      glow: 1,
      rotate: 1,
      particle: 1,
    }
    profileRef.current.glow = lerp(profileRef.current.glow, targetStateBoost.glow, 0.11)
    profileRef.current.rotate = lerp(profileRef.current.rotate, targetStateBoost.rotate, 0.11)
    profileRef.current.particle = lerp(profileRef.current.particle, targetStateBoost.particle, 0.11)
    const stateBoost = profileRef.current
    const cycleDuration = 40
    const cycle = (elapsed % cycleDuration) / cycleDuration

    const outEnd = 0.28
    const holdEnd = 0.62

    let orbJoin = 0
    let cubePresence = 1

    if (cycle < outEnd) {
      const progress = smooth01(cycle / outEnd)
      orbJoin = progress
      cubePresence = 1 - progress * 0.45
    } else if (cycle < holdEnd) {
      orbJoin = 1
      cubePresence = 0.55
    } else {
      const progress = smooth01((cycle - holdEnd) / (1 - holdEnd))
      orbJoin = 1 - progress
      cubePresence = 0.55 + progress * 0.45
    }

    if (coreRef.current) {
      const energyBoost = 1 + energy * 0.5
      const focusX = focusRef.current.x * focusRef.current.intensity
      const focusY = focusRef.current.y * focusRef.current.intensity
      const targetTiltX = state.mouse.y * 0.08 + focusY * 0.18
      const targetTiltY = state.mouse.x * 0.11 + focusX * 0.22
      const targetPosX = state.mouse.x * 0.14
      const targetPosY = state.mouse.y * 0.1

      spinRef.current.x += delta * 0.18 * energyBoost * stateBoost.rotate
      spinRef.current.y += delta * 0.28 * energyBoost * stateBoost.rotate

      motionRef.current.tiltX = lerp(motionRef.current.tiltX, targetTiltX, 0.06)
      motionRef.current.tiltY = lerp(motionRef.current.tiltY, targetTiltY, 0.06)
      motionRef.current.posX = lerp(motionRef.current.posX, targetPosX, 0.05)
      motionRef.current.posY = lerp(motionRef.current.posY, targetPosY, 0.05)

      coreRef.current.rotation.x = spinRef.current.x + motionRef.current.tiltX
      coreRef.current.rotation.y = spinRef.current.y + motionRef.current.tiltY
      coreRef.current.position.x = motionRef.current.posX
      coreRef.current.position.y = motionRef.current.posY
      coreRef.current.visible = true

      const cubeScale = 0.58 + cubePresence * (0.42 + energy * 0.06)
      coreRef.current.scale.setScalar(cubeScale)
    }

    if (cubeMeshRef.current) {
      cubeMeshRef.current.material.transparent = true
      cubeMeshRef.current.material.emissiveIntensity =
        (0.24 + cubePresence * 0.18 + energy * 0.14) * stateBoost.glow
      cubeMeshRef.current.material.opacity = 0.08 + cubePresence * 0.92
    }

    if (nodesRef.current) {
      nodesRef.current.rotation.y -= delta * (0.15 + energy * 0.08) * stateBoost.rotate
      nodesRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.1

      const joinPulse =
        1 +
        orbJoin * 0.14 +
        Math.sin(elapsed * 4.4) * 0.02 * orbJoin +
        energy * 0.05
      nodesRef.current.scale.setScalar(joinPulse)
    }

    for (let index = 0; index < cubePoints.length; index += 1) {
      const orb = morphOrbRefs.current[index]

      if (!orb) {
        continue
      }

      const from = cubePoints[index]
      const to = mergeTargets[index]
      const arc = Math.sin(orbJoin * Math.PI) * 0.24
      const phase = elapsed * 0.75 + index * 0.48

      orb.position.set(
        lerp(from[0], to[0], orbJoin) + Math.cos(phase) * arc,
        lerp(from[1], to[1], orbJoin) + Math.sin(phase * 1.2) * arc * 0.55,
        lerp(from[2], to[2], orbJoin) + Math.sin(phase) * arc,
      )

      const orbScale = 0.1 + orbJoin * 0.26
      orb.scale.setScalar(orbScale)
      orb.visible = orbJoin > 0.015
    }

    if (particleGeometryRef.current && particleMaterialRef.current) {
      const targetBlend = smooth01((orbJoin - 0.45) / 0.55)

      for (let index = 0; index < particleSeeds.length; index += 1) {
        const seed = particleSeeds[index]
        const outward = [
          seed.from[0] + seed.drift[0] * orbJoin,
          seed.from[1] + seed.drift[1] * orbJoin,
          seed.from[2] + seed.drift[2] * orbJoin,
        ]
        const swirl = Math.sin(elapsed * seed.speed + seed.jitter) * 0.1 * orbJoin
          const targetX = lerp(outward[0], seed.to[0], targetBlend)
          const targetY = lerp(outward[1], seed.to[1], targetBlend)
          const targetZ = lerp(outward[2], seed.to[2], targetBlend)

        const orbitTime =
          elapsed * seed.orbitSpeed * (1 + energy * 0.25) * stateBoost.particle + seed.jitter
        const orbitAmp =
          seed.orbitRadius * (0.45 + orbJoin * 1.25 + energy * 0.12)
        const orbitX = Math.cos(orbitTime) * orbitAmp
        const orbitZ = Math.sin(orbitTime) * orbitAmp
        const orbitY = Math.sin(orbitTime * 1.35 + seed.orbitTilt) * orbitAmp * 0.5
        const spiral = Math.sin(elapsed * 0.8 + seed.jitter) * seed.spiral * (0.25 + orbJoin * 0.75)

        particlePositions[index * 3] = targetX + swirl + orbitX
        particlePositions[index * 3 + 1] = targetY + swirl * 0.35 + orbitY + spiral * 0.3
        particlePositions[index * 3 + 2] = targetZ - swirl + orbitZ + spiral
      }

      particleGeometryRef.current.attributes.position.needsUpdate = true
      particleMaterialRef.current.opacity =
        orbJoin * (0.95 + energy * 0.12) * (0.88 + (stateBoost.particle - 1) * 0.8)
      particleMaterialRef.current.size =
        0.038 + orbJoin * 0.02 + energy * 0.006 + (interactionState === 'recommending' ? 0.007 : 0)

      sharedMorphMaterial.opacity = 0.78 + orbJoin * 0.22
    }
  })

  return (
    <group>
      <group ref={coreRef}>
        <mesh ref={cubeMeshRef}>
          <boxGeometry args={[1.28, 1.28, 1.28]} />
          <meshPhysicalMaterial
            color="#e6ecf3"
            map={metalGradientMap}
            emissive="#2b3138"
            emissiveIntensity={0.12}
            metalness={0.78}
            roughness={0.22}
            transmission={0}
            thickness={0}
            clearcoat={1}
            clearcoatRoughness={0.06}
            ior={1.52}
            envMapIntensity={2.8}
            reflectivity={1}
            transparent
            opacity={1}
          />
        </mesh>
      </group>

      <group ref={nodesRef}>
        {nodePositions.map((position, index) => (
          <mesh key={index} position={position}>
            <primitive object={sharedNodeGeometry} attach="geometry" />
            <primitive object={sharedNodeMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      <group>
        {cubePoints.map((position, index) => (
          <mesh
            key={`morph-orb-${index}`}
            ref={(element) => {
              morphOrbRefs.current[index] = element
            }}
            position={position}
            visible={false}
          >
            <primitive object={sharedMorphGeometry} attach="geometry" />
            <primitive object={sharedMorphMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      <points frustumCulled={false}>
        <bufferGeometry ref={particleGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={particleMaterialRef}
          color="#5bff7a"
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
