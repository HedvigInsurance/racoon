import { datadogLogs } from '@datadog/browser-logs'
import type { ShopSessionSigningStatus } from '@/services/graphql/generated'
import { BankIdState } from './bankId.types'

const stateMapping = {
  // That status is used in ShopSessionSigningStatus when signig after a login (unauthenticated returning member)
  CREATING: BankIdState.Success, // ShopSessionSigningStatus only
  PENDING: BankIdState.Pending,
  COMPLETED: BankIdState.Success, // Auth API only
  SIGNED: BankIdState.Success, // ShopSessionSigningStatus only
  FAILED: BankIdState.Error,
}

export const apiStatusToBankIdState = (
  apiState: keyof typeof stateMapping | ShopSessionSigningStatus,
) => stateMapping[apiState]

export const bankIdLogger = datadogLogs.createLogger('bankId')
