import { useApolloClient } from '@apollo/client'
import useRouterRefresh from '@/hooks/useRouterRefresh'

export const useRefreshData = () => {
  const refreshData = useRouterRefresh()
  const apolloClient = useApolloClient()

  return async () => {
    return await Promise.all([refreshData(), apolloClient.refetchQueries({ include: 'active' })])
  }
}
