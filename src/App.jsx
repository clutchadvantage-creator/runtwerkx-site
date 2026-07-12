import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowUpRight } from 'lucide-react'
import SceneFallback from './components/three/SceneFallback'
import OperationalAssessment from './components/assessment/OperationalAssessment'
import { CubeInteractionProvider } from './components/three/CubeInteractionContext'
import { getRecommendationPageConfig } from './data/recommendationPages'
import RecommendationPage from './pages/RecommendationPage'
import ConsultRequestSuccessModal from './components/contact/ConsultRequestSuccessModal'
import { getMinimumConsultDateValue, validateConsultRequest } from './services/consult/validateConsultRequest'
import { buildAssessmentProgressStorageKey } from './shared/consult/assessmentProgress'
import { buildFrontendConsultSubmissionPayload } from './shared/consult/submissionPayload'
import { submitConsultRequest } from './shared/consult/consultRequestClient'
import rws5Image from './assets/rws5.png'

const RuntWerkxHeroScene = lazy(() => import('./components/three/RuntWerkxHeroScene'))
const ContactWorldMap = lazy(() => import('./components/contact/ContactWorldMap'))

const initialBuildRequest = {
  fullName: '',
  email: '',
  company: '',
  phone: '',
  preferredDate: '',
  preferredTime: 'Morning (8:00 AM - 12:00 PM)',
  notes: '',
  honeypot: '',
}

const consultProcessingStages = [
  'Securing request envelope',
  'Compiling operational package',
  'Generating consult dossier',
  'Transmitting to delivery channel',
]

const assessmentProgressStorageKey = buildAssessmentProgressStorageKey()

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const hubCloudParticles = [
  { x: 50, y: 18, size: 9, delay: -0.2, duration: 30.5, drift: -8 },
  { x: 60, y: 24, size: 5, delay: -1.2, duration: 32, drift: 6 },
  { x: 38, y: 25, size: 6, delay: -2.4, duration: 31.2, drift: -5 },
  { x: 72, y: 37, size: 4, delay: -0.8, duration: 34.2, drift: 7 },
  { x: 29, y: 40, size: 7, delay: -3, duration: 33.2, drift: -9 },
  { x: 64, y: 50, size: 4, delay: -1.7, duration: 35, drift: 5 },
  { x: 44, y: 46, size: 5, delay: -2.1, duration: 32.8, drift: -4 },
  { x: 54, y: 59, size: 6, delay: -0.4, duration: 31.8, drift: 8 },
  { x: 33, y: 58, size: 4, delay: -3.4, duration: 34.5, drift: -7 },
  { x: 70, y: 66, size: 5, delay: -1.9, duration: 33.6, drift: 6 },
  { x: 42, y: 72, size: 4, delay: -2.8, duration: 36, drift: -3 },
  { x: 58, y: 78, size: 4, delay: -0.6, duration: 35.2, drift: 4 },
  { x: 24, y: 51, size: 3, delay: -1.5, duration: 32.4, drift: -8 },
  { x: 76, y: 24, size: 3, delay: -2.6, duration: 34.8, drift: 9 },
  { x: 49, y: 86, size: 5, delay: -3.2, duration: 37.4, drift: -2 },
  { x: 46, y: 12, size: 3, delay: -1.1, duration: 30.2, drift: -6 },
  { x: 58, y: 16, size: 4, delay: -2.9, duration: 33.4, drift: 5 },
  { x: 27, y: 30, size: 3, delay: -0.5, duration: 34.6, drift: -8 },
  { x: 75, y: 56, size: 3, delay: -3.6, duration: 36.4, drift: 7 },
]

function ContactSignalLock({ onConsultRequest }) {
  const prefersReducedMotion = useReducedMotion()
  const [activeNode, setActiveNode] = useState('consult')
  const [lockedNode, setLockedNode] = useState(null)
  const [isHubHovered, setIsHubHovered] = useState(false)
  const [isCloudExpanded, setIsCloudExpanded] = useState(false)
  const boardRef = useRef(null)
  const mapWidth = 1000
  const mapHeight = 640
  const hubTriggerRadius = 150

  const hubCenter = { x: 500, y: 364 }
  const nodeCenters = {
    consult: { x: 500, y: 132 },
    email: { x: 180, y: 548 },
    call: { x: 820, y: 548 },
  }

  const toPercentPosition = ({ x, y }) => ({
    left: `${(x / mapWidth) * 100}%`,
    top: `${(y / mapHeight) * 100}%`,
  })

  const hubPositionStyle = toPercentPosition(hubCenter)
  const consultPositionStyle = toPercentPosition(nodeCenters.consult)
  const emailPositionStyle = toPercentPosition(nodeCenters.email)
  const callPositionStyle = toPercentPosition(nodeCenters.call)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsCloudExpanded(false)
      return undefined
    }

    if (isHubHovered) {
      setIsCloudExpanded(true)
      return undefined
    }

    const settleTimer = window.setTimeout(() => {
      setIsCloudExpanded(false)
    }, 8200)

    return () => {
      window.clearTimeout(settleTimer)
    }
  }, [isHubHovered, prefersReducedMotion])

  const updateHubHoverState = (clientX, clientY) => {
    const boardElement = boardRef.current

    if (!boardElement || prefersReducedMotion) {
      return
    }

    const bounds = boardElement.getBoundingClientRect()
    const centerX = bounds.left + (hubCenter.x / mapWidth) * bounds.width
    const centerY = bounds.top + (hubCenter.y / mapHeight) * bounds.height
    const dx = clientX - centerX
    const dy = clientY - centerY
    const withinHub = Math.hypot(dx, dy) <= hubTriggerRadius

    setIsHubHovered(withinHub)
  }

  const handleBoardPointerMove = (event) => {
    updateHubHoverState(event.clientX, event.clientY)
  }

  const handleBoardPointerEnter = (event) => {
    updateHubHoverState(event.clientX, event.clientY)
  }

  const handleBoardPointerLeave = () => {
    if (!prefersReducedMotion) {
      setIsHubHovered(false)
    }
  }

  const nodes = [
    {
      id: 'consult',
      label: 'Consult',
      title: 'Online Consult',
      hint: 'Open scheduling route',
      positionClass: 'contact-node-consult',
      labelPlacement: 'contact-node-label-top',
    },
    {
      id: 'email',
      label: 'Email',
      title: 'Send Questions By Email',
      hint: 'Compose direct message',
      positionClass: 'contact-node-email',
      labelPlacement: 'contact-node-label-bottom',
    },
    {
      id: 'call',
      label: 'Call',
      title: 'Call (417) 988-7395',
      hint: 'Open direct phone link',
      positionClass: 'contact-node-call',
      labelPlacement: 'contact-node-label-bottom',
    },
  ]

  const routePaths = {
    consult: `M${hubCenter.x} ${hubCenter.y} L${nodeCenters.consult.x} ${nodeCenters.consult.y}`,
    email: `M${hubCenter.x} ${hubCenter.y} L${nodeCenters.email.x} ${nodeCenters.email.y}`,
    call: `M${hubCenter.x} ${hubCenter.y} L${nodeCenters.call.x} ${nodeCenters.call.y}`,
  }

  const openRoute = (id) => {
    if (id === 'consult') {
      if (typeof onConsultRequest === 'function') {
        onConsultRequest()
        return
      }

      return
    }

    if (id === 'email') {
      window.location.href =
        'mailto:runtwerkx.dev@gmail.com?subject=RuntWerkx%20Inquiry&body=Hello%20RuntWerkx,%0D%0A%0D%0AI%20would%20like%20to%20ask%20about...'
      return
    }

    window.location.href = 'tel:+14179887395'
  }

  const handleNodeClick = (id) => {
    setLockedNode(id)
    setActiveNode(id)

    window.setTimeout(() => {
      openRoute(id)
      setLockedNode(null)
    }, prefersReducedMotion ? 0 : 220)
  }

  return (
    <section className="fresh-contact">
      <div className="fresh-contact-copy">
        <p className="eyebrow">-Contact Us-</p>
        <h1 className="fresh-contact-title">Custom Tooling &amp; Workflow Consulting</h1>
        <p className="fresh-contact-subtitle">Prototype — Design — Build — Test — Ship</p>
        <div className="fresh-contact-route">
          <span className="fresh-contact-route-label">Route Selected</span>
          <span className="fresh-contact-route-name">
            {nodes.find((node) => node.id === activeNode)?.title}
          </span>
          <span className="fresh-contact-route-hint">{nodes.find((node) => node.id === activeNode)?.hint}</span>
        </div>
      </div>

      <div className="fresh-contact-map-wrap">
        <div
          ref={boardRef}
          className="fresh-contact-board"
          aria-hidden="true"
          onPointerEnter={handleBoardPointerEnter}
          onMouseEnter={handleBoardPointerEnter}
          onPointerMove={handleBoardPointerMove}
          onMouseMove={handleBoardPointerMove}
          onPointerLeave={handleBoardPointerLeave}
          onMouseLeave={handleBoardPointerLeave}
        >
          <div className="fresh-contact-board-glow" />
          <Suspense fallback={<div className="fresh-world-map fresh-world-map-placeholder" aria-hidden="true" />}>
            <ContactWorldMap prefersReducedMotion={prefersReducedMotion} />
          </Suspense>
          {!prefersReducedMotion ? (
            <div className={`fresh-contact-particle-cloud ${isCloudExpanded ? 'is-expanded' : ''}`} style={hubPositionStyle} aria-hidden="true">
              <span className="fresh-contact-hub-spark" />
              {hubCloudParticles.map((particle, index) => (
                <span
                  key={`${particle.x}-${particle.y}-${index}`}
                  className="fresh-contact-particle"
                  style={{
                    '--particle-target-x': `${particle.x - 50}%`,
                    '--particle-target-y': `${particle.y - 50}%`,
                    '--particle-size': `${particle.size}px`,
                    '--particle-delay': `${particle.delay}s`,
                    '--particle-duration': `${particle.duration}s`,
                    '--particle-drift': `${particle.drift}px`,
                    '--particle-wander-x': `${(particle.drift * 0.35).toFixed(1)}px`,
                    '--particle-wander-y': `${(particle.drift * -0.22).toFixed(1)}px`,
                  }}
                />
              ))}
            </div>
          ) : null}
          <svg className="fresh-contact-lines" viewBox="0 0 1000 640" preserveAspectRatio="none">
          <defs>
            <linearGradient id="freshLineBase" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(91,255,122,0.08)" />
              <stop offset="50%" stopColor="rgba(91,255,122,0.3)" />
              <stop offset="100%" stopColor="rgba(91,255,122,0.08)" />
            </linearGradient>
            <linearGradient id="freshLineActive" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(91,255,122,0)" />
              <stop offset="50%" stopColor="rgba(91,255,122,0.95)" />
              <stop offset="100%" stopColor="rgba(91,255,122,0)" />
            </linearGradient>
            <filter id="freshLineGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path className="fresh-line-base" d={routePaths.consult} />
          <path className="fresh-line-base" d={routePaths.email} />
          <path className="fresh-line-base" d={routePaths.call} />

          <path
            className={`fresh-line-active ${activeNode === 'consult' ? 'is-active' : ''}`}
            d={routePaths.consult}
          />
          <path className="fresh-line-consult-stream" d={routePaths.consult} />
          <path
            className={`fresh-line-active ${activeNode === 'email' ? 'is-active' : ''}`}
            d={routePaths.email}
          />
          <path className={`fresh-line-active ${activeNode === 'call' ? 'is-active' : ''}`} d={routePaths.call} />

          <circle className="fresh-line-node-dot fresh-line-node-dot-center" cx={hubCenter.x} cy={hubCenter.y} r="7" />
          <circle className="fresh-line-node-dot fresh-line-node-dot-consult" cx={nodeCenters.consult.x} cy={nodeCenters.consult.y} r="5" />
          <circle className="fresh-line-node-dot fresh-line-node-dot-email" cx={nodeCenters.email.x} cy={nodeCenters.email.y} r="5" />
          <circle className="fresh-line-node-dot fresh-line-node-dot-call" cx={nodeCenters.call.x} cy={nodeCenters.call.y} r="5" />

          <circle className="fresh-line-pulse" r="5">
            <animateMotion dur="2.2s" repeatCount="indefinite" path={routePaths.consult} />
          </circle>
          <circle className="fresh-line-pulse" r="5">
            <animateMotion dur="2.8s" repeatCount="indefinite" path={routePaths.email} />
          </circle>
          <circle className="fresh-line-pulse" r="5">
            <animateMotion dur="2.8s" repeatCount="indefinite" path={routePaths.call} />
          </circle>
          </svg>

          <div
            className={`fresh-contact-hub ${isHubHovered ? 'is-hovered' : ''}`}
            style={hubPositionStyle}
            onFocus={() => setIsHubHovered(true)}
            onBlur={() => setIsHubHovered(false)}
          >
            <span className="fresh-contact-hub-title">RuntWerkx</span>
            <span className="fresh-contact-hub-subtitle">Direct Access</span>
          </div>

          <button
          type="button"
          className={`fresh-contact-node fresh-contact-node-consult ${lockedNode === 'consult' ? 'is-locked' : ''}`}
          style={consultPositionStyle}
          onMouseEnter={() => setActiveNode('consult')}
          onFocus={() => setActiveNode('consult')}
          onClick={() => handleNodeClick('consult')}
          aria-label="Online consult"
        >
          <span className="fresh-contact-node-core fresh-contact-node-core-consult">Online Consult</span>
          <span className="fresh-contact-node-ring" />
          <span className="fresh-contact-node-ring fresh-contact-node-ring-alt" />
          <span className="fresh-contact-node-ring fresh-contact-node-ring-alt2" />
          </button>

          <button
          type="button"
          className={`fresh-contact-node fresh-contact-node-email ${lockedNode === 'email' ? 'is-locked' : ''}`}
          style={emailPositionStyle}
          onMouseEnter={() => setActiveNode('email')}
          onFocus={() => setActiveNode('email')}
          onClick={() => handleNodeClick('email')}
          aria-label="Send questions by email"
        >
          <span className="fresh-contact-node-core">Email</span>
          <span className="fresh-contact-node-ring" />
          </button>

          <button
          type="button"
          className={`fresh-contact-node fresh-contact-node-call ${lockedNode === 'call' ? 'is-locked' : ''}`}
          style={callPositionStyle}
          onMouseEnter={() => setActiveNode('call')}
          onFocus={() => setActiveNode('call')}
          onClick={() => handleNodeClick('call')}
          aria-label="Call RuntWerkx"
        >
          <span className="fresh-contact-node-core">Call</span>
          <span className="fresh-contact-node-ring" />
          </button>

        </div>
      </div>

      <style>{`
        .fresh-contact {
          position: relative;
          min-height: min(100vh, 980px);
          width: 100%;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 20%, rgba(91, 255, 122, 0.08), rgba(91, 255, 122, 0) 34%),
            linear-gradient(180deg, rgba(5, 7, 6, 0.98), rgba(1, 2, 1, 0.98));
          padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 2vw, 1.5rem) clamp(2.5rem, 5vw, 4rem);
        }

        .fresh-contact::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(91, 255, 122, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91, 255, 122, 0.04) 1px, transparent 1px);
          background-size: 110px 110px;
          opacity: 0.2;
          mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 78%);
          pointer-events: none;
        }

        .fresh-contact-copy {
          position: relative;
          z-index: 3;
          max-width: 70rem;
          margin: 0 auto;
          text-align: center;
        }

        .fresh-contact-title {
          margin: 0.45rem auto 0;
          max-width: 15ch;
          font-size: clamp(2rem, 5vw, 4.8rem);
          line-height: 0.94;
          letter-spacing: -0.05em;
          color: #fbfffd;
        }

        .fresh-contact-subtitle {
          margin: 1rem 0 0;
          font-size: 0.95rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(244, 255, 248, 0.84);
        }

        .fresh-contact-route {
          display: inline-grid;
          gap: 0.2rem;
          margin: 1.1rem auto 0;
          padding: 0.85rem 1.05rem;
          border: 1px solid rgba(91, 255, 122, 0.16);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.4);
        }

        .fresh-contact-route-label {
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #5bff7a;
        }

        .fresh-contact-route-name {
          font-size: 0.98rem;
          font-weight: 700;
          color: #f5fff8;
        }

        .fresh-contact-route-hint {
          font-size: 0.78rem;
          color: rgba(244, 255, 248, 0.62);
        }

        .fresh-contact-route-hint {
          text-align: center;
        }

        .fresh-contact-board {
          position: relative;
          width: 100%;
          min-height: 780px;
          margin: 0 auto;
          border-radius: clamp(1.2rem, 2.2vw, 2.2rem);
          background:
            linear-gradient(140deg, rgba(10, 18, 13, 0.58), rgba(4, 7, 5, 0.28)),
            radial-gradient(circle at 50% 18%, rgba(91, 255, 122, 0.11), rgba(91, 255, 122, 0) 55%);
          box-shadow:
            inset 0 24px 54px rgba(8, 14, 10, 0.48),
            0 26px 58px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .fresh-contact-map-wrap {
          width: min(1240px, 100%);
          margin: clamp(1.4rem, 4vw, 3rem) auto 0;
        }

        .fresh-contact-board-glow {
          position: absolute;
          left: 50%;
          top: 54%;
          width: min(68vw, 48rem);
          height: min(68vw, 48rem);
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(91, 255, 122, 0.14), rgba(91, 255, 122, 0) 72%);
          filter: blur(100px);
          pointer-events: none;
        }

        .fresh-contact-particle-cloud {
          position: absolute;
          z-index: 1;
          width: min(40rem, 66vw);
          height: min(40rem, 66vw);
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: blur(0.9px);
          mix-blend-mode: screen;
          animation: freshCloudDrift 28s ease-in-out infinite alternate;
        }

        .fresh-contact-particle-cloud.is-expanded {
          filter: blur(0.35px) saturate(1.08);
        }

        .fresh-contact-hub-spark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 16rem;
          height: 16rem;
          transform: translate(-50%, -50%) scale(0.74);
          border-radius: 9999px;
          background:
            radial-gradient(circle, rgba(91, 255, 122, 0.28), rgba(91, 255, 122, 0.12) 34%, rgba(91, 255, 122, 0) 76%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 36%);
          opacity: 0;
          pointer-events: none;
          filter: blur(2px);
        }

        .fresh-contact-particle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--particle-size);
          height: var(--particle-size);
          margin-left: calc(var(--particle-size) * -0.5);
          margin-top: calc(var(--particle-size) * -0.5);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.94), rgba(134, 239, 172, 0.86) 34%, rgba(91, 255, 122, 0.36) 62%, rgba(91, 255, 122, 0) 100%);
          box-shadow:
            0 0 10px rgba(91, 255, 122, 0.46),
            0 0 20px rgba(91, 255, 122, 0.2);
          opacity: 0.48;
          transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(0.74);
          animation:
            freshParticleGather var(--particle-duration) ease-in-out var(--particle-delay) infinite alternate,
            freshParticlePulse calc(var(--particle-duration) * 0.72) ease-in-out var(--particle-delay) infinite;
        }

        .fresh-contact-particle::before {
          content: '';
          position: absolute;
          inset: -220%;
          border-radius: inherit;
          background: radial-gradient(circle, rgba(91, 255, 122, 0.18), rgba(91, 255, 122, 0) 68%);
          filter: blur(14px);
          opacity: 0.38;
        }

        .fresh-contact-particle-cloud.is-expanded .fresh-contact-particle {
          opacity: 0.66;
          animation:
            freshParticleBloom var(--particle-duration) ease-in-out var(--particle-delay) infinite alternate,
            freshParticlePulse calc(var(--particle-duration) * 0.72) ease-in-out var(--particle-delay) infinite;
        }

        .fresh-world-map {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.65;
          z-index: 1;
          mask-image: radial-gradient(circle at 50% 56%, black 22%, rgba(0, 0, 0, 0.75) 58%, transparent 92%);
        }

        .fresh-world-map-placeholder {
          background: radial-gradient(circle at 50% 50%, rgba(91, 255, 122, 0.06), rgba(91, 255, 122, 0) 72%);
        }

        .fresh-world-sphere {
          fill: rgba(4, 12, 7, 0.18);
          stroke: rgba(91, 255, 122, 0.14);
          stroke-width: 1;
        }

        .fresh-world-graticule {
          fill: none;
          stroke: rgba(91, 255, 122, 0.11);
          stroke-width: 0.85;
          stroke-dasharray: 2 8;
          animation: freshMapGridDrift 28s linear infinite;
        }

        .fresh-world-land {
          fill: rgba(16, 58, 29, 0.22);
          stroke: rgba(141, 255, 165, 0.7);
          stroke-width: 0.95;
          stroke-linejoin: round;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: freshMapDraw 2.4s ease-out forwards;
        }

        .fresh-world-routes .fresh-world-route {
          fill: none;
          stroke: url(#freshMapRoute);
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-dasharray: 4 9;
          opacity: 0.7;
          animation: freshMapRouteFlow 9.5s linear infinite;
        }

        .fresh-world-nodes circle,
        .fresh-world-pulse {
          fill: rgba(142, 255, 167, 0.88);
          filter: drop-shadow(0 0 4px rgba(91, 255, 122, 0.58));
        }

        .fresh-world-nodes circle {
          animation: freshMapNodePulse 4.6s ease-in-out infinite;
        }

        .fresh-world-nodes circle:nth-child(2) {
          animation-delay: -1.1s;
        }

        .fresh-world-nodes circle:nth-child(3) {
          animation-delay: -2.2s;
        }

        .fresh-world-nodes circle:nth-child(4) {
          animation-delay: -0.7s;
        }

        .fresh-world-nodes circle:nth-child(5) {
          animation-delay: -1.8s;
        }

        .fresh-world-map.is-reduced-motion .fresh-world-graticule,
        .fresh-world-map.is-reduced-motion .fresh-world-land,
        .fresh-world-map.is-reduced-motion .fresh-world-routes .fresh-world-route,
        .fresh-world-map.is-reduced-motion .fresh-world-nodes circle {
          animation: none;
          stroke-dashoffset: 0;
        }

        .fresh-contact-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          filter: drop-shadow(0 0 8px rgba(91, 255, 122, 0.28));
        }

        .fresh-line-base,
        .fresh-line-active {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fresh-line-base {
          stroke: url(#freshLineBase);
          stroke-width: 2.1;
          stroke-dasharray: 10 16;
          opacity: 0.92;
          filter: url(#freshLineGlow);
        }

        .fresh-line-active {
          stroke: url(#freshLineActive);
          stroke-width: 3.1;
          stroke-dasharray: 5 12;
          opacity: 0.26;
          animation: freshLineFlow 12s linear infinite;
          filter: url(#freshLineGlow);
        }

        .fresh-line-active.is-active {
          opacity: 1;
          stroke-width: 3.35;
        }

        .fresh-line-consult-stream {
          fill: none;
          stroke: rgba(172, 255, 191, 0.95);
          stroke-width: 2.2;
          stroke-dasharray: 2 11;
          stroke-linecap: round;
          opacity: 0.92;
          animation: freshLineFlow 6.5s linear infinite;
          filter: drop-shadow(0 0 8px rgba(91, 255, 122, 0.72));
        }

        .fresh-line-pulse {
          fill: rgba(134, 239, 172, 0.95);
          filter: drop-shadow(0 0 10px rgba(91, 255, 122, 0.8));
        }

        .fresh-line-node-dot {
          fill: rgba(134, 239, 172, 0.95);
          opacity: 0.7;
          filter: drop-shadow(0 0 8px rgba(91, 255, 122, 0.72));
        }

        .fresh-line-node-dot-center {
          fill: #4ade80;
          opacity: 1;
        }

        .fresh-contact-hub {
          position: absolute;
          z-index: 3;
          transform: translate(-50%, -50%);
          width: 8rem;
          height: 8rem;
          display: grid;
          place-items: center;
          text-align: center;
          border-radius: 9999px;
          border: 1px solid rgba(91, 255, 122, 0.16);
          background:
            radial-gradient(circle at 50% 45%, rgba(125, 255, 156, 0.25), rgba(0, 0, 0, 0.9) 70%);
          box-shadow:
            inset 0 0 34px rgba(91, 255, 122, 0.18),
            0 0 42px rgba(91, 255, 122, 0.26);
        }

        .fresh-contact-hub.is-hovered {
          box-shadow:
            inset 0 0 48px rgba(91, 255, 122, 0.22),
            0 0 68px rgba(91, 255, 122, 0.3);
        }

        .fresh-contact-hub.is-hovered .fresh-contact-hub-spark {
          animation: freshHubSpark 1.9s ease-out infinite;
        }

        .fresh-contact-hub::before {
          box-shadow:
            0 0 18px rgba(91, 255, 122, 0.22),
            0 0 34px rgba(91, 255, 122, 0.12);
        }

        .fresh-contact-hub::before,
        .fresh-contact-hub::after {
          content: '';
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .fresh-contact-hub::before {
          inset: -0.85rem;
          border: 1px solid rgba(91, 255, 122, 0.28);
          opacity: 0.65;
        }

        .fresh-contact-hub::after {
          inset: -1.55rem;
          border: 1px solid rgba(91, 255, 122, 0.12);
          opacity: 0.52;
        }

        .fresh-contact-hub-title,
        .fresh-contact-hub-subtitle {
          display: block;
        }

        .fresh-contact-hub-title {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #5bff7a;
        }

        .fresh-contact-hub-subtitle {
          margin-top: 0.18rem;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244, 255, 248, 0.62);
        }

        .fresh-contact-node {
          position: absolute;
          z-index: 4;
          width: clamp(6.5rem, 8.2vw, 7.9rem);
          aspect-ratio: 1;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: transform 240ms ease;
        }

        .fresh-contact-node-core,
        .fresh-contact-node-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
        }

        .fresh-contact-node-core {
          display: grid;
          place-items: center;
          position: absolute;
          inset: 0;
          overflow: hidden;
          isolation: isolate;
          padding: 0 0.8rem;
          border: 1px solid rgba(91, 255, 122, 0.18);
          background:
            radial-gradient(circle at 35% 35%, rgba(91, 255, 122, 0.2), rgba(0, 0, 0, 0.95) 62%),
            linear-gradient(180deg, rgba(12, 16, 13, 0.98), rgba(2, 4, 2, 0.98));
          box-shadow:
            inset 0 0 28px rgba(91, 255, 122, 0.12),
            0 0 24px rgba(91, 255, 122, 0.14);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
          color: #e7fff0;
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
        }

        .fresh-contact-node-core::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.16), transparent 34%),
            radial-gradient(circle at 72% 78%, rgba(91, 255, 122, 0.16), transparent 40%),
            conic-gradient(from 220deg at 50% 50%, rgba(255, 255, 255, 0.06), rgba(91, 255, 122, 0.12), rgba(255, 255, 255, 0.03), rgba(91, 255, 122, 0.06), rgba(255, 255, 255, 0.06));
          opacity: 0.78;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .fresh-contact-node-core::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.03) 0,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 7px
            );
          opacity: 0.26;
          mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 82%);
          pointer-events: none;
        }

        .fresh-contact-node-core-consult {
          font-size: 0.84rem;
          line-height: 1.22;
          letter-spacing: 0.05em;
          text-transform: none;
          text-align: center;
        }

        .fresh-contact-node-ring {
          border: 1px solid rgba(91, 255, 122, 0.1);
          transform: scale(1.2);
          opacity: 0.35;
        }

        .fresh-contact-node-ring-alt {
          transform: scale(1.42);
          opacity: 0.2;
        }

        .fresh-contact-node-ring-alt2 {
          transform: scale(1.62);
          opacity: 0.12;
        }

        .fresh-contact-node:hover .fresh-contact-node-core,
        .fresh-contact-node:focus-visible .fresh-contact-node-core,
        .fresh-contact-node.is-locked .fresh-contact-node-core {
          transform: scale(1.08);
          border-color: rgba(134, 239, 172, 0.42);
          box-shadow:
            inset 0 0 34px rgba(91, 255, 122, 0.18),
            0 0 34px rgba(91, 255, 122, 0.22);
        }

        .fresh-contact-node:hover,
        .fresh-contact-node:focus-visible,
        .fresh-contact-node.is-locked {
          transform: translate(-50%, -50%) translateY(-8px) scale(1.03);
        }

        .fresh-contact-node::before {
          content: '';
          position: absolute;
          inset: -1rem;
          border-radius: inherit;
          background: radial-gradient(circle, rgba(91, 255, 122, 0), rgba(91, 255, 122, 0) 60%, rgba(91, 255, 122, 0.08) 76%, rgba(91, 255, 122, 0) 100%);
          opacity: 0;
          transform: scale(0.92);
          filter: blur(10px);
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .fresh-contact-node:hover::before,
        .fresh-contact-node:focus-visible::before,
        .fresh-contact-node.is-locked::before {
          opacity: 1;
          transform: scale(1);
        }

        .fresh-contact-node-consult {
          width: clamp(7.6rem, 10vw, 9.25rem);
        }

        @keyframes freshLineFlow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -220;
          }
        }

        @keyframes freshMapDraw {
          from {
            stroke-dashoffset: 1;
            opacity: 0.22;
          }

          to {
            stroke-dashoffset: 0;
            opacity: 0.9;
          }
        }

        @keyframes freshMapRouteFlow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -180;
          }
        }

        @keyframes freshMapNodePulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.16);
          }
        }

        @keyframes freshMapGridDrift {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -120;
          }
        }

        @keyframes freshParticleDrift {
          from {
            transform: translate3d(0, 0, 0) scale(0.92);
          }

          to {
            transform: translate3d(var(--particle-drift), calc(var(--particle-drift) * -0.45), 0) scale(1.12);
          }
        }

        @keyframes freshParticlePulse {
          0%,
          100% {
            opacity: 0.28;
            filter: brightness(0.92) saturate(0.98);
          }

          50% {
            opacity: 0.8;
            filter: brightness(1.08) saturate(1.05);
          }
        }

        @keyframes freshCloudDrift {
          from {
            transform: translate(-50%, -50%) translate3d(-8px, 5px, 0) scale(0.98);
          }

          to {
            transform: translate(-50%, -50%) translate3d(9px, -6px, 0) scale(1.03);
          }
        }

        @keyframes freshParticleGather {
          0% {
            transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(0.68);
          }

          50% {
            transform: translate(-50%, -50%) translate3d(calc(var(--particle-wander-x) * 0.5), calc(var(--particle-wander-y) * 0.5), 0) scale(0.8);
          }

          100% {
            transform: translate(-50%, -50%) translate3d(calc(var(--particle-wander-x) * -0.45), calc(var(--particle-wander-y) * -0.45), 0) scale(0.72);
          }
        }

        @keyframes freshParticleBloom {
          0% {
            transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(0.6);
          }

          18% {
            transform: translate(-50%, -50%) translate3d(calc(var(--particle-target-x) * 0.45), calc(var(--particle-target-y) * 0.45), 0) scale(0.98);
          }

          60% {
            transform: translate(-50%, -50%) translate3d(calc(var(--particle-target-x) + var(--particle-wander-x)), calc(var(--particle-target-y) + var(--particle-wander-y)), 0) scale(1.04);
          }

          100% {
            transform: translate(-50%, -50%) translate3d(calc(var(--particle-target-x) * 0.9), calc(var(--particle-target-y) * 0.9), 0) scale(0.92);
          }
        }

        @keyframes freshHubSpark {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.74);
          }

          25% {
            opacity: 0.95;
          }

          70% {
            opacity: 0.45;
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.18);
          }
        }

        @media (max-width: 900px) {
          .fresh-contact-board {
            min-height: 860px;
          }

          .fresh-world-map {
            opacity: 0.58;
          }
        }

        @media (max-width: 680px) {
          .fresh-contact {
            padding-top: 1.5rem;
          }

          .fresh-contact-board {
            min-height: 820px;
          }

          .fresh-contact-title {
            max-width: 12ch;
            font-size: clamp(2rem, 9vw, 3rem);
          }

          .fresh-contact-node {
            width: 6.2rem;
          }

          .fresh-contact-node-consult {
            width: min(8.4rem, 31vw);
          }

          .fresh-contact-node-eyebrow {
            top: -1.2rem;
            font-size: 0.56rem;
          }

          .fresh-world-map {
            opacity: 0.52;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fresh-world-graticule,
          .fresh-world-land,
          .fresh-world-routes .fresh-world-route,
          .fresh-world-nodes circle {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  )
}

function RevealPanel({ className = '', children }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <section className={className}>{children}</section>
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

function supportsWebGL() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function App() {
  const prefersReducedMotion = useReducedMotion()
  const [canRender3D, setCanRender3D] = useState(false)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') {
      return '/'
    }

    return window.location.pathname || '/'
  })
  const [isBuildFormOpen, setIsBuildFormOpen] = useState(false)
  const [buildRequest, setBuildRequest] = useState(initialBuildRequest)
  const [assessmentSessionPackage, setAssessmentSessionPackage] = useState(null)
  const [isSubmittingBuildRequest, setIsSubmittingBuildRequest] = useState(false)
  const [processingStageIndex, setProcessingStageIndex] = useState(-1)
  const [buildRequestError, setBuildRequestError] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [lastSubmissionReference, setLastSubmissionReference] = useState('')
  const [lastDeliveryMessage, setLastDeliveryMessage] = useState('Consult request delivered successfully.')
  const minimumConsultDate = getMinimumConsultDateValue()

  useEffect(() => {
    setCanRender3D(supportsWebGL())
  }, [])

  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
    }
  }, [])

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    scrollToTop()

    // Some browsers restore scroll after initial paint, so enforce on next frames.
    const rafA = requestAnimationFrame(() => {
      scrollToTop()
    })
    const rafB = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop)
    })

    window.addEventListener('pageshow', scrollToTop)

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      window.removeEventListener('pageshow', scrollToTop)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedPackage = window.sessionStorage.getItem('rwxAssessmentPackage')

    if (storedPackage) {
      try {
        setAssessmentSessionPackage(JSON.parse(storedPackage))
      } catch {
        window.sessionStorage.removeItem('rwxAssessmentPackage')
      }
    }
  }, [])

  useEffect(() => {
    if (!isBuildFormOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsBuildFormOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isBuildFormOpen])

  useEffect(() => {
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 1.1 : 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: prefersReducedMotion ? 1 : 0.72,
      touchMultiplier: prefersReducedMotion ? 1 : 0.95,
    })

    let rafId = 0

    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  const navigateTo = (path) => {
    if (typeof window === 'undefined') {
      return
    }

    window.history.pushState({}, '', path)
    setCurrentPath(window.location.pathname || '/')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const openBuildForm = () => {
    setBuildRequestError('')
    setIsBuildFormOpen(true)
  }

  const closeBuildForm = () => {
    if (isSubmittingBuildRequest) {
      return
    }

    setIsBuildFormOpen(false)
  }

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
  }

  const handleReturnHomeFromSuccess = () => {
    setIsSuccessModalOpen(false)
    navigateTo('/')
  }

  const handleScheduleAnotherFromSuccess = () => {
    setIsSuccessModalOpen(false)

    if (currentPath !== '/contact') {
      navigateTo('/contact')
    }

    setIsBuildFormOpen(true)
  }

  const handleBuildRequestChange = (event) => {
    const { name, value } = event.target

    setBuildRequest((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleBuildRequestSubmit = async (event) => {
    event.preventDefault()

    if (isSubmittingBuildRequest) {
      return
    }

    const validation = validateConsultRequest(buildRequest, minimumConsultDate)

    if (!validation.valid) {
      setBuildRequestError(validation.message)
      return
    }

    setBuildRequestError('')
    setIsSubmittingBuildRequest(true)

    try {
      setProcessingStageIndex(0)
      await delay(220)

      setProcessingStageIndex(1)
      await delay(240)

      const consultPayload = buildFrontendConsultSubmissionPayload({
        buildRequest,
        assessmentSessionPackage,
        recommendationRoute: assessmentSessionPackage?.route || '/contact',
        honeypot: buildRequest.honeypot,
      })

      setProcessingStageIndex(2)
      await delay(220)

      setProcessingStageIndex(3)

      const deliveryResult = await submitConsultRequest(consultPayload)

      if (!deliveryResult?.success) {
        throw new Error(deliveryResult?.error?.message || 'We could not submit your request right now.')
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('rwxAssessmentPackage')
        window.sessionStorage.removeItem(assessmentProgressStorageKey)
      }

      setAssessmentSessionPackage(null)
      setLastSubmissionReference(deliveryResult.referenceNumber)
      setLastDeliveryMessage('Your consultation request has been received successfully.')
      setIsBuildFormOpen(false)
      setBuildRequest(initialBuildRequest)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setBuildRequestError(error?.message || 'We could not process your request right now. Please try again in a moment.')
    } finally {
      setIsSubmittingBuildRequest(false)
      setProcessingStageIndex(-1)
    }
  }

  const handleAssessmentContinue = (recommendation) => {
    const nextPackage = {
      ...recommendation.assessmentPackage,
      route: recommendation?.route || '/contact',
      headline: recommendation?.headline || null,
      body: recommendation?.body || null,
    }

    setAssessmentSessionPackage(nextPackage)

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('rwxAssessmentPackage', JSON.stringify(nextPackage))
    }

    navigateTo(recommendation?.route || '/contact')
  }

  const buildRequestModal = (
    <AnimatePresence>
      {isBuildFormOpen ? (
        <motion.div
          className="build-modal-backdrop"
          role="presentation"
          onClick={closeBuildForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="build-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="build-modal-title"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 56, scale: 0.955, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 22, scale: 0.98, filter: 'blur(12px)' }}
            transition={{
              duration: 0.58,
              ease: [0.12, 0.82, 0.18, 1],
              opacity: { duration: 0.34, ease: 'easeOut' },
              scale: { duration: 0.58, ease: [0.12, 0.82, 0.18, 1] },
              y: { duration: 0.58, ease: [0.12, 0.82, 0.18, 1] },
              filter: { duration: 0.48, ease: 'easeOut' },
            }}
          >
            <button className="modal-close" type="button" onClick={closeBuildForm} aria-label="Close build request form">
              ×
            </button>

            <div className="build-modal-layout">
              <div className="build-modal-intro">
                <p className="eyebrow">RuntWerkx Request Portal</p>
                <h2 id="build-modal-title">Schedule Your Online Consult</h2>
                <p className="modal-note">
                  Thank you for your interest in working with RuntWerkx. We ask that you take a minute and fill out this short form so that we may serve you better. Please allow 1-2 business days for a response. If you need immediate assistance, please don&apos;t hesitate to call us at +1 417 988 7395.
                </p>

                <div className="modal-cube-wrap" aria-hidden="true">
                  <div className="modal-cube">
                    <span className="modal-cube-face modal-cube-front" />
                    <span className="modal-cube-face modal-cube-back" />
                    <span className="modal-cube-face modal-cube-left" />
                    <span className="modal-cube-face modal-cube-top" />
                    <span className="modal-cube-face modal-cube-right" />
                    <span className="modal-cube-face modal-cube-bottom" />
                  </div>
                </div>
              </div>

              <form className="build-form" onSubmit={handleBuildRequestSubmit}>
                <input
                  className="consult-honeypot"
                  type="text"
                  name="honeypot"
                  value={buildRequest.honeypot}
                  onChange={handleBuildRequestChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                />

                <div className="build-form-grid">
                  <label className="form-field">
                    <span>Name</span>
                    <input
                      className="form-input"
                      type="text"
                      name="fullName"
                      value={buildRequest.fullName}
                      onChange={handleBuildRequestChange}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className="form-field">
                    <span>Email</span>
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      value={buildRequest.email}
                      onChange={handleBuildRequestChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="form-field">
                    <span>Company</span>
                    <input
                      className="form-input"
                      type="text"
                      name="company"
                      value={buildRequest.company}
                      onChange={handleBuildRequestChange}
                      placeholder="Company or team"
                      autoComplete="organization"
                    />
                  </label>

                  <label className="form-field">
                    <span>Phone</span>
                    <input
                      className="form-input"
                      type="tel"
                      name="phone"
                      value={buildRequest.phone}
                      onChange={handleBuildRequestChange}
                      placeholder="Optional phone number"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="form-field">
                    <span>Preferred Consult Date</span>
                    <input
                      className="form-input"
                      type="date"
                      name="preferredDate"
                      value={buildRequest.preferredDate}
                      onChange={handleBuildRequestChange}
                      min={minimumConsultDate}
                      required
                    />
                  </label>

                  <label className="form-field">
                    <span>Preferred Time Window</span>
                    <select
                      className="form-input"
                      name="preferredTime"
                      value={buildRequest.preferredTime}
                      onChange={handleBuildRequestChange}
                    >
                      <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="Late Afternoon (4:00 PM - 6:00 PM)">Late Afternoon (4:00 PM - 6:00 PM)</option>
                    </select>
                  </label>

                  <label className="form-field form-field-full">
                    <span>Additional Notes</span>
                    <textarea
                      className="form-input form-textarea"
                      name="notes"
                      value={buildRequest.notes}
                      onChange={handleBuildRequestChange}
                      placeholder="Anything we should know before the consult?"
                      rows="4"
                    />
                  </label>
                </div>

                {buildRequestError ? <p className="consult-form-error">{buildRequestError}</p> : null}

                {isSubmittingBuildRequest ? (
                  <div className="consult-processing" aria-live="polite">
                    <p className="consult-processing-label">Industrial Processing Sequence</p>
                    <div className="consult-processing-track" role="progressbar" aria-valuemin={0} aria-valuemax={consultProcessingStages.length} aria-valuenow={Math.max(processingStageIndex + 1, 0)}>
                      <span
                        className="consult-processing-fill"
                        style={{
                          width: `${((processingStageIndex + 1) / consultProcessingStages.length) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="consult-processing-stage">{consultProcessingStages[processingStageIndex]}</p>
                  </div>
                ) : null}

                <div className="modal-actions">
                  <button className="cta-primary" type="submit" disabled={isSubmittingBuildRequest}>
                    {isSubmittingBuildRequest ? 'Processing Request...' : 'Send Consult Request'} <ArrowUpRight size={16} />
                  </button>
                  <button className="cta-quiet" type="button" onClick={closeBuildForm} disabled={isSubmittingBuildRequest}>
                    Cancel
                  </button>
                </div>

                <div className="modal-call-row">
                  <a className="modal-call-button" href="tel:+14179887395">
                    Call 1 417 988 7395
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  const isAboutPage = currentPath === '/about'
  const isContactPage = currentPath === '/contact'
  const recommendationPageConfig = getRecommendationPageConfig(currentPath)

  const renderHiddenRecommendationPage = () => {
    if (!recommendationPageConfig) {
      return null
    }

    return (
      <div className="rwx-site recommendation-page">
        <header className="rwx-nav-wrap">
          <nav className="rwx-nav">
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
          </nav>
        </header>

        <RecommendationPage
          config={recommendationPageConfig}
          onConnect={() => navigateTo('/contact')}
          onStartOver={() => navigateTo('/')}
        />
      </div>
    )
  }

  if (recommendationPageConfig) {
    return renderHiddenRecommendationPage()
  }

  if (isAboutPage) {
    return (
      <div className="rwx-site about-page">
        <div className="about-circuit-bg" aria-hidden="true">
          <span className="circuit-grid-fade" />

          <svg className="circuit-svg" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <g>
              <polyline className="circuit-trace" points="20,158 170,158 170,124 330,124 330,178 520,178 520,146 760,146 760,182 980,182" />
              <polyline className="circuit-trace" points="70,294 220,294 220,252 380,252 380,314 610,314 610,276 840,276 840,322 930,322" />
              <polyline className="circuit-trace" points="140,430 300,430 300,386 460,386 460,446 700,446 700,406 940,406" />
              <polyline className="circuit-trace" points="454,72 454,124 520,124" />
              <polyline className="circuit-trace" points="642,84 642,146 710,146" />
              <polyline className="circuit-trace" points="302,446 302,520 380,520" />
              <polyline className="circuit-trace" points="770,90 770,146 902,146" />
              <polyline className="circuit-trace" points="260,124 260,92 322,92" />
              <polyline className="circuit-trace" points="572,178 572,212 648,212" />
              <polyline className="circuit-trace" points="704,276 704,244 762,244" />
              <polyline className="circuit-trace" points="352,386 352,354 414,354" />
              <polyline className="circuit-trace" points="520,446 520,484 594,484" />
              <polyline className="circuit-trace" points="32,214 128,214 128,184 206,184" />
              <polyline className="circuit-trace" points="868,138 868,108 960,108" />
              <polyline className="circuit-trace" points="914,322 914,366 976,366" />
              <polyline className="circuit-trace" points="76,472 172,472 172,504 250,504" />
              <polyline className="circuit-trace" points="498,252 498,224 574,224" />
              <polyline className="circuit-trace" points="436,520 436,548 520,548" />
            </g>

            <g>
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '9.4s', '--flowDelay': '-3.1s', '--flowDash': '3 138' }} points="20,158 170,158 170,124 330,124 330,178 520,178 520,146 760,146 760,182 980,182" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '8.3s', '--flowDelay': '-0.7s', '--flowDash': '3 126' }} points="70,294 220,294 220,252 380,252 380,314 610,314 610,276 840,276 840,322 930,322" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '10.2s', '--flowDelay': '-4.8s', '--flowDash': '3 146' }} points="140,430 300,430 300,386 460,386 460,446 700,446 700,406 940,406" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.1s', '--flowDelay': '-1.9s', '--flowDash': '2 84' }} points="454,72 454,124 520,124" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.8s', '--flowDelay': '-5.6s', '--flowDash': '2 76' }} points="642,84 642,146 710,146" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '9.1s', '--flowDelay': '-2.5s', '--flowDash': '2 92' }} points="302,446 302,520 380,520" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '8.8s', '--flowDelay': '-6.4s', '--flowDash': '2 102' }} points="770,90 770,146 902,146" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '6.9s', '--flowDelay': '-2.1s', '--flowDash': '2 72' }} points="260,124 260,92 322,92" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.4s', '--flowDelay': '-4.2s', '--flowDash': '2 88' }} points="572,178 572,212 648,212" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.7s', '--flowDelay': '-0.9s', '--flowDash': '2 74' }} points="704,276 704,244 762,244" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '8.1s', '--flowDelay': '-3.8s', '--flowDash': '2 86' }} points="352,386 352,354 414,354" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.2s', '--flowDelay': '-5.1s', '--flowDash': '2 82' }} points="520,446 520,484 594,484" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.6s', '--flowDelay': '-2.7s', '--flowDash': '2 78' }} points="32,214 128,214 128,184 206,184" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '6.8s', '--flowDelay': '-4.7s', '--flowDash': '2 84' }} points="868,138 868,108 960,108" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.9s', '--flowDelay': '-1.6s', '--flowDash': '2 86' }} points="914,322 914,366 976,366" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '8.4s', '--flowDelay': '-5.8s', '--flowDash': '2 94' }} points="76,472 172,472 172,504 250,504" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '7.3s', '--flowDelay': '-3.4s', '--flowDash': '2 74' }} points="498,252 498,224 574,224" />
              <polyline className="circuit-flow-trace" style={{ '--flowDur': '8.7s', '--flowDelay': '-2.2s', '--flowDash': '2 92' }} points="436,520 436,548 520,548" />
            </g>

            <g>
              <circle className="circuit-node" style={{ '--pulseDur': '4.4s', '--pulseDelay': '-0.6s' }} cx="170" cy="158" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.1s', '--pulseDelay': '-2.8s' }} cx="170" cy="124" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.9s', '--pulseDelay': '-1.7s' }} cx="330" cy="124" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.8s', '--pulseDelay': '-4.2s' }} cx="330" cy="178" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.7s', '--pulseDelay': '-0.9s' }} cx="520" cy="178" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.6s', '--pulseDelay': '-3.6s' }} cx="520" cy="146" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.5s', '--pulseDelay': '-1.3s' }} cx="760" cy="146" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.3s', '--pulseDelay': '-2.1s' }} cx="760" cy="182" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.8s', '--pulseDelay': '-3.9s' }} cx="220" cy="294" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.7s', '--pulseDelay': '-1.1s' }} cx="220" cy="252" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.6s', '--pulseDelay': '-2.9s' }} cx="380" cy="252" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.4s', '--pulseDelay': '-0.4s' }} cx="380" cy="314" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.3s', '--pulseDelay': '-2.4s' }} cx="610" cy="314" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.9s', '--pulseDelay': '-4.9s' }} cx="610" cy="276" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.9s', '--pulseDelay': '-1.8s' }} cx="840" cy="276" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.2s', '--pulseDelay': '-3.3s' }} cx="302" cy="520" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.4s', '--pulseDelay': '-0.7s' }} cx="770" cy="146" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.7s', '--pulseDelay': '-2.6s' }} cx="128" cy="214" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.5s', '--pulseDelay': '-1.5s' }} cx="128" cy="184" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.6s', '--pulseDelay': '-4.3s' }} cx="868" cy="108" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.3s', '--pulseDelay': '-2.9s' }} cx="914" cy="322" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.8s', '--pulseDelay': '-0.8s' }} cx="172" cy="472" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '5.7s', '--pulseDelay': '-3.5s' }} cx="498" cy="224" r="3.8" />
              <circle className="circuit-node" style={{ '--pulseDur': '4.5s', '--pulseDelay': '-1.9s' }} cx="436" cy="520" r="3.8" />

              <rect className="circuit-pad" x="318" y="86" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="644" y="208" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="758" y="240" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="410" y="350" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="590" y="480" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="202" y="180" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="956" y="104" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="972" y="362" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="246" y="500" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="570" y="220" width="8" height="8" rx="1.2" />
              <rect className="circuit-pad" x="516" y="544" width="8" height="8" rx="1.2" />
            </g>
          </svg>
        </div>

        <header className="rwx-nav-wrap">
          <nav className="rwx-nav">
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/about" className="nav-link-active" aria-current="page">
                About
              </a>
              <a href="/contact">Contact</a>
            </div>
          </nav>
        </header>

        <main>
          <section className="section-shell about-shell">
            <RevealPanel className="glass-panel about-panel about-enterprise">
              <span className="about-panel-orbit-node" aria-hidden="true" />
              <p className="eyebrow">About</p>
              <h2 className="panel-headline about-title">Why RuntWerkx</h2>

              <div className="about-grid">
                <div className="about-main">
                  <p className="about-copy">
                    RuntWerkx combines more than 12 years of real industrial experience with modern software engineering to build systems that perform in production environments. The company&apos;s foundation comes from direct work inside fabrication, manufacturing, construction, and heavy-industry operations, where workflow speed, reliability, and operational clarity directly affect outcomes.
                  </p>
                  <p className="about-copy">
                    That perspective is informed by practical use of platforms such as StruMIS, Tekla Structures, AutoCAD, PrimeCut, Raptor, Peddinghaus, HGG, and AGT Robotics, along with HRIS and EHS systems, networking, and systems administration. It also extends into enterprise software, custom web applications, and operational platforms designed to solve real process constraints.
                  </p>
                  <p className="about-copy">
                    Every system is built around operational value: efficient workflows, clear usability, dependable performance, and architecture that can scale as production demands evolve.
                  </p>
                </div>

                <aside className="about-philosophy" aria-label="RuntWerkx company philosophy">
                  <p className="about-philosophy-label">Company Philosophy</p>
                  <p className="about-philosophy-copy">
                    Technology should simplify operations and support the people doing the work. Great systems are built around real workflows, not theory. Practical industrial knowledge paired with modern digital engineering produces software that is intuitive, efficient, reliable, and scalable.
                  </p>
                  <div className="about-philosophy-image-placeholder" aria-hidden="true">
                    <img src={rws5Image} alt="" />
                  </div>
                </aside>
              </div>
            </RevealPanel>
          </section>
        </main>
      </div>
    )
  }

  if (isContactPage) {
    return (
      <div className="rwx-site contact-page">
        <header className="rwx-nav-wrap">
          <nav className="rwx-nav">
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact" className="nav-link-active" aria-current="page">
                Contact
              </a>
            </div>
          </nav>
        </header>

        <main>
          <ContactSignalLock onConsultRequest={openBuildForm} />
        </main>
        {buildRequestModal}
        <ConsultRequestSuccessModal
          isOpen={isSuccessModalOpen}
          referenceNumber={lastSubmissionReference}
          deliveryMessage={lastDeliveryMessage}
          onClose={closeSuccessModal}
          onReturnHome={handleReturnHomeFromSuccess}
          onScheduleAnother={handleScheduleAnotherFromSuccess}
        />
      </div>
    )
  }

  return (
    <div className="rwx-site">
      <header className="rwx-nav-wrap">
        <nav className="rwx-nav">
          <div className="nav-links">
            <a href="/about">
              About
            </a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      <CubeInteractionProvider>
        <main>
          <section className="hero section-shell">
            <RevealPanel className="glass-panel hero-panel">
              <div className="hero-layout">
                <div className="hero-content">
                  <p className="eyebrow">-RuntWerkx-</p>
                  <h1>Precision Workflow Solutions</h1>
                </div>

                <div className="hero-visual" aria-hidden="true">
                  {canRender3D ? (
                    <Suspense fallback={<SceneFallback />}>
                      <RuntWerkxHeroScene reducedMotion={Boolean(prefersReducedMotion)} />
                    </Suspense>
                  ) : (
                    <SceneFallback />
                  )}
                </div>
              </div>
            </RevealPanel>
          </section>

          <OperationalAssessment
            reducedMotion={Boolean(prefersReducedMotion)}
            onContinue={handleAssessmentContinue}
            onReset={() => {
              setAssessmentSessionPackage(null)

              if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem('rwxAssessmentPackage')
                window.sessionStorage.removeItem(assessmentProgressStorageKey)
              }
            }}
          />
        </main>
      </CubeInteractionProvider>
    </div>
  )
}

export default App
