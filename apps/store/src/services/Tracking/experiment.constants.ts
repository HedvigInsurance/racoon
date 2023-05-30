export const EXPERIMENT_COOKIE_NAME = 'hedvig-experiment'

export type Experiment = {
  id: string
  name: string
  variants: ExperimentVariant[]
  slug: string
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
      name: 'Start page',
      id: EXPERIMENT_ID,
      slug: '/se',
      variants: [
        {
          name: 'Original',
          id: 0,
          weight: 50,
        },
        {
          name: 'Variant',
          id: 1,
          weight: 50,
          slug: '/start',
        },
      ],
    }
  : undefined
