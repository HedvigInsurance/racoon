import { format } from 'date-fns'
import { TAppliedFilters, TFilter, TFilterKey, TFilterOption } from './types'

export const LOCALES: TFilterOption[] = [
  { value: 'SV_SE', text: 'Sweden (Swedish)' },
  { value: 'EN_SE', text: 'Sweden (English)' },
  { value: 'DA_DK', text: 'Denmark (Danish)' },
  { value: 'EN_DK', text: 'Denmark (English)' },
  { value: 'NB_NO', text: 'Norway (Norweigan)' },
  { value: 'EN_NO', text: 'Norway (English)' },
]

export const defaultDateFilter = {
  min: '2023-01-01',
  max: format(new Date(), 'yyyy-MM-dd'),
}

export const FILTERS: Partial<Record<TFilterKey, TFilter>> = {
  acceptLanguage: {
    displayName: 'Locale',
    options: [{ value: '', text: 'All' }, ...LOCALES],
  },
  createdAt: {
    displayName: 'Created At',
    ...defaultDateFilter,
  },
}

export const defaultFilters = Object.keys(FILTERS ?? {}).reduce((acc, key) => {
  const filterField = key as keyof TAppliedFilters
  switch (filterField) {
    case 'createdAt':
      acc[filterField] = defaultDateFilter
      break
    default:
      acc[filterField] = ['']
      break
  }
  return acc
}, {} as TAppliedFilters)
