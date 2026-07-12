export function getSubmissionFailureSnapshot({
  buildRequest,
  assessmentSessionPackage,
  errorMessage,
}) {
  return {
    isSubmitting: false,
    buildRequest: { ...buildRequest },
    assessmentSessionPackage: assessmentSessionPackage ? { ...assessmentSessionPackage } : null,
    errorMessage,
    successModalOpen: false,
  }
}

export function getSubmissionSuccessSnapshot({
  buildRequest,
  assessmentSessionPackage,
  referenceNumber,
}) {
  return {
    isSubmitting: false,
    buildRequest: { ...buildRequest },
    assessmentSessionPackage: assessmentSessionPackage ? { ...assessmentSessionPackage } : null,
    referenceNumber,
    errorMessage: '',
    successModalOpen: true,
  }
}
