import { useMemberQuotesQuery } from 'types/generated/graphql'
import { JsonSchemaFormData } from '@hedvig-ui/JsonSchemaForm/json-schema-form'

interface UseQuoteFieldSuggestionsResult {
  suggestions: JsonSchemaFormData
}

export const useQuoteFieldSuggestions = (
  memberId: string,
): UseQuoteFieldSuggestionsResult => {
  const { data } = useMemberQuotesQuery({
    variables: {
      memberId,
    },
    fetchPolicy: 'cache-first',
  })

  const quotes = data?.member?.quotes ?? []

  const suggestions = quotes
    .filter((quote) => quote.state === 'SIGNED')
    .slice()
    .sort((q1, q2) => (q1.createdAt < q2.createdAt ? 1 : -1))
    .reduce<JsonSchemaFormData>(
      (acc, quote) => ({ ...acc, ...quote.schemaData }),
      {},
    )

  return { suggestions }
}
