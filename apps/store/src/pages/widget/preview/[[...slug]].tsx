import { StoryblokComponent } from '@storyblok/react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductData } from '@/components/ProductPage/ProductPage.types'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import { initializeApollo } from '@/services/apollo/client'
import {
  type WidgetFlowStory,
  type StoryblokQueryParams,
  getRevalidate,
  getStoryBySlug,
} from '@/services/storyblok/storyblok'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { useEditableStory } from '@/services/storyblok/useEditableStory'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

const EXAMPLE_PRODUCT_NAME = 'SE_APARTMENT_RENT'

type PageProps = {
  story: WidgetFlowStory
  productData: ProductData
}

const WidgetCmsPage = (props: PageProps) => {
  const story = useEditableStory(props.story)

  if (!story) return null

  return (
    <ProductDataProvider productData={props.productData}>
      <StoryblokComponent blok={story.content} />
    </ProductDataProvider>
  )
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  const { locale, params, draftMode } = context

  if (!params) throw new Error('Missing params')
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${params.slug.join('/')}`
  const version = draftMode ? 'draft' : undefined

  const [story, translations, productData] = await Promise.all([
    getStoryBySlug(slug, { version, locale }),
    serverSideTranslations(locale),
    fetchProductData({
      apolloClient: initializeApollo({ locale }),
      productName: EXAMPLE_PRODUCT_NAME,
    }),
  ])

  if (!isWidgetFlowStory(story)) throw new Error(`Invalid story type: ${story.slug}.`)

  return {
    props: { ...translations, story, productData },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  // Only used for draft mode
  return { paths: [], fallback: 'blocking' }
}

export default WidgetCmsPage
