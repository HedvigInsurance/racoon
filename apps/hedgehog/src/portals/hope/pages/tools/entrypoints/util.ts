import { format } from 'date-fns'
import { EntrypointFragment } from 'types/generated/graphql'
import { TAppliedFilters, TFilterKey } from './types'

export const filterEntrypoint = (
  entrypoint: EntrypointFragment,
  appliedFilters: TAppliedFilters,
) =>
  Object.keys(appliedFilters).every((key) => {
    const filterField = key as TFilterKey
    switch (filterField) {
      case 'createdAt':
        return (
          new Date(entrypoint.createdAt) >=
            new Date(appliedFilters[filterField]?.min) &&
          new Date(format(new Date(entrypoint.createdAt), 'yyyy-MM-dd')) <=
            new Date(appliedFilters[filterField]?.max)
        )
      default:
        return (
          appliedFilters[filterField]?.includes(entrypoint[filterField]) ||
          appliedFilters[filterField]?.includes('') ||
          !appliedFilters[filterField]?.length
        )
    }
  })
