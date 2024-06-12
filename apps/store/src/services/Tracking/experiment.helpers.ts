import { getCookie } from 'cookies-next'
import type {
  ExperimentConfig} from './experiment.constants';
import {
  CURRENT_EXPERIMENTS,
  EXPERIMENT_COOKIE_NAME,
  Experiments,
  type Experiment,
  type ExperimentVariant,
} from './experiment.constants'

export const getCurrentExperiments = (): Array<Experiment> | undefined => {
  return CURRENT_EXPERIMENTS
}

export const getExperimentVariant = (cookieValue?: string): ExperimentVariant | undefined => {
  if (!cookieValue) return

  const [experimentId, rawVariantId] = cookieValue.split('.')
  const currentExperiments = getCurrentExperiments()
  const currentExperiment = currentExperiments?.find((experiment) => experiment.id === experimentId)

  if (!currentExperiment) return

  if (experimentId !== currentExperiment.id) {
    console.info(
      `getExperimentVariant | Experiment mismatch: ${experimentId} (${currentExperiment.id})`,
    )
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

export const experimentImpressionVariantId = (
  experiment: Experiment,
  variant: ExperimentVariant,
) => {
  return `${experiment.id}.${variant.id}`
}

export const getExperimentId = (experimentVariant: string) => {
  return experimentVariant.split('.')[0]
}
