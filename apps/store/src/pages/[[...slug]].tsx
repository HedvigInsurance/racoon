import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { initializeApollo } from '@/services/apollo/client'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
  getFilteredPageLinks,
  StoryblokPreviewData,
  PageStory,
  ProductStory,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { isDisabledPetLink } from '@/utils/isDisabledPetLink'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextContentPageProps = StoryblokPageProps & { type: 'content' }
type NextProductPageProps = ProductPageProps & { type: 'product' }

type PageProps = NextContentPageProps | NextProductPageProps

const NextPage: NextPageWithLayout<PageProps> = (props) => {
  if (props.type === 'product') return <NextProductPage {...props} />
  return <NextStoryblokPage {...props} />
}

const NextStoryblokPage = ({ story: initialStory }: StoryblokPageProps) => {
  const story = useStoryblokState(initialStory)

  return (
    <>
      <HeadSeoInfo story={story} />
      <StoryblokComponent blok={story.content} />
    </>
  )
}

const NextProductPage = (props: ProductPageProps) => {
  const { story: initialStory, ...pageProps } = props
  const story = useStoryblokState(initialStory)

  return (
    <>
      <HeadSeoInfo story={story} />
      <ProductPage {...pageProps} story={story} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { params, locale, previewData: { version } = {} } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  if (isDisabledPetLink(`${locale}/${slug}`)) {
    return { notFound: true }
  }

  const apolloClient = initializeApollo({ locale })
  console.time('getStoryblokData')
  const [story, globalStory, translations, productMetadata] = await Promise.all([
    getStoryBySlug<PageStory | ProductStory>(slug, { version, locale }),
    getGlobalStory({ version, locale }),
    serverSideTranslations(locale),
    fetchGlobalProductMetadata({ apolloClient }),
  ])
  console.timeEnd('getStoryblokData')

  if (story === undefined) {
    console.warn(`Page not found: ${slug}, locale: ${locale}`)
    return { notFound: true }
  }

  const props = {
    ...translations,
    [STORY_PROP_NAME]: story,
    [GLOBAL_STORY_PROP_NAME]: globalStory,
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
  }
  const revalidate = process.env.VERCEL_ENV === 'preview' ? 1 : false

  if (isProductStory(story)) {
    const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)
    if (priceTemplate === undefined) {
      throw new Error(`Unknown price template: ${story.content.priceFormTemplateId}`)
    }

    const productData = await getProductData({
      apolloClient,
      productName: story.content.productId,
    })

    const initialSelectedVariant =
      productData.variants.find(
        (variant) => variant.typeOfContract === story.content.defaultProductVariant,
      ) ?? null

    return {
      props: {
        type: 'product',
        ...props,
        [STORY_PROP_NAME]: story,
        productData,
        priceTemplate,
        initialSelectedVariant,
      },
      revalidate,
    }
  }

  return { props: { type: 'content', ...props }, revalidate }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (preview env) don't prerender any static pages
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    console.log('Skipping static generation...')
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const pageLinks = (await getFilteredPageLinks()).filter(
    (pageLink) => !isDisabledPetLink(pageLink.link.slug),
  )

  return {
    paths: pageLinks.map(({ locale, slugParts }) => {
      return { params: { slug: slugParts }, locale }
    }),
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
