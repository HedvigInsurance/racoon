type CookieConfig = {
  name: string
  maxAge: number
}

export type AbTestConfig = {
  optimizeExperimentId: string
  experimentQueryParam: string
  cookies: {
    variant: CookieConfig
  }
}

// Keep in sync with
// - Google Optimize (experiment id and status)
// - market-web (redirect config, experiment id)
// - web-onboarding (experiment id for reporting)
export const newSiteAbTest: AbTestConfig = {
  optimizeExperimentId: 'mr_3juNyS1yRodkUannTjA',
  experimentQueryParam: 'experimentVariantId',
  cookies: {
    variant: {
      name: 'HEDVIG_EXP_NEW_SITE',
      maxAge: 7 * 24 * 3600,
    },
  },
}
