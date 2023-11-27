import { ApolloClient } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { ComponentPropsWithoutRef } from 'react'
import { CalculatePricePage } from '@/features/widget/CalculatePricePage'
import { fetchFlowStory, getPriceTemplate } from '@/features/widget/widget.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { addApolloState } from '@/services/apollo/client'
import {
  WidgetPriceIntentDocument,
  type WidgetPriceIntentQuery,
  useShopSessionQuery,
  useWidgetPriceIntentQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = Pick<ComponentPropsWithoutRef<typeof CalculatePricePage>, 'flow' | 'priceTemplate'> & {
  priceIntentId: string
  shopSessionId: string
}

type Params = {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
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

    const compareInsurance = story.content.compareInsurance ?? false
    const priceTemplate = getPriceTemplate(priceIntent.product.name, compareInsurance)

    console.info(`Widget | Calculate Price: ${priceIntent.product.name}/${priceTemplate.name}`)
    console.info(`Widget | Compare insurance: ${compareInsurance}`)

    return addApolloState(apolloClient, {
      props: {
        priceIntent,
        priceTemplate,
        ...translations,
        ...context.params,
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
      <TrackingProvider shopSession={shopSession}>
        <CalculatePricePage {...props} shopSession={shopSession} priceIntent={priceIntent} />
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
