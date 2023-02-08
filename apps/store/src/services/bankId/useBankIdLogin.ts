import { datadogLogs } from '@datadog/browser-logs'
import { useCallback, useState } from 'react'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdState } from '@/services/bankId/bankId.types'

type BankIdLoginOptions = {
  onCompleted: () => void
}
type StartLoginOptions = {
  shopSessionId: string
  ssn: string
}
export const useBankIdLogin = ({ onCompleted }: BankIdLoginOptions) => {
  const [loginState, setLoginState] = useState(BankIdState.Idle)
  // TODO: Expose and handle errors
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()
  const startLogin = useCallback(
    async ({ shopSessionId, ssn }: StartLoginOptions) => {
      setLoginState(BankIdState.Starting)
      try {
        const authorizationCode = await loginMemberSeBankId(ssn, (status) => {
          setLoginState(() => {
            switch (status) {
              case 'PENDING':
                return BankIdState.Pending
              case 'COMPLETED':
                return BankIdState.Success
              case 'FAILED':
                return BankIdState.Error
            }
          })
        })
        const accessToken = await exchangeAuthorizationCode(authorizationCode)
        saveAccessToken(accessToken)
        await authenticateShopSession({ variables: { shopSessionId } })
        onCompleted()
      } catch (error) {
        datadogLogs.logger.warn('Failed to authenticate', { error })
        setLoginState(BankIdState.Error)
      }
    },
    [authenticateShopSession, onCompleted],
  )
  return [startLogin, loginState] as const
}
