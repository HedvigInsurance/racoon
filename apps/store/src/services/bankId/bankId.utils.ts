import { datadogLogs } from '@datadog/browser-logs'
import { ShopSessionSigningStatus } from '@/services/apollo/generated'
import { BankIdState } from '@/services/bankId/bankId.types'

const stateMapping = {
  CREATING: BankIdState.Starting, // ShopSessionSigningStatus only
  PENDING: BankIdState.Pending,
  COMPLETED: BankIdState.Success, // Auth API only
  SIGNED: BankIdState.Success, // ShopSessionSigningStatus only
  FAILED: BankIdState.Error,
}

export const apiStatusToBankIdState = (
  apiState: keyof typeof stateMapping | ShopSessionSigningStatus,
) => stateMapping[apiState]

export const bankIdLogger = datadogLogs.createLogger('bankId')
