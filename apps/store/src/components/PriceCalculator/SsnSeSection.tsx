import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { FormEventHandler, useCallback } from 'react'
import { Button, Space } from 'ui'
import { ChangeSsnWarningDialog } from '@/components/ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  ShopSessionAuthenticationStatus,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useErrorMessage } from '@/utils/useErrorMessage'

const SsnFieldName = 'ssn'

type Props = {
  shopSession: ShopSession
  onCompleted: () => void
}

// States
// - Empty or auth required => Sign in offered
// - Member authenticated => Warning to reset session in order to edit
export const SsnSeSection = ({ shopSession, onCompleted }: Props) => {
  const router = useRouter()

  const handleChangeSsn = useCallback(async () => {
    datadogLogs.logger.info('Cleared shopSession to change SSN in price calculator')

    const url = new URL(window.location.href)
    url.searchParams.append(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
    await router.replace(url)
  }, [router])

  if (shopSession.customer?.ssn) {
    return <ChangeSsnWarningDialog open={true} onAccept={handleChangeSsn} onDecline={onCompleted} />
  } else {
    return <SsnInputSection shopSession={shopSession} onCompleted={onCompleted} />
  }
}

const SsnInputSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  const { showLoginPrompt } = useBankIdContext()
  const [updateCustomer, result] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted(data) {
      const { shopSession } = data.shopSessionCustomerUpdate
      if (!shopSession) return

      const { authenticationStatus } = shopSession.customer ?? {}
      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        const ssn = shopSession.customer!.ssn!
        showLoginPrompt({ ssn, onCompleted })
      } else {
        onCompleted()
      }
    },
    onError(error) {
      datadogLogs.logger.debug('Failed to update customer ssn', { error })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = event.currentTarget[SsnFieldName].value
    if (typeof ssn !== 'string') throw new Error('No SSN found in SSN section form')
    updateCustomer({ variables: { input: { shopSessionId: shopSession.id, ssn } } })
  }

  const errorMessage = useErrorMessage(result.error)
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Space y={errorMessage ? 1 : 0.25}>
          <PersonalNumberField
            label={t('FIELD_SSN_SE_LABEL')}
            name={SsnFieldName}
            defaultValue={shopSession.customer?.ssn ?? ''}
            required={true}
            warning={!!errorMessage}
            message={errorMessage}
          />
          <Button type="submit" loading={result.loading}>
            {t('SUBMIT_LABEL_PROCEED')}
          </Button>
        </Space>
      </form>
    </>
  )
}
SsnSeSection.sectionId = 'ssn-se'
