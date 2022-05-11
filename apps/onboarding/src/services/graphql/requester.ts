import { Requester } from './generated'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (!GRAPHQL_ENDPOINT) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set')

export const requester: Requester = async (doc, variables) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: doc.loc?.source.body,
      variables,
    }),
  })

  if (response.ok) {
    const json = await response.json()
    return json.data
  }

  throw new Error(response.statusText)
}
