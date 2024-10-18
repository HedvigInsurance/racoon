'use client'

import { setElementVars } from '@vanilla-extract/dynamic'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'
import { theme } from 'ui/src/theme/theme'
import { navigationProgressColor } from '@/appComponents/RootLayout/NavigationProgressIndicator.css'

// Adaptation to NextJs app router copied from https://github.com/tomcru/holy-loader/blob/main/src/index.tsx
export function NavigationProgressIndicator() {
  useEffect(() => {
    const startProgress = (): void => {
      setElementVars(document.body, { [navigationProgressColor]: getRandomColor() })
      NProgress.start()
    }

    const stopProgress = (): void => {
      NProgress.done()
    }

    /**
     * Flag to prevent redundant patching of History API methods.
     * This is essential to avoid pushState & replaceState increasingly nesting
     * within patched versions of itself
     */
    let isHistoryPatched = false

    /**
     * Enhances browser history methods (pushState and replaceState) to ensure that the
     * progress indicator is appropriately halted when navigating through single-page applications
     */
    const stopProgressOnHistoryUpdate = (): void => {
      if (isHistoryPatched) {
        return
      }

      const originalPushState = history.pushState.bind(history)
      history.pushState = (...args) => {
        stopProgress()
        originalPushState(...args)
      }

      // This is crucial for Next.js Link components using the 'replace' prop.
      const originalReplaceState = history.replaceState.bind(history)
      history.replaceState = (...args) => {
        stopProgress()
        originalReplaceState(...args)
      }

      isHistoryPatched = true
    }

    /**
     * Handles click events on anchor tags, starting the progress bar for page navigation.
     * It checks for various conditions to decide whether to start the progress bar or not.
     *
     * @param {MouseEvent} event The mouse event triggered by clicking an anchor tag.
     */
    const handleClick = (event: MouseEvent): void => {
      try {
        const target = event.target as HTMLElement
        const anchor = target.closest('a')
        if (
          anchor === null ||
          anchor.target === '_blank' ||
          event.ctrlKey ||
          event.metaKey ||
          // Skip if URL points to a different domain
          !isSameHost(window.location.href, anchor.href) ||
          // Skip if URL is a same-page anchor (href="#", href="#top", etc.).
          isSamePageAnchor(window.location.href, anchor.href) ||
          // Skip if URL uses a non-http/https protocol (mailto:, tel:, etc.).
          !toAbsoluteURL(anchor.href).startsWith('http')
        ) {
          return
        }

        startProgress()
      } catch {
        stopProgress()
      }
    }

    try {
      NProgress.configure({ showSpinner: false })
      document.addEventListener('click', handleClick)
      stopProgressOnHistoryUpdate()
    } catch (error) {
      console.log('progress bar config error', error)
    }
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}

/**
 * Converts a given URL to an absolute URL based on the current window location.
 * If the input URL is already absolute, it remains unchanged.
 *
 * @param {string} url - The URL to be converted. Can be an absolute or relative URL.
 * @returns {string} The absolute URL derived from the given URL and the current window location.
 */
const toAbsoluteURL = (url: string): string => {
  return new URL(url, window.location.href).href
}

/**
 * Determines if two URLs refer to the same page, differing only by the anchor.
 *
 * @param {string} currentUrl The current URL.
 * @param {string} newUrl The new URL to compare with the current URL.
 * @returns {boolean} True if the URLs refer to the same page (excluding the anchor), false otherwise.
 */
const isSamePageAnchor = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl))
  const next = new URL(toAbsoluteURL(newUrl))
  return current.href.split('#')[0] === next.href.split('#')[0]
}

/**
 * Determines if two URLs have the same host.
 *
 * @param {string} currentUrl The current URL.
 * @param {string} newUrl The new URL to compare with the current URL.
 * @returns {boolean} True if the URLs have the same host, false otherwise.
 */
const isSameHost = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl))
  const next = new URL(toAbsoluteURL(newUrl))
  return current.hostname.replace(/^www\./, '') === next.hostname.replace(/^www\./, '')
}

const COLORS = [
  theme.colors.pink600,
  theme.colors.purple600,
  theme.colors.teal600,
  theme.colors.blue600,
  theme.colors.green600,
  theme.colors.amber600,
]

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
