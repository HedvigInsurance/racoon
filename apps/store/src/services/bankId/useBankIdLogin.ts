import { useCallback, useRef } from 'react'
import { Subscription } from 'zen-observable-ts'
import { useShopSessionAuthenticateMutation } from '@/services/apollo/generated'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAccessToken } from '@/services/authApi/persist'
import { apiStatusToBankIdState, bankIdLogger } from '@/services/bankId/bankId.utils'
import { BankIdDispatch } from '@/services/bankId/bankIdReducer'

type Options = {
  shopSessionId?: string
  ssn?: string
  dispatch: BankIdDispatch
}
export const useBankIdLogin = ({ shopSessionId, ssn, dispatch }: Options) => {
  const subscriptionRef = useRef<Subscription | null>(null)
  const [authenticateShopSession] = useShopSessionAuthenticateMutation()
  const startLogin = useCallback(async () => {
    if (!shopSessionId || !ssn) throw new Error('Must have shopSession with ID and customer SSN')

    bankIdLogger.debug('Starting BankId login')
    // Future ideas
    // - try Observable.from().forEach to await final result and Promise.finally to clean up ref
    subscriptionRef.current = loginMemberSeBankId(ssn).subscribe({
      async next(statusResponse) {
        dispatch({
          type: 'operationStateChange',
          nextOperationState: apiStatusToBankIdState(statusResponse.status),
        })
        if (statusResponse.status === 'COMPLETED') {
          const accessToken = await exchangeAuthorizationCode(statusResponse.authorizationCode)
          saveAccessToken(accessToken)
          bankIdLogger.debug('Got access token, authenticating shopSession')
          await authenticateShopSession({ variables: { shopSessionId } })
          bankIdLogger.debug('shopSession authenticated')
          dispatch({ type: 'success' })
        }
      },
      complete() {
        subscriptionRef.current = null
      },
      error(error: unknown) {
        subscriptionRef.current = null
        dispatch({ type: 'error', error })
      },
    })
  }, [authenticateShopSession, dispatch, shopSessionId, ssn])
  const cancelLogin = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
    dispatch({ type: 'cancel' })
  }, [dispatch])
  return { startLogin, cancelLogin }
}
