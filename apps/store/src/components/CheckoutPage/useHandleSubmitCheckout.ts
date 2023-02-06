import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { BankIdState, useBankIdLogin } from '@/services/bankId'
import {
  Params as SignCheckoutParams,
  useHandleSignShopSession,
} from '@/services/Checkout/useHandleSignShopSession'
import { useUpdateCustomer } from './useUpdateCustomer'

type Params = SignCheckoutParams & {
  shopSessionId: string
  ssn: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
}

export const useHandleSubmitCheckout = (params: Params) => {
  const {
    customerAuthenticationStatus,
    shopSessionId,
    ssn,
    shopSessionSigningId,
    onSuccess,
    onError,
  } = params
  const [startSign, signResult] = useHandleSignShopSession({
    shopSessionId,
    shopSessionSigningId,
    onSuccess,
    onError,
  })

  const [updateCustomer, updateCustomerResult] = useUpdateCustomer({
    shopSessionId,
  })

  const [startLogin, loginState] = useBankIdLogin({
    shopSessionId,
    ssn,
    onCompleted() {
      startSign()
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogLogs.logger.debug('Checkout | Submit')
    switch (customerAuthenticationStatus) {
      case ShopSessionAuthenticationStatus.None: {
        const formData = new FormData(event.currentTarget)
        await updateCustomer(formData)
        await startSign()
        break
      }
      case ShopSessionAuthenticationStatus.Authenticated: {
        await startSign()
        break
      }
      case ShopSessionAuthenticationStatus.AuthenticationRequired: {
        startLogin()
        break
      }
      default: {
        const status: never = customerAuthenticationStatus
        throw new Error(`Unexpected authentication status: ${status}`)
      }
    }
  }

  const loginLoading = [BankIdState.Starting, BankIdState.Pending].includes(loginState)
  const userError = updateCustomerResult.userError || signResult.userError

  return [
    handleSubmit,
    {
      loading: signResult.loading || updateCustomerResult.loading || loginLoading,
      userError,
      // TODO: Unify with login status for returning member
      signingStatus: signResult.signingStatus,
    },
  ] as const
}
