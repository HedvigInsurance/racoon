import gql from 'graphql-tag'
import { useContext, useMemo, useState } from 'react'
import { stringSortByNumberOrText, useLocalStorage } from '@hedvig-ui'
import { EntrypointFragment } from 'types/generated/graphql'
import { EntrypointsContext } from '../context/EntrypointsContext'
import { TAppliedFilters, TFilterKey } from '../types'
import { defaultFilters } from '../constants'
import { filterEntrypoint } from '../util'
import { format } from 'date-fns'
import { useEntrypoint } from './use-entrypoint'
import { useAllEntrypoints } from './use-all-entrypoints'

gql`
  query ListEntrypoints {
    entrypoints {
      ...Entrypoint
    }
  }

  fragment Entrypoint on Entrypoint {
    id
    displayName
    acceptLanguage
    keywords
    createdAt
    updatedAt
    removedAt
  }
`

export const useEntrypointsData = () => {
  const { allEntrypoints, isLoadingEntrypoints } = useAllEntrypoints()
  const {
    createEntrypoint,
    isCreatingEntrypoint,
    updateEntrypoint,
    isUpdatingEntrypoint,
    removeEntrypoint,
    isRemovingEntrypoint,
  } = useEntrypoint()

  const [appliedFilters, setAppliedFilters] = useLocalStorage<TAppliedFilters>(
    'hvg:entrypoint-filters',
    defaultFilters,
  )

  const filteredEntrypoints = useMemo(() => {
    return (
      allEntrypoints.filter((entrypoint) =>
        filterEntrypoint(entrypoint, appliedFilters),
      ) ?? []
    )
  }, [allEntrypoints, appliedFilters])

  const toggleFilterOption = (
    filterField: TFilterKey,
    value: string | { min: string; max: string },
  ) => {
    setAppliedFilters((prev) => {
      const newFilters = { ...prev }
      switch (filterField) {
        case 'createdAt':
          newFilters[filterField] = value as { min: string; max: string }
          break
        default:
          if (!value) {
            newFilters[filterField] = [value]
            return newFilters
          }
          if (prev[filterField]?.includes(value as string)) {
            newFilters[filterField] = prev[filterField]?.filter(
              (filterValue) => filterValue !== value,
            )
            if (!newFilters[filterField]?.length) {
              newFilters[filterField] = ['']
            }
            return newFilters
          }
          newFilters[filterField]?.push(value as string)
          newFilters[filterField] = newFilters[filterField]?.filter(
            (filter) => !!filter,
          )
          break
      }
      return newFilters
    })
  }

  const [sortField, setSortField] = useLocalStorage<
    keyof EntrypointFragment | ''
  >('hvg:entrypoint-sortField', '')
  const [sortDirection, setSortDirection] = useLocalStorage(
    'hvg:entrypoint-sortDirection',
    1,
  )

  const updateSortField = (fieldName: keyof EntrypointFragment) => {
    if (sortField === fieldName) {
      setSortDirection((prev) => -1 * prev)
      return
    }
    setSortField(fieldName)
  }

  const sortedEntrypoints = useMemo(() => {
    if (!(sortField && filteredEntrypoints.length)) return filteredEntrypoints
    if (!(sortField in filteredEntrypoints[0])) return filteredEntrypoints
    return [...filteredEntrypoints].sort((a, b) => {
      return (
        sortDirection * stringSortByNumberOrText(a[sortField], b[sortField])
      )
    })
  }, [filteredEntrypoints, sortField, sortDirection])

  const clearDateFilter = (fieldName: 'createdAt') => {
    setAppliedFilters((prev) => ({
      ...prev,
      [fieldName]: {
        min: '2023-01-01',
        max: format(new Date(), 'yyyy-MM-dd'),
      },
    }))
  }

  const [selectedEntrypointId, setSelectedEntrypointId] = useState<string>()

  const selectedEntrypoint = useMemo(
    () =>
      allEntrypoints.find(
        (entrypoint) => entrypoint.id === selectedEntrypointId,
      ),
    [allEntrypoints, selectedEntrypointId],
  )

  return {
    allEntrypoints: allEntrypoints,
    entrypoints: sortedEntrypoints,
    isLoadingEntrypoints,
    createEntrypoint,
    isCreatingEntrypoint,
    updateEntrypoint,
    isUpdatingEntrypoint,
    removeEntrypoint,
    isRemovingEntrypoint,
    appliedFilters,
    toggleFilterOption,
    clearDateFilter,
    sortField,
    updateSortField,
    sortDirection,
    selectedEntrypoint,
    setSelectedEntrypointId,
  }
}

export const useEntrypoints = () => useContext(EntrypointsContext)
