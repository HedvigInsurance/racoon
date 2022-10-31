import { getCookies } from 'cookies-next'

type AbRedirect = {
  // Use in env variables
  id: string
  // Take this from Google Optimize
  optimizeExperimentId: string
  sourcePath: string
  redirectPath: string
}

// Needs to be in sync with market-web, redirects start there
export const AB_REDIRECTS: AbRedirect[] = [
  {
    id: 'SE_INDEX',
    optimizeExperimentId: 'L2us-_SfSueXuS-p8uyV3A',
    sourcePath: '/se',
    redirectPath: '/se',
  },
]

export const findAbRedirectForPath = (path: string): AbRedirect | undefined => {
  return AB_REDIRECTS.find((redirect) => redirect.redirectPath === path)
}

export const getCurrentVariantId = (experimentId: string): string | undefined => {
  // Need to be in sync with market-web, which sets this cookie
  const cookieName = `HEDVIG_EXP_${experimentId}`
  const variant = getCookies()[cookieName]
  if (variant) return `${experimentId}.${variant}`
}
