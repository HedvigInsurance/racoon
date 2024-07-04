import { type ApolloClient } from '@apollo/client'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { type ProductData } from '@/components/ProductData/ProductData.types'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { CalculatePricePage } from '@/features/widget/CalculatePricePage'
import { fetchFlowStory, getWidgetPriceTemplate } from '@/features/widget/widget.helpers'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { hideChatOnPage } from '@/services/CustomerFirst'
import {
  useShopSessionQuery,
  useWidgetPriceIntentQuery,
  WidgetPriceIntentDocument,
  type WidgetPriceIntentQuery,
} from '@/services/graphql/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSessionProvider, useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = Pick<
  ComponentPropsWithoutRef<typeof CalculatePricePage>,
  'flow' | 'priceTemplate' | 'showBackButton'
> & {
  priceIntentId: string
  shopSessionId: string
  partner?: string
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
    const [
      translations,
      priceIntent,
      story,
      // Only loading for hydrating client-side apollo cache
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      shopSession,
    ] = await Promise.all([
      serverSideTranslations(context.locale),
      fetchWidgetPriceIntent(apolloClient, context.params.priceIntentId),
      fetchFlowStory(context.params.flow, context.draftMode),
      shopSessionService.fetchById(context.params.shopSessionId),
    ])

    const compareInsurance = story.content.compareInsurance ?? false
    const partner = story.content.partner
    const priceTemplate = getWidgetPriceTemplate(priceIntent.product.name, compareInsurance)

    console.info(`Widget | Calculate Price: ${priceIntent.product.name}/${priceTemplate.name}`)
    console.info(`Widget | Compare insurance: ${compareInsurance}`)

    return addApolloState(apolloClient, {
      props: {
        priceIntent,
        priceTemplate,
        partner,
        ...hideChatOnPage(),
        ...translations,
        ...context.params,
        showBackButton: story.content.showBackButton ?? false,
        [SHOP_SESSION_PROP_NAME]: context.params.shopSessionId,
      },
    })
  } catch (error) {
    console.error('Widget Calculate Price | Unable to render', error)
    return { notFound: true }
  }
}

export default function Page({ partner, shopSessionId, priceIntentId, ...forwardedProps }: Props) {
  const { t } = useTranslation('widget')

  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  const priceIntentResult = useWidgetPriceIntentQuery({
    variables: { priceIntentId },
  })
  const priceIntent = priceIntentResult.data?.priceIntent

  if (shopSession == null || priceIntent == null) return null

  // Does not have variants and some CMS fields, but we're not currently using them in widget flow components
  const productData = priceIntent.product as ProductData

  return (
    <>
      <Head>
        <title>{`Hedvig | ${t('CALCULATE_PRICE_PAGE_TITLE')}`}</title>
      </Head>
      <ShopSessionProvider shopSessionId={shopSession.id}>
        <TrackingProvider shopSessionId={shopSessionId} priceIntent={priceIntent} partner={partner}>
          <ProductDataProvider productData={productData}>
            <ShopSessionLoader>
              <CalculatePricePage {...forwardedProps} priceIntentId={priceIntentId} />
            </ShopSessionLoader>
          </ProductDataProvider>
        </TrackingProvider>
      </ShopSessionProvider>
    </>
  )
}

// Poor man's Suspense for loading shopSession
// Data is ready on first client-side render, but it's missing on server render
// TODO: Use normal Suspense when we use app router for widget flows
function ShopSessionLoader({ children }: { children: ReactNode }) {
  const shopSessionId = useShopSessionId()
  if (shopSessionId == null) {
    return null
  }
  return children
}

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
