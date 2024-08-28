import { createContext } from 'react'
import { defaultDateFilter } from '../constants'
import { useEntrypointsData } from '../hooks'

type UseEntrypointsDataReturnType = ReturnType<typeof useEntrypointsData>

export const EntrypointsContext = createContext<UseEntrypointsDataReturnType>({
  allEntrypoints: [],
  entrypoints: [],
  isLoadingEntrypoints: false,
  createEntrypoint: () => new Promise(() => null),
  isCreatingEntrypoint: false,
  updateEntrypoint: () => new Promise(() => null),
  isUpdatingEntrypoint: false,
  removeEntrypoint: () => new Promise(() => null),
  isRemovingEntrypoint: false,
  appliedFilters: {
    createdAt: defaultDateFilter,
  },
  toggleFilterOption: () => null,
  clearDateFilter: () => null,
  sortField: '',
  updateSortField: () => null,
  sortDirection: 1,
  selectedEntrypoint: undefined,
  setSelectedEntrypointId: () => null,
})
