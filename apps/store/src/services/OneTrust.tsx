import { Global } from '@emotion/react'

export const OneTrustStyles = () => {
  return <Global styles={STYLES} />
}

const STYLES = {
  // Prevent OneTrust banner from displaying on top of 1st party dialogs
  '#onetrust-banner-sdk': {
    zIndex: 'unset !important',
  },
} as const
