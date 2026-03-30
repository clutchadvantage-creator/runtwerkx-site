export async function createCheckout(plan) {
  const response = await fetch('http://localhost:8000/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plan }),
  })

  const data = await response.json()

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Failed to create checkout session')
  }

  return data
}