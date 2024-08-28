import gql from 'graphql-tag'
import { Market } from '@hope/features/config/constants'
import {
  useAddUserMarketMutation,
  useMyMarketsQuery,
  useRemoveUserMarketMutation,
} from 'types/generated/graphql'

gql`
  query MyMarkets {
    me {
      email
      user {
        id
        markets
      }
    }
  }

  mutation AddUserMarket($market: String!) {
    userSetMarket(market: $market, value: true) {
      id
      markets
    }
  }

  mutation RemoveUserMarket($market: String!) {
    userSetMarket(market: $market, value: false) {
      id
      markets
    }
  }
`

interface UseMyMarketsResult {
  markets: Market[]
  loading: boolean
  addMarket: (market: Market) => void
  removeMarket: (market: Market) => void
}

export const useMyMarkets = (): UseMyMarketsResult => {
  const { data, loading } = useMyMarketsQuery()
  const [removeMarket] = useRemoveUserMarketMutation()
  const [addMarket] = useAddUserMarketMutation()

  const markets = (data?.me?.user?.markets ?? []) as Market[]

  const addHandler = (market: Market) => {
    addMarket({
      variables: {
        market,
      },
      optimisticResponse: {
        userSetMarket: {
          id: data?.me?.user?.id ?? 'temp-id',
          markets: [...markets, market],
        },
      },
    })
  }

  const removeHandler = (market: Market) => {
    removeMarket({
      variables: {
        market,
      },
      optimisticResponse: {
        userSetMarket: {
          id: data?.me?.user?.id ?? 'temp-id',
          markets: markets.filter((m) => m !== market),
        },
      },
    })
  }

  return {
    markets,
    loading,
    addMarket: addHandler,
    removeMarket: removeHandler,
  }
}
