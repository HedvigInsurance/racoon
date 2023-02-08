import { datadogLogs } from '@datadog/browser-logs'
import { useCallback } from 'react'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdOperationOptions, BankIdState } from '@/services/bankId/bankId.types'
import { apiStatusToBankIdState } from '@/services/bankId/bankId.utils'

type Options = {
  shopSessionId?: string
  ssn?: string
  onStateChange: (newState: BankIdState) => void
} & BankIdOperationOptions
export const useBankIdLogin = ({
  shopSessionId,
  ssn,
  onError,
  onStateChange,
  onSuccess,
}: Options) => {
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()
  return useCallback(
    async (options?: { onSuccess: BankIdOperationOptions['onSuccess'] }) => {
      if (!shopSessionId || !ssn) throw new Error('Must have shopSession with ID and customer SSN')

      datadogLogs.logger.log('Starting BankId login')
      onStateChange(BankIdState.Starting)
      try {
        const authorizationCode = await loginMemberSeBankId(ssn, (status) => {
          onStateChange(apiStatusToBankIdState(status))
        })
        const accessToken = await exchangeAuthorizationCode(authorizationCode)
        saveAccessToken(accessToken)
        await authenticateShopSession({ variables: { shopSessionId } })
        const handleSuccess = options?.onSuccess || onSuccess
        handleSuccess()
      } catch (error) {
        datadogLogs.logger.warn('Failed to authenticate', { error })
        onStateChange(BankIdState.Error)
        onError?.()
      }
    },
    [authenticateShopSession, onError, onStateChange, onSuccess, shopSessionId, ssn],
  )
}
