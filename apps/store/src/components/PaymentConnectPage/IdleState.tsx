import { useApolloClient } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type NextRouter, useRouter } from 'next/router'
import { type FormEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Space, Text, theme } from 'ui'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import { createTrustlyUrl } from '@/services/trustly/createTrustlyUrl'
import { trustlyIframeStyles } from '@/services/trustly/TrustlyIframe'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { Layout } from './Layout'

type Props = {
  onCompleted: (trustlyUrl: string) => void
  onFailed: () => void
}

export const IdleState = (props: Props) => {
  const [state, setState] = useState<'idle' | 'loading'>('idle')
  const { t } = useTranslation(['common', 'checkout'])
  const router = useRouter()
  const apolloClient = useApolloClient()
  const { routingLocale } = useCurrentLocale()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setState('loading')
    datadogRum.addAction('Payment Connect Init')

    try {
      await consumeAuthorizationCode(router)
      const trustlyUrl = await createTrustlyUrl({ apolloClient, locale: routingLocale })
      props.onCompleted(trustlyUrl)
    } catch (error) {
      datadogRum.addError(error)
      props.onFailed()
    }
  }

  return (
    <Layout>
      <Space y={0.75}>
        <form onSubmit={handleSubmit}>
          <IframePlaceholder data-state={state}>
            <Button loading={state === 'loading'}>{t('PAYMENT_CONNECT_IFRAME_LOAD_BUTTON')}</Button>
          </IframePlaceholder>
        </form>
        <Text size="xs" align="center">
          {t('PAYMENT_TRUSTLY_FOOTNOTE', { ns: 'checkout' })}
        </Text>
      </Space>
    </Layout>
  )
}

const IframePlaceholder = styled.div(trustlyIframeStyles, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
  paddingInline: theme.space.xl,
})

const AUTHORIZATION_CODE_QUERY_PARAM = 'authorization_code'

const consumeAuthorizationCode = async (router: NextRouter) => {
  const authorizationCode = router.query[AUTHORIZATION_CODE_QUERY_PARAM]

  if (typeof authorizationCode === 'string') {
    const reponse = await exchangeAuthorizationCode(authorizationCode)
    saveAuthTokens(reponse)

    const target = { pathname: router.pathname, query: { ...router.query } }
    delete target.query[AUTHORIZATION_CODE_QUERY_PARAM]
    await router.replace(target, undefined, { shallow: true })
  }
}
