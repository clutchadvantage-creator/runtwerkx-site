export function getMinimumConsultDateValue(now = new Date()) {
  const minDate = new Date(now)
  minDate.setDate(minDate.getDate() + 1)
  return minDate.toISOString().split('T')[0]
}

export function validateConsultRequest(buildRequest, minimumConsultDate) {
  if (!buildRequest.preferredDate) {
    return {
      valid: false,
      message: 'Please choose a preferred date for your consult.',
    }
  }

  if (buildRequest.preferredDate < minimumConsultDate) {
    return {
      valid: false,
      message: 'Please select tomorrow or a later date for your consult request.',
    }
  }

  return {
    valid: true,
    message: '',
  }
}
