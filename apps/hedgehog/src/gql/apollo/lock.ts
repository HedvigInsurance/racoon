import { useEffect } from 'react'
import * as React from 'react'

/**
 *  A component that generates a unique ID for the current window and registers itself as
 *  the lead window to be responsible for renewing the access token. This guarantees that
 *  at most one window will attempt to refresh when it expires.
 *
 *  It is to be mounted top-level and, most importantly, outside ApolloProvider which
 *  instantiates the Apollo client.
 *
 *  How it works:
 *      1. If it is the first mount of the window, register a unique id in session storage.
 *         The scope of Session Storage is per window, so this won't be shared.
 *      2. Register the same ID in local storage to assign this window as "lead"
 *         If another window is opened, it will repeat the process but assign itself as "lead"
 *      3. When the Access Token expires, the window will first check whether it's the lead window.
 *         If it is, it will renew the access token. If not, it won't do anything.
 *
 */

const LOCAL_STORAGE_LEAD_WINDOW_ID_KEY = '_window_lead_id'
const SESSION_STORAGE_WINDOW_ID_KEY = '_window_id'

export const RenewTokenLock: React.FC = () => {
  useEffect(() => {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_WINDOW_ID_KEY)

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      sessionStorage.setItem(SESSION_STORAGE_WINDOW_ID_KEY, sessionId)
      localStorage.setItem(LOCAL_STORAGE_LEAD_WINDOW_ID_KEY, sessionId)
    }

    window.onbeforeunload = () => {
      const leadId = localStorage.getItem(LOCAL_STORAGE_LEAD_WINDOW_ID_KEY)
      if (leadId === sessionId) {
        localStorage.removeItem(LOCAL_STORAGE_LEAD_WINDOW_ID_KEY)
      }
    }
  }, [])

  return null
}

export const canRenewToken = () => {
  const windowId = sessionStorage.getItem(SESSION_STORAGE_WINDOW_ID_KEY)
  const leadWindowId = localStorage.getItem(LOCAL_STORAGE_LEAD_WINDOW_ID_KEY)

  if (windowId && !leadWindowId) {
    localStorage.setItem(LOCAL_STORAGE_LEAD_WINDOW_ID_KEY, windowId)
    return false // Return false to ensure lead is kept
  }

  if (!windowId || !leadWindowId) {
    return false
  }

  return windowId === leadWindowId
}
