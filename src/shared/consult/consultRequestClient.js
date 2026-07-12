export async function submitConsultRequest(payload, { fetchImpl = fetch } = {}) {
  const response = await fetchImpl('/api/consult-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return {
      success: false,
      error: data?.error || {
        code: 'REQUEST_FAILED',
        message: 'We could not submit your request right now.',
      },
    }
  }

  return data
}
