import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { getCountryByLocale } from '@/lib/l10n/countryUtils'
import { isRoutingLocale } from '@/lib/l10n/localeUtils'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { fetchPriceTemplate } from '@/services/PriceForm/PriceForm.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import {
  getGlobalStory,
  getProductStory,
  StoryblokPreviewData,
} from '@/services/storyblok/storyblok'

type NextPageProps = ProductPageProps & {
  shopSessionId: string
}

type PageQueryParams = {
  product: string[]
}

const NextProductPage: NextPageWithLayout<NextPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.story.content.name}</title>
      </Head>
      <ProductPage {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  NextPageProps,
  PageQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const {
    locale,
    req,
    res,
    params: { product: slug } = {},
    previewData: { version } = {},
  } = context

  if (!isRoutingLocale(locale)) return { notFound: true }
  if (typeof slug !== 'string') return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  try {
    const apolloClient = initializeApollo(undefined, req, res)

    const [shopSession, story, globalStory] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getProductStory(slug, { locale, version }),
      getGlobalStory({ locale, version }),
    ])

    const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)
    if (priceTemplate === undefined) {
      logger.error(new Error(`Unknown price template: ${story.content.priceFormTemplateId}`))
      return { notFound: true }
    }

    const priceIntentService = priceIntentServiceInitServerSide({
      req,
      res,
      shopSession,
      apolloClient,
    })
    const priceIntent = await priceIntentService.fetch({
      productName: story.content.productId,
      priceTemplate,
    })

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        story,
        globalStory,
        priceTemplate,
        priceIntent,
        shopSessionId: shopSession.id,
        shopSession,
        [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
      },
    }
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
