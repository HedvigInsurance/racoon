import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { fetchBreadcrumbs } from '@/components/LayoutWithMenu/fetchBreadcrumbs'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { type ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { fetchBlogPageProps } from '@/features/blog/fetchBlogPageProps'
import { BlogContext, parseBlogContext } from '@/features/blog/useBlog'
import { initializeApollo } from '@/services/apollo/client'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import {
  getProductAverageRating,
  getProductReviewComments,
} from '@/services/productReviews/productReviews'
import {
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
  getFilteredPageLinks,
  type PageStory,
  type ProductStory,
  getRevalidate,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { useHydrateTrustpilotData } from '@/services/trustpilot/trustpilot'
import { fetchTrustpilotData } from '@/services/trustpilot/trustpilot'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextContentPageProps = StoryblokPageProps & { type: 'content' }
type NextProductPageProps = ProductPageProps & { type: 'product' }

type PageProps = NextContentPageProps | NextProductPageProps

const NextPage: NextPageWithLayout<PageProps> = (props) => {
  useHydrateTrustpilotData(props.trustpilot)

  if (props.type === 'product') return <NextProductPage {...props} />
  return <NextStoryblokPage {...props} />
}

const NextStoryblokPage = (props: NextContentPageProps) => {
  const story = useStoryblokState(props.story)
  if (!story) return null
  const abTestOriginStory = story.content.abTestOrigin
  // Always use robots value from the source page in A/B test cases
  const robots = story.content.robots

  return (
    <BlogContext.Provider value={parseBlogContext(props)}>
      <HeadSeoInfo
        // Gotcha:  Sometimes Storyblok returns "" for PageStory pages that doesn't get 'abTestOrigin' configured
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        story={abTestOriginStory || story}
        robots={robots}
      />
      <StoryblokComponent blok={story.content} />
      <DefaultDebugDialog />
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
  const { params, locale, draftMode = false } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  const apolloClient = initializeApollo({ locale })

  const timerName = `Get static props for ${locale}/${slug} ${draftMode ? '(draft)' : ''}`
  console.time(timerName)
  const version = draftMode ? 'draft' : undefined
  const [layoutWithMenuProps, breadcrumbs, trustpilot] = await Promise.all([
    getLayoutWithMenuProps(context, apolloClient),
    fetchBreadcrumbs(slug, { version, locale }),
    fetchTrustpilotData(),
  ]).catch((error) => {
    throw new Error(`Failed to fetch data for ${slug}: ${error.message}`, { cause: error })
  })

  if (layoutWithMenuProps === null) return { notFound: true }

  let story: PageStory | ProductStory
  try {
    story = await getStoryBySlug<PageStory | ProductStory>(slug, { version, locale })
  } catch (error) {
    console.info(`Story with slug ${locale}/${slug} not found`)
    console.debug(error)
    return { notFound: true }
  } finally {
    console.timeEnd(timerName)
  }

  const props = {
    ...layoutWithMenuProps,
    [STORY_PROP_NAME]: story,
    breadcrumbs,
    trustpilot,
    hideChat: story.content.hideChat ?? false,
  }

  if (isProductStory(story)) {
    const priceTemplate = fetchPriceTemplate(story.content.priceFormTemplateId)
    if (priceTemplate === undefined) {
      throw new Error(`Unknown price template: ${story.content.priceFormTemplateId}`)
    }

    const productData = await getProductData({
      apolloClient,
      productName: story.content.productId,
    })

    const defaultProductVariant = story.content.defaultProductVariant
    const initialSelectedVariant =
      productData.variants.find((item) => item.typeOfContract === defaultProductVariant) ?? null

    const averageRating = await getProductAverageRating(productData.name)
    const reviewComments = await getProductReviewComments(productData.name)

    return {
      props: {
        type: 'product',
        ...props,
        [STORY_PROP_NAME]: story,
        productData,
        averageRating,
        reviewComments,
        priceTemplate,
        initialSelectedVariant,
      },
      revalidate: getRevalidate(),
    }
  }

  return {
    props: {
      type: 'content',
      ...(await fetchBlogPageProps({ story, locale, draft: version === 'draft' })),
      ...props,
    },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (preview env) don't prerender any static pages
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    console.info('Skipping static generation...')
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
    fallback: 'blocking',
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
