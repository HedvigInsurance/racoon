import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { type ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { fetchBlogPageProps } from '@/features/blog/fetchBlogPageProps'
import { BlogContext, parseBlogContext } from '@/features/blog/useBlog'
import { CompanyReviewsDataProvider } from '@/features/memberReviews/CompanyReviewsDataProvider'
import { fetchProductReviewsData } from '@/features/memberReviews/memberReviews'
import type { ReviewsData } from '@/features/memberReviews/memberReviews.types'
import { initializeApollo } from '@/services/apollo/client'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { getStoryblokPageProps } from '@/services/storyblok/getStoryblokPageProps'
import {
  getFilteredPageLinks,
  getRevalidate,
  StoryblokPageProps,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type NextContentPageProps = StoryblokPageProps & {
  type: 'content'
  companyReviewsData: ReviewsData | null
}
type NextProductPageProps = ProductPageProps & { type: 'product' }

type PageProps = NextContentPageProps | NextProductPageProps

const NextCmsPage: NextPageWithLayout<PageProps> = (props) => {
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
      <CompanyReviewsDataProvider companyReviewsData={props.companyReviewsData}>
        <HeadSeoInfo
          // Gotcha:  Sometimes Storyblok returns "" for PageStory pages that doesn't get 'abTestOrigin' configured
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          story={abTestOriginStory || story}
          robots={robots}
        />
        <StoryblokComponent blok={story.content} />
        <DefaultDebugDialog />
      </CompanyReviewsDataProvider>
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
  patchNextI18nContext(context)
  const { params, locale, draftMode = false } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  const apolloClient = initializeApollo({ locale })

  try {
    const props = await getStoryblokPageProps({ context, slug, locale, draftMode })

    if (isProductStory(props.story)) {
      const priceTemplate = fetchPriceTemplate(props.story.content.priceFormTemplateId)
      if (priceTemplate === undefined) {
        throw new Error(`Unknown price template: ${props.story.content.priceFormTemplateId}`)
      }

      const productData = await fetchProductData({
        apolloClient,
        productName: props.story.content.productId,
      })

      const defaultProductVariant = props.story.content.defaultProductVariant
      const initialSelectedVariant = productData.variants.find(
        (item) => item.typeOfContract === defaultProductVariant,
      )
      const initialSelectedTypeOfContract = initialSelectedVariant?.typeOfContract

      const productReviewsData = await fetchProductReviewsData(productData.name)

      return {
        props: {
          type: 'product',
          ...props,
          [STORY_PROP_NAME]: props.story,
          productData,
          productReviewsData,
          priceTemplate,
          ...(initialSelectedTypeOfContract && { initialSelectedTypeOfContract }),
        },
        revalidate: getRevalidate(),
      }
    }

    return {
      props: {
        type: 'content',
        ...props,
        ...(await fetchBlogPageProps({ story: props.story, locale, draft: draftMode })),
        [STORY_PROP_NAME]: props.story,
      },
      revalidate: getRevalidate(),
    }
  } catch (error) {
    console.debug(error)
    console.error(error)
    return { notFound: true }
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
      return { params: { locale, slug: slugParts } }
    }),
    fallback: 'blocking',
  }
}

NextCmsPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCmsPage
