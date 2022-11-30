import { useStoryblokState } from '@storyblok/react'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import {
  getGlobalStory,
  getProductStory,
  StoryblokPreviewData,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale, toApiLocale, toIsoLocale } from '@/utils/l10n/localeUtils'

type NextPageProps = ProductPageProps & {
  shopSessionId: string
}

type PageQueryParams = {
  product: string[]
}

const NextProductPage: NextPageWithLayout<NextPageProps> = (props) => {
  const story = useStoryblokState(props.story)

  return (
    <>
      <Head>
        <title>{story.content.name}</title>
      </Head>
      <HeadSeoInfo story={story} />
      <ProductPage {...props} story={story} />
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
    const apolloClient = initializeApollo({ req, res })

    const [shopSession, story, globalStory, translations] = await Promise.all([
      getShopSessionServerSide({ apolloClient, countryCode, locale, req, res }),
      getProductStory(slug, { locale, version }),
      getGlobalStory({ locale, version }),
      serverSideTranslations(locale),
    ])

    const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)
    if (priceTemplate === undefined) {
      logger.error(new Error(`Unknown price template: ${story.content.priceFormTemplateId}`))
      return { notFound: true }
    }

    const priceIntentService = priceIntentServiceInitServerSide({
      apolloClient,
      locale,
      shopSession,
      req,
      res,
    })
    const [productData, priceIntent] = await Promise.all([
      getProductData({
        apolloClient,
        productName: story.content.productId,
        locale: toApiLocale(locale),
      }),
      priceIntentService.fetch({
        locale: toIsoLocale(locale),
        productName: story.content.productId,
        priceTemplate,
      }),
    ])

    return {
      props: {
        ...translations,
        productData,
        priceTemplate,
        priceIntent,
        shopSession,
        [STORY_PROP_NAME]: story,
        [GLOBAL_STORY_PROP_NAME]: globalStory,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
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
