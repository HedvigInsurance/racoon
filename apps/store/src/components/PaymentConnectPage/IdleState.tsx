import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type NextRouter, useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { Space, Text, theme } from 'ui'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { getAccessToken, saveAuthTokens } from '@/services/authApi/persist'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { trustlyIframeBaseStyles } from '@/services/trustly/TrustlyIframe.css'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { Layout } from './Layout'

type State = 'IDLE' | 'LOADING' | 'ERROR'

type Props = {
  onCompleted: (trustlyUrl: string) => void
  onFailed: () => void
}

export const IdleState = (props: Props) => {
  const [state, setState] = useState<State>('IDLE')
  const { t } = useTranslation(['common', 'checkout'])
  const router = useRouter()
  const apolloClient = useApolloClient()
  const locale = useRoutingLocale()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogRum.addAction('Payment Connect Init')
    setState('LOADING')

    try {
      await consumeAuthorizationCode(router)
    } catch (error) {
      setState('ERROR')
      datadogLogs.logger.warn('Payment Connect link expired', { error })
      return
    }

    try {
      const trustlyUrl = await createTrustlyUrl({ apolloClient, locale })
      props.onCompleted(trustlyUrl)
    } catch (error) {
      datadogLogs.logger.warn('Payment Connect failed to create trustly url', { error })
      props.onFailed()
    }
  }

  return (
    <Layout>
      <Space y={0.75}>
        <form onSubmit={handleSubmit}>
          <IframePlaceholder className={trustlyIframeBaseStyles} data-state={state}>
            <WideSpace y={0.5}>
              <Button loading={state === 'LOADING'} disabled={state === 'ERROR'}>
                {t('FLOW_ACTIVATION_BUTTON')}
              </Button>
              {state === 'ERROR' && (
                <Text align="center">{t('PAYMENT_CONNECT_ERROR_LINK_EXPIRED')}</Text>
              )}
            </WideSpace>
          </IframePlaceholder>
        </form>
        <Text size="xs" align="center">
          {t('PAYMENT_TRUSTLY_FOOTNOTE', { ns: 'checkout' })}
        </Text>
      </Space>
    </Layout>
  )
}

export const IframePlaceholder = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'stretch',
  backgroundColor: theme.colors.white,
  paddingInline: theme.space.xl,
  height: '60vh',
})

const WideSpace = styled(Space)({ width: '100%' })

const AUTHORIZATION_CODE_QUERY_PARAM = 'authorization_code'

const consumeAuthorizationCode = async (router: NextRouter) => {
  const authorizationCode = router.query[AUTHORIZATION_CODE_QUERY_PARAM]

  if (typeof authorizationCode === 'string') {
    const reponse = await exchangeAuthorizationCode(authorizationCode)
    saveAuthTokens(reponse)

    const target = { pathname: router.pathname, query: { ...router.query } }
    delete target.query[AUTHORIZATION_CODE_QUERY_PARAM]
    await router.replace(target, undefined, { shallow: true })
  } else if (!getAccessToken()) {
    throw new Error('Missing authorization code')
  }
}
