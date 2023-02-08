import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import {
  ShopSessionAuthenticationStatus,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

const SsnFieldName = 'ssn'

type Props = {
  shopSession: ShopSession
  onCompleted: () => void
}

// States
// - Empty input, no customer information
// - Auth required => Sign in required
// - Authenticated

export const SsnSeSection = ({ shopSession, onCompleted }: Props) => {
  const { authenticationStatus } = shopSession.customer ?? {}
  if (
    !shopSession.customer ||
    !authenticationStatus ||
    authenticationStatus === ShopSessionAuthenticationStatus.None ||
    authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired
  ) {
    return <NewMemberSsnSection shopSession={shopSession} onCompleted={onCompleted} />
  } else if (authenticationStatus === ShopSessionAuthenticationStatus.Authenticated) {
    return <AuthenticatedSsnSection shopSession={shopSession} onCompleted={onCompleted} />
  } else {
    const status: never = authenticationStatus
    throw new Error(`Unexpected authenticationStatus: ${status}`)
  }
}

const NewMemberSsnSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  const { showLoginPrompt } = useBankIdContext()
  // TODO: Show error message if customer update fails
  const [updateCustomer, { loading }] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted(data) {
      const { shopSession } = data.shopSessionCustomerUpdate
      const { authenticationStatus } = shopSession?.customer ?? {}
      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        showLoginPrompt({ onSuccess: onCompleted, onCancel: onCompleted })
      } else {
        onCompleted()
      }
    },
    onError(error) {
      datadogLogs.logger.error("Couldn't update customer ssn", { error })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = event.currentTarget[SsnFieldName].value
    if (typeof ssn !== 'string') throw new Error('No SSN found in SSN section form')
    updateCustomer({ variables: { input: { shopSessionId: shopSession.id, ssn } } })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Space y={0.25}>
          <PersonalNumberField
            label={t('FIELD_SSN_SE_LABEL')}
            name={SsnFieldName}
            defaultValue={shopSession.customer?.ssn ?? ''}
            required
          />
          <Button type="submit" loading={loading}>
            {t('SUBMIT_LABEL_PROCEED')}
          </Button>
        </Space>
      </form>
    </>
  )
}
SsnSeSection.sectionId = 'ssn-se'

const AuthenticatedSsnSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  return (
    <div>
      Authenticated: {JSON.stringify(shopSession.customer, null, 2)}
      <Button onClick={onCompleted}>{t('SUBMIT_LABEL_PROCEED')}</Button>
    </div>
  )
}
