import { getCookie } from 'cookies-next'
import { type Tracking } from '@/services/Tracking/Tracking'
import { EXPERIMENT_COOKIE_NAME } from './experiment.constants'
import { getExperimentVariant } from './experiment.helpers'

// Website-driven experiments, as configured in experiment.json
export const trackExperimentImpression = (experimentId: string | undefined, tracking: Tracking) => {
  if (typeof window === 'undefined') return
  if (!experimentId) return

  const cookieValue = getCookie(`${EXPERIMENT_COOKIE_NAME}:${experimentId}`)
  if (typeof cookieValue !== 'string') return

  const experimentVariant = getExperimentVariant(cookieValue)
  if (!experimentVariant) return

  tracking.reportExperimentImpression(experimentId, cookieValue)
}
