import { getCookie } from 'cookies-next'
import {
  CURRENT_EXPERIMENTS,
  type CurrentExperiments,
  EXPERIMENT_COOKIE_NAME,
  type Experiment,
  type ExperimentConfig,
  type ExperimentVariant,
  Experiments,
} from './experiment.constants'

export const getCurrentExperiments = (): CurrentExperiments | undefined => {
  return CURRENT_EXPERIMENTS
}

export const getCurrentExperiment = (experimentId: string): Experiment | undefined => {
  return CURRENT_EXPERIMENTS[experimentId]
}

export const getExperimentVariant = (cookieValue?: string): ExperimentVariant | undefined => {
  if (!cookieValue) return

  const [experimentId, rawVariantId] = cookieValue.split('.')
  const currentExperiment = getCurrentExperiment(experimentId)

  if (!currentExperiment) {
    console.info(`getExperimentVariant | Experiment not found: ${experimentId}`)
    return
  }

  const variantId = parseInt(rawVariantId)
  if (isNaN(variantId)) {
    console.info(`getExperimentVariant | Invalid variantId: ${rawVariantId} (${experimentId})`)
    return
  }

  const variant = currentExperiment.variants.find((variant) => variant.id === variantId)
  if (!variant) {
    console.info(`getExperimentVariant | Variant not found: ${variantId} (${experimentId})`)
    return
  }

  return variant
}

export const getExperimentVariantByName = (
  experimentName: ExperimentConfig,
): ExperimentVariant | undefined => {
  const experimentId = Experiments.getId(experimentName)
  if (!experimentId) return

  const cookieValue = getCookie(`${EXPERIMENT_COOKIE_NAME}:${experimentId}`)

  return getExperimentVariant(cookieValue)
}

export const getExperimentId = (experimentVariant: string) => {
  return experimentVariant.split('.')[0]
}
