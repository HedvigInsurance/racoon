import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, ReactElement } from 'react'
import { WarningTriangleIcon } from 'ui/src/icons/WarningTriangleIcon'
import { BankIdIcon, Button, Space, Text, theme } from 'ui'
import { BankIdLoginForm } from '@/components/BankIdLogin'
import { TickIcon } from '@/components/CheckoutPage/TickIcon'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import {
  ShopSessionAuthenticationStatus,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
import { BankIdState, useBankIdLogin } from '@/services/bankId'
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
    authenticationStatus === ShopSessionAuthenticationStatus.None
  ) {
    return <NewMemberSsnSection shopSession={shopSession} onCompleted={onCompleted} />
  } else if (authenticationStatus === ShopSessionAuthenticationStatus.AuthenticationRequired) {
    const { ssn } = shopSession.customer ?? {}
    if (!ssn) {
      throw new Error('Must have ssn at this point')
    }
    return (
      <AuthenticationRequiredSsnSection
        shopSessionId={shopSession.id}
        ssn={ssn}
        onCompleted={onCompleted}
      />
    )
  } else if (authenticationStatus === ShopSessionAuthenticationStatus.Authenticated) {
    return <AuthenticatedSsnSection shopSession={shopSession} onCompleted={onCompleted} />
  } else {
    const status: never = authenticationStatus
    throw new Error(`Unexpected authenticationStatus: ${status}`)
  }
}

const NewMemberSsnSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  // TODO: Show error message if customer update fails
  const [updateCustomer, { loading }] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted(data) {
      const { shopSession } = data.shopSessionCustomerUpdate
      if (shopSession?.customer?.authenticationStatus === ShopSessionAuthenticationStatus.None) {
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

type AuthenticationRequiredProps = {
  shopSessionId: string
  ssn: string
  onCompleted: Props['onCompleted']
}
const AuthenticationRequiredSsnSection = ({
  shopSessionId,
  ssn,
  onCompleted,
}: AuthenticationRequiredProps) => {
  const { t } = useTranslation('purchase-form')
  const [state, startLogin] = useBankIdLogin({ shopSessionId, ssn, onCompleted })

  let textBlock: ReactElement
  let actionBlock: ReactElement | null
  switch (state) {
    case BankIdState.Idle: {
      textBlock = (
        <>
          <Text align="center">{t('LOGIN_BANKID')}</Text>
          <Text align="center" color="textSecondary">
            {t('LOGIN_BANKID_EXPLANATION')}
          </Text>
        </>
      )
      actionBlock = (
        <>
          <BankIdLoginForm
            state={state}
            title={t('LOGIN_BUTTON_TEXT', { ns: 'common' })}
            onLoginStart={startLogin}
          />
          <Button variant="ghost" onClick={onCompleted}>
            {t('LOGIN_BANKID_SKIP')}
          </Button>
        </>
      )
      break
    }
    case BankIdState.Pending:
    case BankIdState.Starting: {
      textBlock = (
        <>
          <IconWithText>
            <BankIdIcon />
            {t('LOGIN_BANKID_WAITING')}
          </IconWithText>
          <Text align="center" color="textSecondary">
            {state === BankIdState.Pending ? t('LOGIN_BANKID_OPEN_APP') : ''}
          </Text>
        </>
      )
      // TODO: Cancel button (GRW-2183)
      actionBlock = null
      break
    }
    case BankIdState.Success: {
      textBlock = (
        <IconWithText>
          <TickIcon color="greenElement" />
          {t('LOGIN_BANKID_SUCCESS')}
        </IconWithText>
      )
      actionBlock = null
      break
    }
    case BankIdState.Error: {
      textBlock = (
        <IconWithText>
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <Text align="center">{t('LOGIN_BANKID_ERROR')}</Text>
        </IconWithText>
      )
      actionBlock = (
        <>
          <BankIdLoginForm
            state={state}
            title={t('LOGIN_BANKID_TRY_AGAIN')}
            onLoginStart={startLogin}
          />
          <Button variant="ghost" onClick={onCompleted}>
            {t('LOGIN_BANKID_SKIP')}
          </Button>
        </>
      )
      break
    }
  }

  return (
    <AuthPromptWrapper>
      <BankIdTextSection y={0.5}>{textBlock}</BankIdTextSection>
      <Space y={0.5}>{actionBlock}</Space>
    </AuthPromptWrapper>
  )
}

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const AuthPromptWrapper = styled.div({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backdropFilter: 'blur(64px)',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.md,
})

const BankIdTextSection = styled(Space)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const AuthenticatedSsnSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  return (
    <div>
      Authenticated: {JSON.stringify(shopSession.customer, null, 2)}
      <Button onClick={onCompleted}>{t('SUBMIT_LABEL_PROCEED')}</Button>
    </div>
  )
}
