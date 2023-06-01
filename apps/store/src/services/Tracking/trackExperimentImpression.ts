import { getCookie } from 'cookies-next'
import { type Tracking } from '@/services/Tracking/Tracking'
import { EXPERIMENT_COOKIE_NAME } from './experiment.constants'
import {
  experimentImpressionVariantId,
  getCurrentExperiment,
  getExperimentVariant,
} from './experiment.helpers'

export const trackExperimentImpression = (tracking: Tracking) => {
  if (typeof window === 'undefined') return
  const currentExperiment = getCurrentExperiment()
  if (!currentExperiment) return
  if (window.location.pathname !== currentExperiment.slug) return

  const cookieValue = getCookie(EXPERIMENT_COOKIE_NAME)
  if (typeof cookieValue !== 'string') return

  const experimentVariant = getExperimentVariant(cookieValue)
  if (!experimentVariant) return

  tracking.reportExperimentImpression(
    currentExperiment.id,
    experimentImpressionVariantId(currentExperiment, experimentVariant),
  )
}
