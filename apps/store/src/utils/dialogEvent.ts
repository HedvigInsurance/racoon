import { useEffect } from 'react'

enum DialogEvent {
  OPEN = 'dialog:open',
  CLOSE = 'dialog:close',
}

export const sendDialogEvent = (state: 'open' | 'close') => {
  const event = new Event(state === 'open' ? DialogEvent.OPEN : DialogEvent.CLOSE)
  window.dispatchEvent(event)
}

export const useDialogEvent = (state: 'open' | 'close', callback: () => void) => {
  useEffect(() => {
    const event = state === 'open' ? DialogEvent.OPEN : DialogEvent.CLOSE
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [state, callback])
}
