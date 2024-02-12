import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import type { ProductData } from '@/components/ProductData/ProductData.types'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { fetchTrustpilotData } from '@/features/memberReviews/trustpilot'
import {
  type TrustpilotData,
  TrustpilotDataProvider,
} from '@/features/memberReviews/TrustpilotDataProvider'
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
  trustpilotData: TrustpilotData | null
}

const WidgetCmsPage = (props: PageProps) => {
  const story = useStoryblokState(props.story)

  if (!story) return null

  return (
    <ProductDataProvider productData={props.productData}>
      <TrustpilotDataProvider trustpilotData={props.trustpilotData}>
        <StoryblokComponent blok={story.content} />
      </TrustpilotDataProvider>
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

  const [story, translations, productData, trustpilotData] = await Promise.all([
    getStoryBySlug(slug, { version, locale }),
    serverSideTranslations(locale),
    fetchProductData({
      apolloClient: initializeApollo({ locale }),
      productName: EXAMPLE_PRODUCT_NAME,
    }),
    fetchTrustpilotData(locale),
  ])

  if (!isWidgetFlowStory(story)) throw new Error(`Invalid story type: ${story.slug}.`)

  return {
    props: { ...translations, story, productData, trustpilotData },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  // Only used for draft mode
  return { paths: [], fallback: 'blocking' }
}

export default WidgetCmsPage
