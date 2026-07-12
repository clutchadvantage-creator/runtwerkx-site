function normalizeAnswer(answer) {
  if (!answer) {
    return null
  }

  if (typeof answer === 'string') {
    return {
      prompt: '',
      label: '',
      value: answer,
    }
  }

  return {
    prompt: answer.prompt || '',
    label: answer.label || '',
    value: answer.value || 'Not provided',
  }
}

export function buildConsultPackage({
  referenceNumber,
  request,
  recommendation,
  assessmentPackage,
  capturedAt,
}) {
  const normalizedAnswers = Array.isArray(assessmentPackage?.answers)
    ? assessmentPackage.answers.map(normalizeAnswer).filter(Boolean)
    : []

  const packageData = {
    referenceNumber,
    createdAt: capturedAt,
    recommendation: recommendation || 'No recommendation selected',
    contact: {
      name: request.name,
      company: request.company,
      email: request.email,
      phone: request.phone,
      preferredDate: request.preferredDate,
      preferredTime: request.preferredTime,
      notes: request.notes,
    },
    assessment: {
      category: assessmentPackage?.category || 'Unknown',
      stagedPath: assessmentPackage?.stagedPath || 'Unknown',
      capturedAt: assessmentPackage?.capturedAt || capturedAt,
      answers: normalizedAnswers,
    },
  }

  const packageLines = [
    `RuntWerkx Consult Request (${packageData.referenceNumber})`,
    `Created: ${packageData.createdAt}`,
    '',
    'Contact Information',
    `Name: ${packageData.contact.name}`,
    `Company: ${packageData.contact.company}`,
    `Email: ${packageData.contact.email}`,
    `Phone: ${packageData.contact.phone}`,
    `Preferred Date: ${packageData.contact.preferredDate}`,
    `Preferred Time: ${packageData.contact.preferredTime}`,
    `Notes: ${packageData.contact.notes || 'N/A'}`,
    '',
    'Recommendation Context',
    `Path: ${packageData.recommendation}`,
    '',
    'Assessment Metadata',
    `Category: ${packageData.assessment.category}`,
    `Staged Path: ${packageData.assessment.stagedPath}`,
    `Captured At: ${packageData.assessment.capturedAt}`,
    '',
    'Assessment Answers',
  ]

  if (packageData.assessment.answers.length === 0) {
    packageLines.push('No structured answers captured.')
  } else {
    packageData.assessment.answers.forEach((answer, index) => {
      packageLines.push(`Q${index + 1}: ${answer.prompt || answer.label || 'Question'}`)
      packageLines.push(`Answer: ${answer.value}`)
      packageLines.push('')
    })
  }

  return {
    packageData,
    packageLines,
    packageText: packageLines.join('\n'),
  }
}
