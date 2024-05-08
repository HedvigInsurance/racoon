import * as process from 'process'
import type { ISbStoriesParams, ISbStoryData, SbBlokData, StoryblokClient } from '@storyblok/react'
import { apiPlugin, getStoryblokApi, storyblokInit } from '@storyblok/react'
import type { FooterBlockProps } from '@/blocks/FooterBlock'
import type { HeaderBlockProps } from '@/blocks/HeaderBlock'
import type { ReusableBlockReferenceProps } from '@/blocks/ReusableBlockReference'
import { type ContentAlignment, type ContentWidth } from '@/components/GridLayout/GridLayout.helper'
import type { BreadcrumbListItem } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { BLOG_ARTICLE_CONTENT_TYPE } from '@/features/blog/blog.constants'
import type { LinkData, PageLink } from '@/services/storyblok/Storyblok.helpers'
import { isBrowser } from '@/utils/env'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { Language } from '@/utils/l10n/types'
import type { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from './Storyblok.constant'
import { LINKS_EXCLUDE_PATHS } from './Storyblok.constant'
import { storyblokComponents } from './storyblokComponents'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
  nested?: boolean
}

export type ExpectedBlockType<T> = [T] extends [{ blok: SbBlokData }]
  ? Array<T['blok']>
  : `ExpectedBlock expects an argument which extends SbBlockData.
     These are likely the props of the block you are looking to render`

export type StoryblokQueryParams = {
  slug: Array<string>
  locale: string
}

export type StoryblokPageProps = {
  [STORY_PROP_NAME]: PageStory
  [GLOBAL_STORY_PROP_NAME]: GlobalStory
  breadcrumbs: Array<BreadcrumbListItem> | null
}

export type StoryblokVersion = 'draft' | 'published'

export type GridColumnsField = {
  widths: ContentWidth
  alignment: ContentAlignment
}

export type StoryblokAsset = {
  alt: string
  copyright: string
  fieldtype: 'asset'
  filename: string
  focus: string
  id: number
  is_external_url: boolean
  name: string
  title: string
}

export type LinkField = {
  id: string
  url: string
  linktype: 'multilink' | 'story' | 'url'
  target?: string
  rel?: string
  anchor?: string
  cached_url: string
  title?: string
  story?: {
    id: number
    uuid: string
    name: string
    slug: string
    // Same as "full_slug" by default.
    // Can be overridden in Storyblok editor: "Entry configuration" > "Real path".
    url: string
    full_slug: string
  }
}

export type StoryblokTableField = {
  thead: Array<StoryblokTableCell>
  tbody: Array<StoryblokTableRow>
}

type StoryblokTableCell = {
  _uid: string
  value: string
}

type StoryblokTableRow = {
  _uid: string
  body: Array<StoryblokTableCell>
}

export type SEOData = {
  robots: 'index' | 'noindex'
  seoTitle?: string
  seoMetaDescription?: string
  seoMetaOgImage?: StoryblokAsset
  abTestOrigin?: PageStory
  canonicalUrl?: string
}

export type PageStory = ISbStoryData<
  {
    announcement?: ExpectedBlockType<ReusableBlockReferenceProps>
    body: Array<SbBlokData>
    overlayMenu?: boolean
    darkBackground?: boolean
    hideBreadcrumbs?: boolean
    hideChat?: boolean
  } & SEOData
>

export type ProductStory = ISbStoryData<
  {
    name?: string
    description?: string
    tagline?: string
    defaultProductVariant?: string
    productId: string
    priceFormTemplateId: string
    announcement?: ExpectedBlockType<ReusableBlockReferenceProps>
    body: Array<SbBlokData>
    globalStory: GlobalStory
    hideChat?: boolean
    showAverageRating?: boolean
    overviewLabel: string
    coverageLabel: string
    overview: Array<SbBlokData>
    coverage: Array<SbBlokData>
  } & SEOData
>

export type WidgetFlowStory = ISbStoryData<{
  partner: string
  products?: Array<string>
  backToAppButtonLabel?: string
  campaignCode?: string
  compareInsurance?: boolean
  showRecommendations?: boolean
  checkoutPageContent?: Array<SbBlokData>
  pageTitle?: string
  showBackButton?: boolean
}>

export type GlobalStory = ISbStoryData & {
  content: ISbStoryData['content'] & {
    header: ExpectedBlockType<HeaderBlockProps>
    footer: ExpectedBlockType<FooterBlockProps>
  }
}

export type ReusableStory = ISbStoryData & {
  content: ISbStoryData['content'] & {
    body: Array<SbBlokData>
  }
}

export type ConfirmationStory = ISbStoryData & {
  content: ISbStoryData['content'] & {
    body?: Array<SbBlokData>
    title: string
    checklistTitle: string
    checklistSubtitle: string
    checklist: string
    footerImage: StoryblokAsset
    seoTitle: string
  }
}

export const initStoryblok = () => {
  // https://github.com/storyblok/storyblok-react/issues/156#issuecomment-1197764828
  let shouldUseBridge = false
  if (isBrowser()) {
    shouldUseBridge = new URLSearchParams(window.location.search).has('_storyblok')
    if (shouldUseBridge) {
      console.log('Using Storyblok editor bridge')
    }
  }
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    apiOptions: {
      // ~290ms -> ~15ms for subsequent page renders locally
      // Does not work on Vercel due to never sharing memory between requests.  We're using cv there
      //
      cache: {
        type: 'memory',
        clear: 'auto',
      },
    },
    use: [apiPlugin],
    bridge: shouldUseBridge,
    components: storyblokComponents,
  })
}

export type StoryOptions = {
  locale: string
  version?: StoryblokVersion
}

export const getStoryBySlug = <StoryData extends ISbStoryData>(
  slug: string,
  { version, locale }: StoryOptions,
): Promise<StoryData> => {
  return fetchStory<StoryData>(getStoryblokApi(), `${locale}/${slug}`, {
    version,
    resolve_relations: `reusableBlockReference.reference,${BLOG_ARTICLE_CONTENT_TYPE}.categories,page.abTestOrigin`,
  })
}

type GetStoryByIdParams = {
  id: string
  version?: StoryblokVersion
  resolve_relations?: string
}

export const getStoryById = <StoryData extends ISbStoryData>(
  params: GetStoryByIdParams,
): Promise<StoryData> => {
  return fetchStory<StoryData>(getStoryblokApi(), params.id, params)
}

type GetPageLinksParams = {
  startsWith?: string
}

export const getPageLinks = async (params?: GetPageLinksParams): Promise<Array<PageLink>> => {
  const storyblokApi = getStoryblokApi()
  const {
    data: { links },
  } = await storyblokApi.get(
    'cdn/links/',
    storyblokParams({ ...(params?.startsWith && { starts_with: params.startsWith }) }),
  )
  const pageLinks: Array<PageLink> = []
  Object.values(links as Record<string, LinkData>).forEach((link) => {
    if (link.is_folder) {
      return
    }
    const [locale, ...slugParts] = link.slug.split('/')
    if (!isRoutingLocale(locale)) return

    if (slugParts[0] === 'global') return
    pageLinks.push({
      link,
      locale,
      slugParts,
    })
  })
  return pageLinks
}

export const getFilteredPageLinks = async (params?: GetPageLinksParams) => {
  const allLinks = await getPageLinks(params)
  return allLinks.filter(({ slugParts }) => !LINKS_EXCLUDE_PATHS.has(slugParts[0]))
}

export const getGlobalStory = (options: StoryOptions): Promise<GlobalStory> => {
  return getStoryBySlug<GlobalStory>('global', options)
}

export const getStoriesBySlug = async (
  slugs: Array<string>,
  options: Pick<StoryOptions, 'version'>,
) => {
  const response = await getStoryblokApi().getStories(
    storyblokParams({ ...options, by_slugs: slugs.join(',') }),
  )

  return response.data.stories
}

export const fetchStories = async (params: ISbStoriesParams) => {
  return getStoryblokApi().getStories(storyblokParams(params))
}

// See https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation
export const getRevalidate = () => {
  if (process.env.VERCEL_ENV === 'production') {
    return false
  } else {
    return 1
  }
}

export type StoryblokFetchParams = {
  version?: StoryblokVersion
  language?: Language
  resolve_relations?: string
}

export const fetchStory = async <StoryData extends ISbStoryData>(
  storyblokClient: StoryblokClient,
  slug: string,
  params: StoryblokFetchParams,
): Promise<StoryData> => {
  const response = await storyblokClient.getStory(
    slug,
    storyblokParams({ ...params, resolve_links: 'url' }),
  )
  return response.data.story as StoryData
}

const USE_DRAFT_CONTENT = process.env.NEXT_PUBLIC_STORYBLOK_DRAFT_CONTENT === 'true'
const storyblokParams = (params: ISbStoriesParams): ISbStoriesParams => {
  const version = params.version ?? (USE_DRAFT_CONTENT ? 'draft' : 'published')
  return {
    ...params,
    version,
    ...(version === 'published' && { cv: getCacheVersion() }),
  }
}

const STORYBLOK_CACHE_VERSION = process.env.STORYBLOK_CACHE_VERSION
const getCacheVersion = (): number | undefined => {
  const cacheVersion = STORYBLOK_CACHE_VERSION ? parseInt(STORYBLOK_CACHE_VERSION) : NaN
  const isCacheVersionValid = !isNaN(cacheVersion)
  return isCacheVersionValid ? cacheVersion : undefined
}
