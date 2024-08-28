import { useListEntrypointsQuery } from 'types/generated/graphql'

export const useAllEntrypoints = () => {
  const { data, loading: isLoadingEntrypoints } = useListEntrypointsQuery()

  return {
    allEntrypoints: data?.entrypoints ?? [],
    isLoadingEntrypoints,
  }
}
