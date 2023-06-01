import { CURRENT_EXPERIMENT, type Experiment, type ExperimentVariant } from './experiment.constants'

export const getCurrentExperiment = (): Experiment | undefined => {
  return CURRENT_EXPERIMENT
}

export const getExperimentVariant = (cookieValue: string): ExperimentVariant | undefined => {
  const currentExperiment = getCurrentExperiment()
  if (!currentExperiment) return

  const [experimentId, rawVariantId] = cookieValue.split('.')

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

export const experimentImpressionVariantId = (
  experiment: Experiment,
  variant: ExperimentVariant,
) => {
  return `${experiment.id}.${variant.id}`
}
