import { AnimatePresence, motion } from 'framer-motion'

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const panelVariants = {
  initial: { opacity: 0, y: 22, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.985 },
}

export default function ConsultRequestSuccessModal({
  isOpen,
  referenceNumber,
  deliveryMessage,
  onClose,
  onReturnHome,
  onScheduleAnother,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="build-modal-backdrop"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <motion.div
            className="build-modal consult-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-success-title"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close success modal">
              x
            </button>

            <div className="consult-success-shell">
              <p className="eyebrow">Transmission Complete</p>
              <h2 id="consult-success-title">Consult Request Received</h2>
              <p className="consult-success-message">
                Your request has entered our operations queue. Our team will respond using your preferred contact details.
              </p>

              <div className="consult-success-reference" aria-live="polite">
                <span>Reference</span>
                <strong>{referenceNumber}</strong>
              </div>

              <p className="consult-success-delivery">{deliveryMessage}</p>

              <div className="modal-actions consult-success-actions">
                <button className="cta-primary premium-button" type="button" onClick={onClose}>
                  Close
                </button>
                <button className="cta-quiet premium-button premium-button-secondary" type="button" onClick={onReturnHome}>
                  Return Home
                </button>
                <button className="cta-quiet premium-button premium-button-secondary" type="button" onClick={onScheduleAnother}>
                  Schedule Another
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
