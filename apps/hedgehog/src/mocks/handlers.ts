import { HttpResponse } from 'msw'

import {
  mockListClaimsQuery,
  mockUsersQuery,
} from 'types/generated/msw/graphql'

import { users } from './data/users'
import { claims } from './data/claims'

const usersQueryHandler = mockUsersQuery(() => {
  return HttpResponse.json({
    data: {
      users,
    },
  })
})

function paginateArray<T>(array: T[], page: number, pageSize: number): T[] {
  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize

  return array.slice(startIndex, endIndex)
}

const claimsQueryHandler = mockListClaimsQuery(
  ({
    variables: {
      options: { page, pageSize },
    },
  }) => {
    // Default values come from use-list-claims.tsx
    const paginatedClaims = paginateArray(claims, page || 0, pageSize || 20)

    return HttpResponse.json({
      data: {
        listClaims: {
          __typename: 'ListClaimsResult',
          claims: paginatedClaims,
          page: 0,
          totalPages: 2,
          totalClaims: 34,
        },
      },
    })
  },
)

export const handlers = [usersQueryHandler, claimsQueryHandler]
