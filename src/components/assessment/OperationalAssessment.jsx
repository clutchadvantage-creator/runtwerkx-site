import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { assessmentConversation, getNextConversationNode, getTransitionLine } from './assessmentConversation'
import { scoreAssessment } from './assessmentScoring'
import { getAssessmentResultCopy, noFrictionCopy } from './assessmentResults'
import useCubeInteraction from '../three/useCubeInteraction'
import { buildAssessmentContinuationPackage } from '../../shared/consult/assessmentSubmission'
import { buildAssessmentProgressStorageKey, parseAssessmentProgress, serializeAssessmentProgress } from '../../shared/consult/assessmentProgress'

const assessmentProgressStorageKey = buildAssessmentProgressStorageKey()

function loadStoredProgress() {
  if (typeof window === 'undefined') {
    return null
  }

  return parseAssessmentProgress(window.sessionStorage.getItem(assessmentProgressStorageKey))
}

export default function OperationalAssessment({ reducedMotion = false, onContinue, onReset }) {
  const storedProgress = useMemo(() => loadStoredProgress(), [])
  const [currentNodeId, setCurrentNodeId] = useState(storedProgress?.currentNodeId || 'intro')
  const [phase, setPhase] = useState(storedProgress?.result ? 'result' : storedProgress?.phase || 'idle')
  const [cubeStateOverride, setCubeStateOverride] = useState(null)
  const [answers, setAnswers] = useState(storedProgress?.answers || {})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [result, setResult] = useState(storedProgress?.result || null)
  const [processingLine, setProcessingLine] = useState(storedProgress?.processingLine || '')
  const timerRef = useRef(null)
  const dropdownRef = useRef(null)
  const thinkingTimerRef = useRef(null)
  const { setCubeState, pulseCube, focusCube } = useCubeInteraction()

  const currentNode = assessmentConversation[currentNodeId]

  useEffect(() => {
    if (storedProgress) {
      return undefined
    }

    const bootDelay = reducedMotion ? 220 : 900

    timerRef.current = window.setTimeout(() => {
      setPhase('question')
    }, bootDelay)

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [reducedMotion, storedProgress])

  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (cubeStateOverride) {
      setCubeState(cubeStateOverride)
      return
    }

    if (phase === 'question') {
      setCubeState('listening')
      return
    }

    if (phase === 'processing') {
      setCubeState('answering')
      return
    }

    if (phase === 'analyzing') {
      setCubeState('recommending')
      return
    }

    if (phase === 'result') {
      setCubeState('complete')
      return
    }

    setCubeState('idle')
  }, [cubeStateOverride, phase, setCubeState])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const resultCopy = useMemo(() => {
    if (!result) {
      return null
    }

    if (result.kind === 'close') {
      return noFrictionCopy
    }

    return getAssessmentResultCopy(result)
  }, [result])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const hasActiveState = phase !== 'idle' || Object.keys(answers).length > 0 || Boolean(result) || Boolean(processingLine)

    if (!hasActiveState) {
      return
    }

    window.sessionStorage.setItem(
      assessmentProgressStorageKey,
      serializeAssessmentProgress({
        currentNodeId,
        phase: result ? 'result' : phase,
        answers,
        result,
        processingLine,
      })
    )
  }, [answers, currentNodeId, phase, processingLine, result])

  const runNextStep = (nextNodeId, nextAnswers) => {
    clearTimer()
    setIsDropdownOpen(false)

    if (nextNodeId === 'no-friction') {
      setProcessingLine('Understood.')
      setPhase('processing')

      timerRef.current = window.setTimeout(() => {
        setResult({ kind: 'close' })
        setPhase('result')
      }, reducedMotion ? 240 : 760)

      return
    }

    if (nextNodeId === 'analyze') {
      setPhase('analyzing')

      timerRef.current = window.setTimeout(() => {
        const scored = scoreAssessment(nextAnswers)
        setResult({
          kind: 'recommendation',
          category: scored.category,
          scores: scored.scores,
          stagedPath: scored.stagedPath,
        })
        setPhase('result')
      }, reducedMotion ? 900 : 2000)

      return
    }

    setProcessingLine(getTransitionLine(nextNodeId))
    setPhase('processing')

    timerRef.current = window.setTimeout(() => {
      setCurrentNodeId(nextNodeId)
      setPhase('question')
    }, reducedMotion ? 180 : 580)
  }

  const selectAnswer = (option) => {
    if (!currentNode) {
      return
    }

    pulseCube('rotation')
    setCubeStateOverride('thinking')
    focusCube({ x: 0, y: 0, intensity: 0 })

    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current)
    }

    thinkingTimerRef.current = window.setTimeout(
      () => {
        setCubeStateOverride(null)
      },
      reducedMotion ? 140 : 420,
    )

    const nextAnswers = {
      ...answers,
      [currentNode.id]: option,
    }

    setAnswers(nextAnswers)

    const nextNodeId = getNextConversationNode(currentNode.id, option.value, nextAnswers)
    runNextStep(nextNodeId, nextAnswers)
  }

  const resetAssessment = () => {
    clearTimer()
    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
    setCurrentNodeId('intro')
    setPhase('idle')
    setAnswers({})
    setIsDropdownOpen(false)
    setResult(null)
    setProcessingLine('')
    setCubeStateOverride(null)
    setCubeState('idle')
    focusCube({ x: 0, y: 0, intensity: 0 })

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(assessmentProgressStorageKey)
    }

    if (typeof onReset === 'function') {
      onReset()
    }

    timerRef.current = window.setTimeout(() => {
      setPhase('question')
    }, reducedMotion ? 200 : 760)
  }

  const handleContinueAction = () => {
    if (result?.kind === 'close') {
      resetAssessment()
      window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
      return
    }

    if (onContinue) {
      onContinue({
        ...resultCopy,
        assessmentPackage: buildAssessmentContinuationPackage({
          result,
          recommendation: resultCopy,
          answers,
        }),
      })
    }
  }

  const handleDropdownWheel = (event) => {
    const list = event.currentTarget
    const deltaY = event.deltaY

    if (!deltaY) {
      return
    }

    const maxScrollTop = list.scrollHeight - list.clientHeight
    const atTop = list.scrollTop <= 0
    const atBottom = list.scrollTop >= maxScrollTop - 1
    const scrollingDown = deltaY > 0
    const canScrollInDirection = scrollingDown ? !atBottom : !atTop

    // Keep wheel events local to the dropdown while it can scroll.
    event.stopPropagation()

    if (!canScrollInDirection) {
      return
    }

    list.scrollTop += deltaY
  }

  const renderControls = () => {
    if (!currentNode) {
      return null
    }

    if (currentNode.kind === 'binary') {
      return (
        <motion.div
          key="binary-controls"
          className="ops-assessment-actions"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.2, 1, 0.22, 1] }}
        >
          {currentNode.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="ops-assessment-binary"
              onClick={() => selectAnswer(option)}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )
    }

    if (currentNode.kind === 'dropdown') {
      const currentSelection = answers[currentNode.id]?.label || 'Answer'

      return (
        <motion.div
          key="dropdown-controls"
          className="ops-assessment-input"
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.2, 1, 0.22, 1] }}
        >
          <button
            type="button"
            className={isDropdownOpen ? 'ops-assessment-input-bar ops-assessment-input-open' : 'ops-assessment-input-bar'}
            onClick={() => setIsDropdownOpen((current) => !current)}
          >
            <span className="ops-assessment-input-label">{currentSelection}</span>
            <ChevronDown size={15} />
          </button>

          <AnimatePresence>
            {isDropdownOpen ? (
              <motion.div
                className="ops-assessment-dropdown"
                data-lenis-prevent
                data-lenis-prevent-wheel
                onWheel={handleDropdownWheel}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: reducedMotion ? 0.18 : 0.3, ease: [0.2, 1, 0.22, 1] }}
              >
                {currentNode.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="ops-assessment-option"
                    onClick={() => selectAnswer(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )
    }

    return null
  }

  return (
    <motion.section
      className="ops-assessment-shell"
      aria-label="RuntWerkx operational assessment"
      initial={{ opacity: 0, y: reducedMotion ? 12 : 52, filter: reducedMotion ? 'blur(3px)' : 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: reducedMotion ? 0.4 : 1.2, ease: [0.16, 0.78, 0.2, 1] }}
    >
      <div className="ops-assessment-stage">
        <div className="ops-assessment-dialogue">
          <AnimatePresence mode="wait">
            {phase === 'question' ? (
              <motion.div
                key={`prompt-${currentNodeId}`}
                className="ops-assessment-message"
                initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: reducedMotion ? 0.24 : 0.72, ease: [0.2, 1, 0.22, 1] }}
              >
                {currentNode?.prompt}
              </motion.div>
            ) : null}

            {phase === 'processing' ? (
              <motion.div
                key="processing"
                className="ops-assessment-message ops-assessment-message-soft"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.48, ease: [0.2, 1, 0.22, 1] }}
              >
                {processingLine}
              </motion.div>
            ) : null}

            {phase === 'analyzing' ? (
              <motion.div
                key="analyzing"
                className="ops-assessment-message ops-assessment-message-soft"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.48, ease: [0.2, 1, 0.22, 1] }}
              >
                Analyzing operational profile...
              </motion.div>
            ) : null}

            {phase === 'result' && resultCopy ? (
              <motion.div
                key="result"
                className="ops-assessment-result"
                initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: reducedMotion ? 0.24 : 0.72, ease: [0.2, 1, 0.22, 1] }}
              >
                <p>{resultCopy.headline}</p>
                <p className="ops-assessment-result-body">{resultCopy.body}</p>
                <div className="ops-assessment-result-actions">
                  <button type="button" className="ops-assessment-link" onClick={resetAssessment}>
                    Start Over
                  </button>
                  {onContinue ? (
                    <button type="button" className="ops-assessment-link" onClick={handleContinueAction}>
                      {resultCopy?.continueLabel || 'Continue'}
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {phase === 'question' ? renderControls() : null}
        </div>
      </div>
    </motion.section>
  )
}
