import { useStoryblokState } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { removeTrailingSlash } from 'next/dist/shared/lib/router/utils/remove-trailing-slash'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductPage } from '@/components/ProductPage/ProductPage'
import { type ProductPageProps } from '@/components/ProductPage/ProductPage.types'
import { StoryblokPage } from '@/components/StoryblokPage'
import { fetchBlogPageProps } from '@/features/blog/fetchBlogPageProps'
import { fetchProductReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { initializeApollo } from '@/services/apollo/client'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { getStoryblokPageProps } from '@/services/storyblok/getStoryblokPageProps'
import type { StoryblokPageProps, StoryblokQueryParams } from '@/services/storyblok/storyblok'
import { getFilteredPageLinks, getRevalidate } from '@/services/storyblok/storyblok'
import { MOST_VISITED_PATHS, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type NextProductPageProps = ProductPageProps & { type: 'product' }
type NextContentPageProps = StoryblokPageProps & { type: 'content' }
type PageProps = NextContentPageProps | NextProductPageProps

const NextCmsPage: NextPageWithLayout<PageProps> = (props) => {
  if (props.type === 'product') return <NextProductPage {...props} />
  return <StoryblokPage {...props} />
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
      const priceTemplate = getPriceTemplate(props.story.content.priceFormTemplateId)
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

      const productReviewsMetadata = await fetchProductReviewsMetadata(productData.name)

      return {
        props: {
          type: 'product',
          ...props,
          [STORY_PROP_NAME]: props.story,
          productData,
          productReviewsMetadata,
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
    console.error(error)
    return { notFound: true }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageLinks = await getFilteredPageLinks()
  const mostVisitedLinks = pageLinks.filter((item) =>
    MOST_VISITED_PATHS.has(`/${removeTrailingSlash(item.link.slug)}`),
  )
  return {
    paths: mostVisitedLinks.map(({ locale, slugParts }) => {
      return { params: { locale, slug: slugParts } }
    }),
    fallback: 'blocking',
  }
}

NextCmsPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCmsPage
