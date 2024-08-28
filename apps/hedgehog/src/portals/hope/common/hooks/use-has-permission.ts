import { useMyRoleQuery } from 'types/generated/graphql'
import gql from 'graphql-tag'

/**
 * This abstraction is done to simplify upcoming permission & restriction setups.
 * For now, it will just do naive restriction based on user role.
 */

gql`
  query MyRole {
    me {
      email
      role
      user {
        id
        email
      }
    }
  }
`

const permissions = [
  'inbox',
  'navigateInbox',
  'exploreInbox',
  'navigateTools',
  'searchMembers',
  'searchQuotes',
  'searchCarts',
  'searchCarMembers',
  'searchShopSessions',
  'listCarClaims',
] as const
export type RestrictedResource = (typeof permissions)[number]

const permissionMap: Record<RestrictedResource, string[]> = {
  inbox: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV', 'CAR_TPA'],
  navigateInbox: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV', 'CAR_TPA'],
  exploreInbox: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  navigateTools: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  searchCarMembers: ['CAR_TPA'],
  searchQuotes: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  searchCarts: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  searchMembers: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  searchShopSessions: ['IEX', 'IEX_EXTENDED', 'ROOT', 'DEV'],
  listCarClaims: ['CAR_TPA'],
}

export const useHasPermission = (
  resource: RestrictedResource,
): { hasPermission: boolean; loading: boolean } => {
  const { data, loading } = useMyRoleQuery({ fetchPolicy: 'cache-first' })
  const role = data?.me?.role
  const email = data?.me?.user?.email

  if (!role || !email) return { hasPermission: false, loading }

  return {
    hasPermission:
      permissionMap[resource].includes(role) ||
      permissionMap[resource].includes(email),
    loading,
  }
}
