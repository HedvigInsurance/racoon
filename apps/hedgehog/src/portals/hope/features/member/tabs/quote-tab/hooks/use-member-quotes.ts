import { parseISO } from 'date-fns'
import {
  ContractMarketInfo,
  MemberQuotesQueryHookResult,
  Quote,
  useMemberQuotesQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

gql`
  query MemberQuotes($memberId: ID!) {
    member(id: $memberId) {
      memberId
      contractMarketInfo {
        market
        preferredCurrency
      }
      pickedLocale
      quotes {
        id
        memberId
        price
        currency
        productType
        state
        validity
        isComplete
        createdAt
        breachedUnderwritingGuidelines
        underwritingGuidelinesBypassed
        market
        originatingProductId
        signedProductId
        isReadyToSign
        schema
        schemaData
        signedAt
        startDate
        initiatedFrom
      }
    }
  }
`

type MemberQuotesReturnTuple = [
  {
    quotes?: Quote[]
    contractMarket?: ContractMarketInfo
    pickedLocale?: string
  },
  MemberQuotesQueryHookResult,
]

const latest = (a: Quote, b: Quote) =>
  Number(parseISO(b.createdAt)) - Number(parseISO(a.createdAt))

export const useMemberQuotes = (memberId: string): MemberQuotesReturnTuple => {
  const queryResult = useMemberQuotesQuery({
    variables: {
      memberId,
    },
  })
  const quotes = queryResult.data?.member?.quotes
  const contractMarket =
    queryResult.data?.member?.contractMarketInfo ?? undefined
  const pickedLocale = queryResult.data?.member?.pickedLocale ?? undefined

  return [
    {
      quotes: quotes ? [...quotes].sort(latest) : undefined,
      contractMarket,
      pickedLocale,
    },
    queryResult,
  ]
}
