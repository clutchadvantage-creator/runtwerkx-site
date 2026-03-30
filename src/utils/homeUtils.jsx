export function scrollToId(id) {
  if (!id) return

  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function handleAction(action, navigate) {
  if (!action) return

  if (action.type === 'route') {
    navigate(action.value)
    return
  }

  if (action.type === 'scroll') {
    scrollToId(action.value)
  }
}

export function handleHref(href, navigate) {
  if (!href) return

  if (href.startsWith('#')) {
    const id = href.replace('#', '')
    scrollToId(id)
    return
  }

  navigate(href)
}

export function openExternalOrLog(url) {
  if (!url || url === '#') {
    console.log('Link not added yet.')
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}