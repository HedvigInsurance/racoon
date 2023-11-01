import * as process from 'process'
import {
  apiPlugin,
  getStoryblokApi,
  SbBlokData,
  storyblokInit,
  ISbStoryData,
  ISbStoriesParams,
} from '@storyblok/react'
import { AccordionBlock } from '@/blocks/AccordionBlock'
import { AccordionItemBlock } from '@/blocks/AccordionItemBlock'
import { AnnouncementBlock } from '@/blocks/AnnouncementBlock'
import { BannerBlock } from '@/blocks/BannerBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { CardLinkBlock } from '@/blocks/CardLinkBlock'
import { CardLinkListBlock } from '@/blocks/CardLinkListBlock'
import { CheckListBlock } from '@/blocks/CheckListBlock'
import { ComparisonTableBlock } from '@/blocks/ComparisonTableBlock'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { ContactSupportBlock } from '@/blocks/ContactSupportBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { CookieListBlock } from '@/blocks/CookieListBlock'
import { DownloadableContentItemBlock } from '@/blocks/DownloadableContentItemBlock'
import { FooterBlock, FooterBlockProps, FooterLink, FooterSection } from '@/blocks/FooterBlock'
import { GridBlock } from '@/blocks/GridBlock'
import {
  HeaderBlock,
  HeaderBlockProps,
  NavItemBlock,
  NestedNavContainerBlock,
  ProductNavContainerBlock,
} from '@/blocks/HeaderBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeadingLabelBlock } from '@/blocks/HeadingLabelBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { HeroVideoBlock } from '@/blocks/HeroVideoBlock'
import { HeroVideoVimeoBlock } from '@/blocks/HeroVideoVimeoBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { ImageTextBlock } from '@/blocks/ImageTextBlock'
import { InlineSpaceBlock } from '@/blocks/InlineSpaceBlock'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { InsurelyBlock } from '@/blocks/InsurelyBlock'
import { MediaListBlock } from '@/blocks/MediaListBlock'
import { ModalBlock } from '@/blocks/ModalBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { ProductAverageRatingBlock } from '@/blocks/ProductAverageRatingBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductDocumentsBlock } from '@/blocks/ProductDocumentsBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductPageBlock } from '@/blocks/ProductPageBlock'
import { ProductPillowBlock } from '@/blocks/ProductPillowsBlock/ProductPillowBlock'
import { ProductPillowsBlock } from '@/blocks/ProductPillowsBlock/ProductPillowsBlock'
import { ProductReviewCommentsBlock } from '@/blocks/ProductReviewCommentsBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ProductVariantSelectorBlock } from '@/blocks/ProductVariantSelectorBlock'
import { QuickPurchaseBlock } from '@/blocks/QuickPurchaseBlock'
import {
  ReusableBlockReference,
  ReusableBlockReferenceProps,
} from '@/blocks/ReusableBlockReference'
import { RichTextBlock } from '@/blocks/RichTextBlock/RichTextBlock'
import { SelectInsuranceGridBlock } from '@/blocks/SelectInsuranceGridBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { TabsBlock } from '@/blocks/TabsBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { TextContentBlock } from '@/blocks/TextContentBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { TimelineItemBlock } from '@/blocks/TimelineItemBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'
import { TrustpilotBlock } from '@/blocks/TrustpilotBlock'
import { TrustpilotReviewsBlock } from '@/blocks/TrustpilotReviewsBlock'
import { USPBlock, USPBlockItem } from '@/blocks/USPBlock'
import { VideoBlock } from '@/blocks/VideoBlock'
import { VideoListBlock } from '@/blocks/VideoListBlock'
import { WidgetFlowBlock } from '@/blocks/WidgetFlowBlock'
import { type ContentWidth, type ContentAlignment } from '@/components/GridLayout/GridLayout.helper'
import { BLOG_ARTICLE_CONTENT_TYPE } from '@/features/blog/blog.constants'
import { blogBlocks } from '@/features/blog/blogBlocks'
// TODO: get rid of this import, services should avoid feature-imports
import { carDealershipBlocks } from '@/features/carDealership/carDealershipBlocks'
import { STORYBLOK_MANYPETS_FOLDER_SLUG } from '@/features/manyPets/manyPets.constants'
import { manyPetsBlocks } from '@/features/manyPets/manyPetsBlocks'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import { TrustpilotData } from '@/services/trustpilot/trustpilot.types'
import { isBrowser } from '@/utils/env'
import { Features } from '@/utils/Features'
import { getLocaleOrFallback, isRoutingLocale } from '@/utils/l10n/localeUtils'
import { Language, RoutingLocale } from '@/utils/l10n/types'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from './Storyblok.constant'
import { fetchStory, StoryblokFetchParams } from './Storyblok.helpers'

const USE_DRAFT_CONTENT = process.env.NEXT_PUBLIC_STORYBLOK_DRAFT_CONTENT === 'true'

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
}

export type StoryblokPageProps = {
  [STORY_PROP_NAME]: PageStory
  [GLOBAL_STORY_PROP_NAME]: GlobalStory
  trustpilot: TrustpilotData | null
  hideChat?: boolean
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
    hideMenu?: boolean
    overlayMenu?: boolean
    hideFooter?: boolean
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
    body: Array<SbBlokData>
    title: string
    checklistTitle: string
    checklistSubtitle: string
    checklist: string
    footerImage: StoryblokAsset
    seoTitle: string
  }
}

type LinkData = Pick<
  ISbStoryData,
  'id' | 'slug' | 'name' | 'parent_id' | 'position' | 'uuid' | 'is_startpage'
> & { is_folder: boolean; path: string; published: boolean; real_path: string }

type PageLink = {
  link: LinkData
  locale: RoutingLocale
  slugParts: Array<string>
}

type NamedBlock = {
  blockName: string
} & React.ElementType

export const initStoryblok = () => {
  const blockComponents: Array<NamedBlock> = [
    AccordionBlock,
    AccordionItemBlock,
    AnnouncementBlock,
    ProductAverageRatingBlock,
    BannerBlock,
    ButtonBlock,
    CheckListBlock,
    ContactSupportBlock,
    ContentBlock,
    ConfirmationPageBlock,
    DownloadableContentItemBlock,
    FooterBlock,
    FooterLink,
    FooterSection,
    ReusableBlockReference,
    // TODO: Header vs Heading is easy to confuse.  Discuss with team if we should rename one of these
    GridBlock,
    HeaderBlock,
    HeadingBlock,
    HeadingLabelBlock,
    HeroBlock,
    HeroVideoBlock,
    HeroVideoVimeoBlock,
    ImageBlock,
    ImageTextBlock,
    InlineSpaceBlock,
    InsurableLimitsBlock,
    CookieListBlock,
    MediaListBlock,
    ModalBlock,
    NavItemBlock,
    NestedNavContainerBlock,
    PageBlock,
    PerilsBlock,
    ProductPageBlock,
    ProductCardBlock,
    ProductDocumentsBlock,
    ProductGridBlock,
    ProductPillowBlock,
    ProductPillowsBlock,
    ProductReviewCommentsBlock,
    ProductSlideshowBlock,
    ProductVariantSelectorBlock,
    RichTextBlock,
    SpacerBlock,
    TabsBlock,
    TimelineBlock,
    TimelineItemBlock,
    TextBlock,
    TextContentBlock,
    TopPickCardBlock,
    TrustpilotBlock,
    TrustpilotReviewsBlock,
    VideoBlock,
    VideoListBlock,
    WidgetFlowBlock,
    ProductNavContainerBlock,
    USPBlock,
    USPBlockItem,
    CardLinkBlock,
    CardLinkListBlock,
    SelectInsuranceGridBlock,
    QuickPurchaseBlock,
    ComparisonTableBlock,
    InsurelyBlock,
    ...blogBlocks,
    ...manyPetsBlocks,
    ...carDealershipBlocks,
  ]
  const blockAliases = { reusableBlock: PageBlock }
  const components = {
    ...Object.fromEntries(
      blockComponents.map((blockComponent) => [blockComponent.blockName, blockComponent]),
    ),
    ...blockAliases,
  }

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
    components,
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
  const params: StoryblokFetchParams = {
    version: version ?? (USE_DRAFT_CONTENT ? 'draft' : 'published'),
    resolve_relations: `reusableBlockReference.reference,${BLOG_ARTICLE_CONTENT_TYPE}.categories,page.abTestOrigin`,
  }

  return fetchStory<StoryData>(getStoryblokApi(), `${locale}/${slug}`, params)
}

export const getPageLinks = async (): Promise<Array<PageLink>> => {
  const storyblokApi = getStoryblokApi()
  const {
    data: { links },
  } = await storyblokApi.get('cdn/links/', {
    ...(USE_DRAFT_CONTENT && { version: 'draft' }),
  })
  const pageLinks: Array<PageLink> = []
  Object.values(links as Record<string, LinkData>).forEach((link) => {
    if (link.is_folder) {
      return
    }
    const [locale, ...slugParts] = link.slug.split('/')
    if (!isRoutingLocale(locale)) return

    const { language } = getLocaleOrFallback(locale)
    if (language === Language.En && !Features.enabled('ENGLISH_LANGUAGE')) return

    if (slugParts[0] === 'global') return
    pageLinks.push({
      link,
      locale,
      slugParts,
    })
  })
  return pageLinks
}

const EXCLUDE_SLUGS = new Set([
  'reusable-blocks',
  'product-metadata',
  STORYBLOK_MANYPETS_FOLDER_SLUG,
  STORYBLOK_WIDGET_FOLDER_SLUG,
])
// TODO: Consider filtering by content-type on CMS side to exclude things like reusable-blocks
export const getFilteredPageLinks = async () => {
  const allLinks = await getPageLinks()
  return allLinks.filter(({ slugParts }) => EXCLUDE_SLUGS.has(slugParts[0]) === false)
}

export const getGlobalStory = (options: StoryOptions): Promise<GlobalStory> => {
  return getStoryBySlug<GlobalStory>('global', options)
}

const PRODUCTS_SLUG = 'products'
export const getFilteredProductLinks = async () => {
  const allLinks = await getPageLinks()
  return allLinks.filter(({ slugParts }) => slugParts[0] === PRODUCTS_SLUG)
}

export const getStoriesBySlug = async (
  slugs: Array<string>,
  options: Pick<StoryOptions, 'version'>,
) => {
  const response = await getStoryblokApi().getStories({
    by_slugs: slugs.join(','),
    ...options,
    ...(USE_DRAFT_CONTENT && { version: 'draft' }),
  })

  return response.data.stories
}

export const fetchStories = async (params: ISbStoriesParams) => {
  return getStoryblokApi().getStories({
    ...params,
    version: params.version ?? USE_DRAFT_CONTENT ? 'draft' : 'published',
  })
}

// See https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation
export const getRevalidate = () => {
  if (process.env.VERCEL_ENV === 'production') {
    return false
  } else {
    return 1
  }
}
