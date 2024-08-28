import { Key, Keys } from '@hedvig-ui'
import * as React from 'react'

interface UsePlatformResult {
  isMetaKey: (e: React.KeyboardEvent | KeyboardEvent) => boolean
  metaKey: Key
  platform: 'Mac' | 'Other'
}

export const usePlatform = (): UsePlatformResult => {
  const isMac = window.navigator.appVersion.indexOf('Mac') !== -1
  return {
    isMetaKey: (e: React.KeyboardEvent | KeyboardEvent) =>
      isMac ? e.metaKey : e.ctrlKey,
    metaKey: isMac ? Keys.Command : Keys.Control,
    platform: isMac ? 'Mac' : 'Other',
  }
}
