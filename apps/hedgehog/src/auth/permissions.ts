import { authState } from './auth.state'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

const permissions = {
  auth: { 'auth-manage': P() },
  'back-office': { 'hope:write': P(), 'users:manage': P() },
  claims: {
    'claims:read': P(),
    'claims:write': P(),
    'claims:delete': P(),
    'payment-orders:settle-manual': P(),
    'payment-orders:admin': P(),
  },
  'member-service': { 'bonus-partner:manual-payout': P() },
  members: { 'member-data:search': P() },
  storefront: { 'store-data:read': P() },
  contracts: { 'contracts:historic-changes': P() },
  underwriter: { 'quotes:car-override-price': P() },
} as const satisfies Record<string, Record<string, AuthPermission>>

export type AuthPermission = {
  domain: keyof typeof permissions | ''
  permission: string
}

function P(): AuthPermission {
  return { domain: '', permission: '' }
}

for (const [domain, domainPermissions] of Object.entries(permissions)) {
  for (const permission of Object.keys(domainPermissions)) {
    Object.assign(
      domainPermissions[permission as keyof typeof domainPermissions],
      {
        domain,
        permission,
      },
    )
  }
}

export const hopeAuthPermissions = permissions

export const staticPermissions = Object.values(hopeAuthPermissions)
  .flatMap((x) => Object.values(x))
  .reduce(
    (acc, { domain, permission }) => {
      if (permission === 'auth-manage' || domain === '') return acc
      acc[domain] = acc[domain]
        ? [...new Set([...acc[domain], permission])]
        : [permission]
      return acc
    },
    {} as Record<string, string[]>,
  )

export const getAuthPermissions = (): Record<string, string[]> | undefined => {
  const { accessToken } = authState()
  if (!accessToken) return undefined

  const parsedToken = jwtDecode<
    JwtPayload & { permissions?: Record<string, string[]> }
  >(accessToken)

  if ('permissions' in parsedToken) {
    return parsedToken.permissions
  }

  return undefined
}
