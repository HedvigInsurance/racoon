import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { useMemo, type FormEventHandler, useState } from 'react'
import { Button, Heading, Space, Text, mq, theme } from 'ui'
import { CardSkeleton, ContractCard } from '@/components/ConfirmationPage/ContractCard'
import { convertToBankSigneringContract } from '@/components/ConfirmationPage/useSwitchingContracts'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import { getAccessToken } from '@/services/authApi/persist'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { useContractQuery } from '@/services/graphql/generated'
import { MENU_BAR_HEIGHT_DESKTOP } from '../HeaderNew/Header.css'
import { MENU_BAR_HEIGHT_MOBILE } from '../HeaderNew/HeaderMenuMobile/HeaderMenuMobile.css'

const SSN_FIELD_NAME = 'ssn'

type Props = { contractId: string; ssn?: string; isAuthenticated: boolean }

export const InitiateCarCancellationPage = (props: Props) => {
  const { t } = useTranslation(['checkout', 'common'])
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return props.isAuthenticated || !!getAccessToken()
  })

  const showError = useShowAppError()
  const { data, loading } = useContractQuery({
    variables: { id: props.contractId },
    skip: !isAuthenticated,
    onError: showError,
    onCompleted(data) {
      const bankSigneringContract = convertToBankSigneringContract(data.contract)
      if (!bankSigneringContract) {
        datadogLogs.logger.warn(
          'Rendered InitiateCarCancellationPage without BankSigneringContract',
          {
            contractId: props.contractId,
          },
        )
        showError(new Error(t('UNKNOWN_ERROR_MESSAGE', { ns: 'common' })))
      }
    },
  })

  const bankSigneringContract = useMemo(
    () => (data?.contract ? convertToBankSigneringContract(data.contract) : undefined),
    [data],
  )

  if (!isAuthenticated) {
    return (
      <Layout>
        <Space y={{ base: 1.5, lg: 2 }}>
          <Heading as="h1" variant="standard.24">
            {t('CONFIRMATION_SWITCHING_TITLE')}
          </Heading>
          <LoginForm ssn={props.ssn} onSuccess={() => setIsAuthenticated(true)} />
        </Space>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <Space y={{ base: 1.5, lg: 2 }}>
          <Heading as="h1" variant="standard.24">
            {t('CONFIRMATION_SWITCHING_TITLE')}
          </Heading>
          <CardSkeleton />
        </Space>
      </Layout>
    )
  }

  if (!bankSigneringContract) {
    return (
      <Layout>
        <Text as="p" size="lg" align="center">
          {t('CONFIRMATION_SWITCHING_CLOSE_PAGE')}
        </Text>
      </Layout>
    )
  }

  return (
    <Layout>
      <Space y={{ base: 1.5, lg: 2 }}>
        <div>
          <Heading as="h1" variant="standard.24">
            {t('CONFIRMATION_SWITCHING_TITLE')}
          </Heading>
          <Text as="p" color="textSecondary" size="xl">
            {t('CONFIRMATION_SWITCHING_SUBTITLE', { company: bankSigneringContract.company })}
          </Text>
        </div>
        <ContractCard {...bankSigneringContract} />
      </Space>
    </Layout>
  )
}

const LoginForm = (props: { ssn?: string; onSuccess: () => void }) => {
  const { t } = useTranslation(['common', 'purchase-form', 'checkout'])
  const { startLogin } = useBankIdContext()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    datadogRum.addAction('InitiateCarCancellation Click Login')

    const formData = new FormData(event.currentTarget)
    const ssn = formData.get(SSN_FIELD_NAME)
    if (typeof ssn !== 'string') return

    startLogin({ ssn, onSuccess: props.onSuccess })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={0.25}>
        <PersonalNumberField
          name={SSN_FIELD_NAME}
          label={t('FIELD_SSN_SE_LABEL', { ns: 'purchase-form' })}
          required={true}
          defaultValue={props.ssn}
        />
        <Button type="submit" fullWidth={true}>
          {t('LOGIN_BUTTON_TEXT')}
        </Button>
      </Space>
    </form>
  )
}

const Layout = (props: { children: ReactNode }) => {
  return (
    <Space y={2}>
      <Header>
        <LogoHomeLink />
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          {props.children}
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

const Header = styled(GridLayout.Root)({
  paddingInline: theme.space.md,
  display: 'flex',
  alignItems: 'center',
  height: MENU_BAR_HEIGHT_MOBILE,

  [mq.md]: {
    paddingInline: theme.space.xl,
    gridTemplateRows: MENU_BAR_HEIGHT_DESKTOP,
  },
})
