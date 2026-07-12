import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function RecommendationPage({ config, onConnect, onStartOver }) {
  const reducedMotion = useReducedMotion()
  const [expandedImage, setExpandedImage] = useState(null)

  const defaultWorkflowPanels = [
    {
      type: 'image',
      title: 'RuntWerkx Systems Overview',
      label: 'Image Placeholder',
    },
    {
      type: 'text',
      title: 'Operationally Crafted',
      body: 'RuntWerkx builds around real-world execution, turning fragmented process steps into structured workflows that teams can run with confidence.',
    },
    {
      type: 'text',
      title: 'Built For Production',
      body: 'Every solution is crafted to improve efficiency, reduce manual drag, and support stronger output from day-to-day operations.',
    },
    {
      type: 'image',
      title: 'RuntWerkx Workflow Example',
      label: 'Image Placeholder',
    },
  ]

  const checkerboardPanels =
    Array.isArray(config?.customWorkflowPanels) && config.customWorkflowPanels.length > 0
      ? config.customWorkflowPanels
      : defaultWorkflowPanels

  const showCraftedSection = !config?.hideCraftedSection && checkerboardPanels.length > 0

  const sectionTransition = {
    duration: reducedMotion ? 0.26 : 0.95,
    ease: [0.2, 0.8, 0.2, 1],
  }

  const cardTransition = {
    duration: reducedMotion ? 0.2 : 0.72,
    ease: [0.2, 0.8, 0.2, 1],
  }

  const sectionViewport = {
    once: true,
    amount: 0.28,
  }

  const cardViewport = {
    once: true,
    amount: 0.22,
  }

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    if (!expandedImage) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setExpandedImage(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [expandedImage])

  if (!config) {
    return null
  }

  return (
    <main>
      <motion.section
        className="section-shell recommendation-shell"
        initial={{ opacity: 0, y: reducedMotion ? 10 : 26, filter: reducedMotion ? 'blur(2px)' : 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={sectionTransition}
      >
        <motion.article
          className="glass-panel recommendation-panel"
          initial={{ opacity: 0, y: reducedMotion ? 8 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={{ ...sectionTransition, delay: reducedMotion ? 0 : 0.08 }}
        >
          <p className="eyebrow">{config.heroEyebrow}</p>
          <h1 className="recommendation-title">{config.heroTitle}</h1>
          <p className="hero-copy recommendation-hero-copy">{config.heroBody}</p>

          <motion.div
            className="recommendation-actions"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={sectionViewport}
            transition={{ ...sectionTransition, delay: reducedMotion ? 0 : 0.18 }}
          >
            <button className="cta-primary" type="button" onClick={onConnect}>
              {config.ctaLabel} <ArrowUpRight size={16} />
            </button>
            <button className="cta-quiet" type="button" onClick={onStartOver}>
              Start Over
            </button>
          </motion.div>
        </motion.article>
      </motion.section>

      <motion.section
        className="section-shell recommendation-detail-shell"
        initial={{ opacity: 0, y: reducedMotion ? 8 : 20, filter: reducedMotion ? 'blur(1px)' : 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={{ ...sectionTransition, delay: reducedMotion ? 0 : 0.14 }}
      >
        <div className="recommendation-grid">
          <motion.article
            className="glass-panel recommendation-card"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.2 }}
          >
            <h2>What This Recommendation Means</h2>
            <p>{config.explanation}</p>
          </motion.article>

          <motion.article
            className="glass-panel recommendation-card"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.28 }}
          >
            <h2>Why This Was Recommended</h2>
            <ul className="recommendation-list">
              {config.whyRecommended.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            className="glass-panel recommendation-card"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.36 }}
          >
            <h2>What Happens Next</h2>
            <ul className="recommendation-list">
              {config.whatHappensNext.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            className="glass-panel recommendation-card"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.44 }}
          >
            <h2>Example Outcomes</h2>
            <ul className="recommendation-list">
              {config.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        </div>

        {showCraftedSection ? (
          <motion.section
            className="recommendation-checkerboard"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={sectionViewport}
            transition={{ ...sectionTransition, delay: reducedMotion ? 0 : 0.18 }}
          >
            <div className="recommendation-checkerboard-header">
              <h2>Crafted By RuntWerkx</h2>
            </div>

            {checkerboardPanels.map((panel, index) => (
              <motion.article
                key={`${panel.title}-${index}`}
                className={`glass-panel recommendation-checker-card recommendation-checker-card-${panel.type}`}
                initial={{ opacity: 0, y: reducedMotion ? 6 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={cardViewport}
                transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.2 + index * 0.06 }}
              >
                {panel.type === 'image' ? (
                  panel.imageSrc ? (
                    <button
                      type="button"
                      className="recommendation-checker-image-button"
                      onClick={() => setExpandedImage({ src: panel.imageSrc, alt: panel.title })}
                      aria-label={`Expand image: ${panel.title}`}
                    >
                      <img
                        className="recommendation-checker-image"
                        src={panel.imageSrc}
                        alt={panel.title}
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <div className="recommendation-image-placeholder" role="img" aria-label={panel.title}>
                      <span>{panel.label || 'Image Placeholder'}</span>
                    </div>
                  )
                ) : (
                  <div className="recommendation-checker-copy">
                    <h3>{panel.title}</h3>
                    <p>{panel.body}</p>
                  </div>
                )}
              </motion.article>
            ))}
          </motion.section>
        ) : null}

        {config?.closingMessageTitle ? (
          <motion.article
            className="glass-panel recommendation-closing-card"
            initial={{ opacity: 0, y: reducedMotion ? 6 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={cardViewport}
            transition={{ ...cardTransition, delay: reducedMotion ? 0 : 0.22 }}
          >
            <h2>{config.closingMessageTitle}</h2>
            <p>{config.closingMessageBody}</p>
          </motion.article>
        ) : null}

        <motion.div
          className="recommendation-back-top"
          initial={{ opacity: 0, y: reducedMotion ? 4 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={{ ...sectionTransition, delay: reducedMotion ? 0 : 0.16 }}
        >
          <button className="cta-quiet" type="button" onClick={handleBackToTop}>
            Back To Top
          </button>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {expandedImage ? (
          <motion.div
            className="recommendation-image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.14 : 0.26 }}
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              className="recommendation-image-lightbox-panel"
              initial={{ opacity: 0, scale: reducedMotion ? 0.98 : 0.94, y: reducedMotion ? 2 : 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reducedMotion ? 0.99 : 0.96, y: reducedMotion ? 2 : 8 }}
              transition={{ duration: reducedMotion ? 0.18 : 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={expandedImage.alt || 'Expanded image'}
            >
              <button
                type="button"
                className="recommendation-image-lightbox-close"
                onClick={() => setExpandedImage(null)}
                aria-label="Close expanded image"
              >
                <X size={18} />
              </button>
              <img
                className="recommendation-image-lightbox-image"
                src={expandedImage.src}
                alt={expandedImage.alt || 'Expanded image'}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
