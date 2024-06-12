export const EXPERIMENT_COOKIE_NAME = 'hedvig-experiment'
import quickAddExperiment from '../../../experiments/quickAdd.json'

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

const experimentConfig = {
  QUICK_ADD: process.env.NEXT_PUBLIC_EXPERIMENT_ID_QUICK_ADD,
} as const

export type ExperimentConfig = keyof typeof experimentConfig

export const Experiments = {
  getId(experiment: ExperimentConfig) {
    return experimentConfig[experiment]
  },
}

export const CURRENT_EXPERIMENTS: Array<Experiment> | undefined = [
  ...(experimentConfig.QUICK_ADD
    ? [
        {
          id: experimentConfig.QUICK_ADD,
          ...quickAddExperiment,
        },
      ]
    : []),
]
