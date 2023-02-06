import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { BankIdLogin } from '@/components/BankIdLogin'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import {
  ShopSessionAuthenticationStatus,
  useShopSessionCustomerUpdateMutation,
} from '@/services/apollo/generated'
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

  return (
    <AuthPromptWrapper>
      <BankIdTextSection y={0.5}>
        <Text align="center">{t('LOGIN_BANK_ID')}</Text>
        <Text color="textSecondary">{t('LOGIN_BANK_ID_EXPLANATION')}</Text>
      </BankIdTextSection>
      <Space y={0.5}>
        <BankIdLogin shopSessionId={shopSessionId} ssn={ssn} onCompleted={onCompleted} />
        <Button variant="ghost" onClick={onCompleted}>
          {t('LOGIN_BANK_ID_SKIP')}
        </Button>
      </Space>
    </AuthPromptWrapper>
  )
}

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
