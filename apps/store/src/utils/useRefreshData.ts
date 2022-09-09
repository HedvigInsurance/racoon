import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'
import useRouterRefresh from '@/utils/useRouterRefresh'

export const useRefreshData = () => {
  const [loading, setLoading] = useState(false)
  const refreshRouter = useRouterRefresh()
  const apolloClient = useApolloClient()

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([refreshRouter(), apolloClient.refetchQueries({ include: 'active' })])
    } catch (error) {
      console.error('Unable to refresh data')
    } finally {
      setLoading(false)
    }
  }, [refreshRouter, apolloClient])

  return [refreshData, loading] as const
}
