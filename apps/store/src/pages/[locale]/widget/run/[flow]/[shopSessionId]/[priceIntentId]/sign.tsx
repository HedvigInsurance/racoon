import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentPropsWithoutRef } from 'react'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import type { ProductData } from '@/components/ProductData/ProductData.types'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { SignPage } from '@/features/widget/SignPage'
import { fetchFlowStory } from '@/features/widget/widget.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { hideChatOnPage } from '@/services/CustomerFirst'
import { usePriceIntentQuery, useShopSessionQuery } from '@/services/graphql/generated'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = Omit<ComponentPropsWithoutRef<typeof SignPage>, 'shopSession' | 'priceIntent'> & {
  shopSessionId: string
  priceIntentId: string
  productData: ProductData
  pageTitle: string
}

const NextWidgetSignPage = (props: Props) => {
  const shopSessionResult = useShopSessionQuery({
    variables: { shopSessionId: props.shopSessionId },
  })
  const shopSession = shopSessionResult.data?.shopSession

  const priceIntentResult = usePriceIntentQuery({
    variables: { priceIntentId: props.priceIntentId },
  })
  const priceIntent = priceIntentResult.data?.priceIntent

  if (!shopSession || !priceIntent) return null

  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <ProductDataProvider productData={props.productData}>
        <TrackingProvider shopSession={shopSession} productData={props.productData}>
          <SignPage shopSession={shopSession} priceIntent={priceIntent} {...props} />
        </TrackingProvider>
      </ProductDataProvider>
    </>
  )
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
  const priceIntentService = priceIntentServiceInitServerSide({
    apolloClient,
    req: context.req,
    res: context.res,
  })

  try {
    const [translations, shopSession, story, priceIntent] = await Promise.all([
      serverSideTranslations(context.locale),
      shopSessionService.fetchById(context.params.shopSessionId),
      fetchFlowStory(context.params.flow, context.draftMode),
      priceIntentService.get(context.params.priceIntentId),
    ])

    const customer = shopSession.customer
    if (!customer) {
      throw new Error(`Widget Sign | No customer in Shop Session: ${shopSession.id}`)
    }

    if (!customer.ssn) {
      throw new Error(`Widget Sign | No SSN in Shop Session: ${shopSession.id}`)
    }

    if (!priceIntent) {
      throw new Error(`Widget Sign | No Price Intent: ${context.params.priceIntentId}`)
    }

    const productData = await fetchProductData({
      apolloClient,
      productName: priceIntent.product.name,
      partnerName: story.content.partner,
    })

    return {
      props: {
        ...translations,
        ssn: customer.ssn,
        shouldCollectEmail: getShouldCollectEmail(customer),
        shouldCollectName: getShouldCollectName(customer),
        shopSessionId: context.params.shopSessionId,
        content: story.content.checkoutPageContent,
        flow: context.params.flow,
        priceIntentId: priceIntent.id,
        // TODO: check if we want to control this via CMS
        ...hideChatOnPage(),
        productName: priceIntent.product.name,
        productData,
        pageTitle: story.content.pageTitle ?? 'Hedvig',
        showBackButton: story.content.showBackButton ?? false,
      },
    }
  } catch (error) {
    console.error('Widget Sign | Unable to render', error)
    return { notFound: true }
  }
}

export default NextWidgetSignPage
