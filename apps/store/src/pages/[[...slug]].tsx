import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { fetchBreadcrumbs } from '@/components/LayoutWithMenu/fetchBreadcrumbs'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { type ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { fetchBlogPageProps } from '@/features/blog/fetchBlogPageProps'
import { BlogContext, parseBlogContext } from '@/features/blog/useBlog'
import { initializeApollo } from '@/services/apollo/client'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
  getFilteredPageLinks,
  type PageStory,
  type ProductStory,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextContentPageProps = StoryblokPageProps & { type: 'content' }
type NextProductPageProps = ProductPageProps & { type: 'product' }

type PageProps = NextContentPageProps | NextProductPageProps

const NextPage: NextPageWithLayout<PageProps> = (props) => {
  if (props.type === 'product') return <NextProductPage {...props} />
  return <NextStoryblokPage {...props} />
}

const NextStoryblokPage = (props: NextContentPageProps) => {
  const story = useStoryblokState(props.story)
  if (!story) return null
  const abTestOriginStory = story.content.abTestOrigin

  return (
    <BlogContext.Provider value={parseBlogContext(props)}>
      <HeadSeoInfo story={abTestOriginStory || story} canonicalUrl={abTestOriginStory?.full_slug} />
      <StoryblokComponent blok={story.content} />
    </BlogContext.Provider>
  )
}

const NextProductPage = (props: ProductPageProps) => {
  const { story: initialStory, ...pageProps } = props
  const story = useStoryblokState(initialStory)
  if (!story) return null

  return (
    <>
      <HeadSeoInfo story={story} />
      <ProductPage {...pageProps} story={story} />
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  const { params, locale, draftMode } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  const apolloClient = initializeApollo({ locale })

  console.time('getStoryblokData')
  const version = draftMode ? 'draft' : 'published'
  const [story, globalStory, translations, productMetadata, breadcrumbs] = await Promise.all([
    getStoryBySlug<PageStory | ProductStory>(slug, { version, locale }),
    getGlobalStory({ version, locale }),
    serverSideTranslations(locale),
    fetchGlobalProductMetadata({ apolloClient }),
    fetchBreadcrumbs(slug, { version, locale }),
  ])
  console.timeEnd('getStoryblokData')

  const props = {
    ...translations,
    [STORY_PROP_NAME]: story,
    [GLOBAL_STORY_PROP_NAME]: globalStory,
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
    breadcrumbs,
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

  return {
    props: {
      type: 'content',
      ...(await fetchBlogPageProps({ story, locale, draft: version === 'draft' })),
      ...props,
    },
    revalidate,
  }
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

  const pageLinks = await getFilteredPageLinks()

  return {
    paths: pageLinks.map(({ locale, slugParts }) => {
      return { params: { slug: slugParts }, locale }
    }),
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
