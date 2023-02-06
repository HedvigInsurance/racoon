import { datadogLogs } from '@datadog/browser-logs'
import { useCallback, useState } from 'react'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'

export enum BankIdState {
  Idle = 'Idle',
  Starting = 'Starting',
  Pending = 'Pending', // Waiting for user to open BankId app
  Success = 'Success',
  Error = 'Error',
}

type BankIdLoginOptions = {
  shopSessionId: string
  ssn: string
  onCompleted: () => void
}
export const useBankIdLogin = ({ shopSessionId, ssn, onCompleted }: BankIdLoginOptions) => {
  const [state, setState] = useState(BankIdState.Idle)
  const [authenticateShopSession] = useShopSessionAuthenticateMutation({
    variables: { shopSessionId },
  })
  const startLogin = useCallback(async () => {
    setState(BankIdState.Starting)
    try {
      const authorizationCode = await loginMemberSeBankId(ssn, (status) => {
        setState(() => {
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
      await authenticateShopSession()
      onCompleted()
    } catch (error) {
      datadogLogs.logger.warn('Failed to authenticate', { error })
      setState(BankIdState.Error)
    }
  }, [authenticateShopSession, onCompleted, ssn])
  return [state, startLogin] as const
}
