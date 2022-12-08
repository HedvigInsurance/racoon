import { useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { usePriceIntent } from '@/components/ProductPage/usePriceIntent'
import { initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import {
  getFilteredProductLinks,
  getGlobalStory,
  getProductStory,
  StoryblokPreviewData,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale, toApiLocale } from '@/utils/l10n/localeUtils'

type NextPageProps = Omit<ProductPageProps, 'shopSession' | 'priceIntent'>

type PageQueryParams = {
  product: string[]
}

const NextProductPage: NextPageWithLayout<NextPageProps> = (props) => {
  const story = useStoryblokState(props.story)
  const { shopSession } = useShopSession()
  const { data: { priceIntent } = {} } = usePriceIntent({
    shopSession,
    priceTemplate: props.priceTemplate,
    productName: props.story.content.productId,
  })

  return (
    <>
      <Head>
        <title>{story.content.name}</title>
      </Head>
      <HeadSeoInfo story={story} />
      {/* @TODO: handle product page without dynamic data available */}
      {shopSession && priceIntent && (
        <ProductPage {...props} story={story} shopSession={shopSession} priceIntent={priceIntent} />
      )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (preview env) don't prerender any static pages
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    logger.info('Skipping static generation for product pages...')
    return { paths: [], fallback: 'blocking' }
  }

  const pageLinks = await getFilteredProductLinks()
  return {
    paths: pageLinks.map(({ locale, slugParts }) => {
      const lastSlugPart = slugParts[slugParts.length - 1]
      return { params: { product: lastSlugPart }, locale }
    }),
    fallback: false,
  }
}

type ProductPageGetStaticProps = GetStaticProps<
  NextPageProps,
  PageQueryParams,
  StoryblokPreviewData
>
export const getStaticProps: ProductPageGetStaticProps = async (context) => {
  const { locale, params: { product: slug } = {}, previewData: { version } = {} } = context

  if (!isRoutingLocale(locale)) return { notFound: true }
  if (typeof slug !== 'string') return { notFound: true }

  const [story, globalStory, translations] = await Promise.all([
    getProductStory(slug, { locale, version }),
    getGlobalStory({ locale, version }),
    serverSideTranslations(locale),
  ])

  const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)

  if (priceTemplate === undefined) {
    logger.error(new Error(`Unknown price template: ${story.content.priceFormTemplateId}`))
    return { notFound: true }
  }

  const productData = await getProductData({
    apolloClient: initializeApollo(),
    productName: story.content.productId,
    locale: toApiLocale(locale),
  })

  return {
    props: {
      ...translations,
      [STORY_PROP_NAME]: story,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
      productData,
      priceTemplate,
    },
    revalidate: process.env.VERCEL_ENV === 'preview' ? 1 : false,
  }
}

NextProductPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextProductPage
