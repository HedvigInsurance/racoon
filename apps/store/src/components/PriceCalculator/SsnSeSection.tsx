import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { FormEventHandler, useState } from 'react'
import { Button, Space, Text, theme, WarningTriangleIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import {
  ShopSessionAuthenticationStatus,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useGetMutationError } from '@/utils/useGetMutationError'

const SsnFieldName = 'ssn'

type Props = {
  shopSession: ShopSession
  onCompleted: () => void
}

// States
// - Empty or auth required => Sign in offered
// - Member authenticated => Warning to reset session in order to edit
export const SsnSeSection = ({ shopSession, onCompleted }: Props) => {
  if (shopSession.customer?.ssn) {
    return <ChangeSsnWarning shopSession={shopSession} onCompleted={onCompleted} />
  } else {
    return <SsnInputSection shopSession={shopSession} onCompleted={onCompleted} />
  }
}

const SsnInputSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  const getMutationError = useGetMutationError()
  const { showLoginPrompt } = useBankIdContext()
  const [updateCustomer, result] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted(data) {
      const { shopSession } = data.shopSessionCustomerUpdate
      if (!shopSession) return

      const { authenticationStatus } = shopSession?.customer ?? {}
      if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
        showLoginPrompt({ onCompleted })
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

  const mutationError = getMutationError(result, result.data?.shopSessionCustomerUpdate)
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Space y={0.25}>
          <PersonalNumberField
            label={t('FIELD_SSN_SE_LABEL')}
            name={SsnFieldName}
            defaultValue={shopSession.customer?.ssn ?? ''}
            required={true}
            warning={!!mutationError}
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

const ChangeSsnWarning = ({ onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  return (
    <FullscreenDialog.Root defaultOpen={true} onOpenChange={onCompleted}>
      <FullscreenDialog.Modal
        center
        Footer={
          <>
            <ResetSessionButton />
            <Button variant="ghost" onClick={onCompleted}>
              {t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}
            </Button>
          </>
        }
      >
        <IconWithText>
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <Text align="center">{t('CHANGE_SSN_TITLE')}</Text>
        </IconWithText>
        <Text color="textSecondary" align="center">
          {t('CHANGE_SSN_DESCRIPTION')}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const ResetSessionButton = () => {
  const { t } = useTranslation('purchase-form')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { reset: resetShopSession } = useShopSession()
  const handleClick = async () => {
    setLoading(true)
    datadogLogs.logger.info('Cleared shopSession to change SSN in price calculator')
    await resetShopSession()
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: 1 },
    })
  }
  return (
    <Button loading={loading} onClick={handleClick}>
      {t('CHANGE_SSN_BUTTON')}
    </Button>
  )
}

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
