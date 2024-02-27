import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import type { ProductData } from '@/components/ProductData/ProductData.types'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { CompanyReviewsMetadataProvider } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import { fetchCompanyReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { ReviewsMetadata } from '@/features/memberReviews/memberReviews.types'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import { initializeApollo } from '@/services/apollo/client'
import {
  getRevalidate,
  getStoryBySlug,
  type StoryblokQueryParams,
  type WidgetFlowStory,
} from '@/services/storyblok/storyblok'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

const EXAMPLE_PRODUCT_NAME = 'SE_APARTMENT_RENT'

type PageProps = {
  story: WidgetFlowStory
  productData: ProductData
  companyReviewsMetadata: ReviewsMetadata | null
}

const WidgetCmsPage = (props: PageProps) => {
  const story = useStoryblokState(props.story)

  if (!story) return null

  return (
    <ProductDataProvider productData={props.productData}>
      <CompanyReviewsMetadataProvider companyReviewsMetadata={props.companyReviewsMetadata}>
        <StoryblokComponent blok={story.content} />
      </CompanyReviewsMetadataProvider>
    </ProductDataProvider>
  )
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  patchNextI18nContext(context)
  const { locale, params, draftMode } = context

  if (!params) throw new Error('Missing params')
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${params.slug.join('/')}`
  const version = draftMode ? 'draft' : undefined

  const [story, translations, productData, companyReviewsMetadata] = await Promise.all([
    getStoryBySlug(slug, { version, locale }),
    serverSideTranslations(locale),
    fetchProductData({
      apolloClient: initializeApollo({ locale }),
      productName: EXAMPLE_PRODUCT_NAME,
    }),
    fetchCompanyReviewsMetadata(),
  ])

  if (!isWidgetFlowStory(story)) throw new Error(`Invalid story type: ${story.slug}.`)

  return {
    props: { ...translations, story, productData, companyReviewsMetadata },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  // Only used for draft mode
  return { paths: [], fallback: 'blocking' }
}

export default WidgetCmsPage
