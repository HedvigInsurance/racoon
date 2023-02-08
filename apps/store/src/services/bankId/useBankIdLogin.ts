import { datadogLogs } from '@datadog/browser-logs'
import { Dispatch, useCallback } from 'react'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { BankIdAction, BankIdState } from '@/services/bankId/bankId.types'
import { apiStatusToBankIdState } from '@/services/bankId/bankId.utils'

type Options = {
  shopSessionId?: string
  ssn?: string
  dispatch: Dispatch<BankIdAction>
}
export const useBankIdLogin = ({ shopSessionId, ssn, dispatch }: Options) => {
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()
  return useCallback(async () => {
    if (!shopSessionId || !ssn) throw new Error('Must have shopSession with ID and customer SSN')

    datadogLogs.logger.log('Starting BankId login')
    dispatch({ type: 'operationStateChange', nextOperationState: BankIdState.Starting })
    try {
      const authorizationCode = await loginMemberSeBankId(ssn, (status) => {
        dispatch({
          type: 'operationStateChange',
          nextOperationState: apiStatusToBankIdState(status),
        })
      })
      const accessToken = await exchangeAuthorizationCode(authorizationCode)
      saveAccessToken(accessToken)
      await authenticateShopSession({ variables: { shopSessionId } })
    } catch (error) {
      datadogLogs.logger.warn('Failed to authenticate', { error })
      dispatch({ type: 'error', error })
    }
  }, [authenticateShopSession, dispatch, shopSessionId, ssn])
}
