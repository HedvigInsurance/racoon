import { EntrypointFragment } from 'types/generated/graphql'

export type TFilterOption = {
  value: string
  text: string
}

export type TFilter = {
  displayName: string
} & (
  | {
      options: TFilterOption[]
    }
  | {
      min: string
      max: string
    }
)

export type TFilterKey = Partial<keyof EntrypointFragment>

export type TAppliedFilters = Partial<
  Omit<Record<TFilterKey, string[]>, 'createdAt'>
> & { createdAt: { min: string; max: string } }
