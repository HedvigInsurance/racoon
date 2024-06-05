export const EXPERIMENT_COOKIE_NAME = 'hedvig-experiment'
import experimentJson from '../../../experiment.json'

export type Experiment = {
  id: string
  name: string
  variants: Array<ExperimentVariant>
  slug?: string
}

export type ExperimentVariant = {
  id: number
  name: string
  weight: number
  slug?: string
}

const EXPERIMENT_ID = process.env.NEXT_PUBLIC_EXPERIMENT_ID

export const CURRENT_EXPERIMENT: Experiment | undefined = EXPERIMENT_ID
  ? {
      ...experimentJson,
      id: EXPERIMENT_ID,
    }
  : undefined
