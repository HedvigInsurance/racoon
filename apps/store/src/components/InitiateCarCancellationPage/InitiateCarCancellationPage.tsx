import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useMemo, type FormEventHandler, ReactNode, useState } from 'react'
import { Button, Heading, HedvigLogo, Space, Text, mq, theme } from 'ui'
import { CardSkeleton, ContractCard } from '@/components/ConfirmationPage/ContractCard'
import { convertToBankSigneringContract } from '@/components/ConfirmationPage/useSwitchingContracts'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { useContractQuery } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { getAccessToken } from '@/services/authApi/persist'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'

const SSN_FIELD_NAME = 'ssn'

type Props = { contractId: string; ssn?: string; isAuthenticated: boolean }

export const InitiateCarCancellationPage = (props: Props) => {
  const { t } = useTranslation(['checkout', 'common'])
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return props.isAuthenticated || !!getAccessToken()
  })

  const { showError } = useAppErrorHandleContext()
  const { data, loading } = useContractQuery({
    variables: { id: props.contractId },
    skip: !isAuthenticated,
    onError: showError,
    onCompleted(data) {
      const bankSigneringContract = data.contract
        ? convertToBankSigneringContract(data.contract)
        : undefined

      if (!bankSigneringContract) {
        datadogLogs.logger.warn(
          'Rendered InitiateCarCancellationPage without BankSigneringContract',
          {
            contractId: props.contractId,
          },
        )
        showError(new Error(t('UNKNOWN_ERROR_MESSAGE')))
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

    const formData = new FormData(event.currentTarget)
    const ssn = formData.get(SSN_FIELD_NAME)
    if (typeof ssn !== 'string') return

    startLogin({ ssn, onSuccess: props.onSuccess })
  }

  return (
    <form onSubmit={handleSubmit}>
      <PersonalNumberField
        name={SSN_FIELD_NAME}
        label={t('FIELD_SSN_SE_LABEL', { ns: 'purchase-form' })}
        required={true}
        defaultValue={props.ssn}
      />
      <Button type="submit">{t('LOGIN_BUTTON_TEXT')}</Button>
    </form>
  )
}

const Layout = (props: { children: ReactNode }) => {
  return (
    <Space y={2}>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
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
