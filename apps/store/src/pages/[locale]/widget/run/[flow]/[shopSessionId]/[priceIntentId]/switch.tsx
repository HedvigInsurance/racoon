import type { ApolloClient } from '@apollo/client'
import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentPropsWithoutRef } from 'react'
import { SwitchPage } from '@/features/widget/SwitchPage'
import { fetchFlowStory } from '@/features/widget/widget.helpers'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { hideChatOnPage } from '@/services/CustomerFirst'
import {
  useShopSessionQuery,
  useWidgetPriceIntentQuery,
  WidgetPriceIntentDocument,
  type WidgetPriceIntentQuery,
} from '@/services/graphql/generated'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = Pick<ComponentPropsWithoutRef<typeof SwitchPage>, 'flow' | 'showBackButton'> & {
  priceIntentId: string
  shopSessionId: string
}

type Params = {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const apolloClient = await initializeApolloServerSide({
    req: context.req,
    res: context.res,
    locale: context.locale,
  })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })

  try {
    const [translations, priceIntent, story] = await Promise.all([
      serverSideTranslations(context.locale),
      fetchWidgetPriceIntent(apolloClient, context.params.priceIntentId),
      fetchFlowStory(context.params.flow, context.draftMode),
      shopSessionService.fetchById(context.params.shopSessionId),
    ])

    return addApolloState(apolloClient, {
      props: {
        priceIntent,
        ...hideChatOnPage(),
        ...translations,
        ...context.params,
        showBackButton: story.content.showBackButton ?? false,
      },
    })
  } catch (error) {
    console.error('Widget Calculate Price | Unable to render', error)
    return { notFound: true }
  }
}

const Page = (props: Props) => {
  const { t } = useTranslation('widget')

  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId: props.shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  const priceIntentResult = useWidgetPriceIntentQuery({
    variables: { priceIntentId: props.priceIntentId },
  })
  const priceIntent = priceIntentResult.data?.priceIntent

  // TODO: Handle loading state
  if (!shopSession || !priceIntent) return null

  return (
    <>
      <Head>
        <title>{`Hedvig | ${t('CALCULATE_PRICE_PAGE_TITLE')}`}</title>
      </Head>
      <TrackingProvider shopSessionId={props.shopSessionId} priceIntent={priceIntent}>
        <SwitchPage {...props} shopSession={shopSession} priceIntent={priceIntent} />
      </TrackingProvider>
    </>
  )
}

export default Page

const fetchWidgetPriceIntent = async (
  apolloClient: ApolloClient<unknown>,
  priceIntentId: string,
) => {
  const { data } = await apolloClient.query<WidgetPriceIntentQuery>({
    query: WidgetPriceIntentDocument,
    variables: { priceIntentId },
  })

  return data.priceIntent
}
