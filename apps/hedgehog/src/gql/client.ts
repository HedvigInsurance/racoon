import { GraphQLClient } from 'graphql-request'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAuthCredentials } from 'auth/auth.api'
import { getSdk } from 'types/generated/graphql-rsc'

async function createGraphQLClient() {
  const { accessToken } = await getAuthCredentials(cookies)

  if (!accessToken) {
    redirect('/login/logout')
  }

  const client = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return client
}

export async function getClient() {
  const client = await createGraphQLClient()
  return getSdk(client)
}
