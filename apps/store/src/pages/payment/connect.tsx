import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import {
  Heading,
  Space,
  Text,
  Button,
  HedvigLogo,
  theme,
  mq,
  CheckIcon,
  WarningTriangleIcon,
} from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const LOGGER = datadogLogs.createLogger('payment-connect')

type Props = {
  trustlyUrl: string
}

const PaymentConnectPage = (props: Props) => {
  const [state, setState] = useState<'INITIAL' | 'SUCCESS' | 'FAILED'>('INITIAL')
  const { t } = useTranslation()
  const router = useRouter()

  if (state === 'SUCCESS') {
    return (
      <Layout>
        <SpaceFlex align="center" direction="vertical">
          <CheckIcon color={theme.colors.greenElement} />
          <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_SUCCESS')}</Text>
        </SpaceFlex>
      </Layout>
    )
  }

  const handleSuccess = () => {
    LOGGER.info('Payment Connect success')
    setState('SUCCESS')
  }

  const handleFail = () => {
    LOGGER.warn('Payment Connect failed')
    setState('FAILED')
  }

  const handleClickRetry = () => {
    datadogRum.addAction('Payment Connect Retry')
    router.reload()
  }

  return (
    <>
      <Layout>
        <TrustlyIframe url={props.trustlyUrl} onSuccess={handleSuccess} onFail={handleFail} />
      </Layout>

      <FullscreenDialog.Root open={state === 'FAILED'}>
        <FullscreenDialog.Modal
          center={true}
          Footer={
            <Button onClick={handleClickRetry} variant="primary">
              {t('PAYMENT_CONNECT_RETRY')}
            </Button>
          }
        >
          <SpaceFlex direction="vertical" align="center">
            <WarningTriangleIcon color={theme.colors.amberElement} />
            <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_FAILURE')}</Text>
          </SpaceFlex>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </>
  )
}

const Layout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()

  return (
    <Space y={2}>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={{ base: 2, lg: 3.5 }}>
            <Heading as="h1" variant="standard.24" align="center" balance={true}>
              {t('PAYMENT_CONNECT_TITLE')}
            </Heading>
            {children}
          </Space>
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

export const getServerSideProps: GetServerSideProps = async ({ locale, req, res }) => {
  if (!isRoutingLocale(locale)) return { notFound: true }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const [translations, trustlyUrl] = await Promise.all([
    serverSideTranslations(locale),
    createTrustlyUrl({ apolloClient, locale }),
  ])

  return {
    props: { ...translations, trustlyUrl },
  }
}

export default PaymentConnectPage
