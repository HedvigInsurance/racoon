import gql from 'graphql-tag'
import { useContractMarketInfoQuery } from 'types/generated/graphql'

gql`
  query ContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId

      contractMarketInfo {
        market
        preferredCurrency
      }
    }
  }
`

interface UseContractMarketInfoResult {
  market?: string
  preferredCurrency?: string
}

export const useContractMarketInfo = (
  memberId: string,
): UseContractMarketInfoResult => {
  const { data } = useContractMarketInfoQuery({
    variables: { memberId },
    fetchPolicy: 'cache-first',
    skip: !memberId,
  })

  const market = data?.member?.contractMarketInfo?.market
  const preferredCurrency = data?.member?.contractMarketInfo?.preferredCurrency

  return {
    market,
    preferredCurrency,
  }
}
