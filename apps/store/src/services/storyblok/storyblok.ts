import {
  apiPlugin,
  getStoryblokApi,
  SbBlokData,
  storyblokInit,
  ISbStoryData,
} from '@storyblok/react'
import { AccordionBlock } from '@/blocks/AccordionBlock'
import { AccordionItemBlock } from '@/blocks/AccordionItemBlock'
import { BannerBlock } from '@/blocks/BannerBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { CheckListBlock } from '@/blocks/CheckListBlock'
import { ContactSupportBlock } from '@/blocks/ContactSupportBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { FooterBlock, FooterBlockProps, FooterLink, FooterSection } from '@/blocks/FooterBlock'
import {
  HeaderBlock,
  HeaderBlockProps,
  NavItemBlock,
  NestedNavContainerBlock,
} from '@/blocks/HeaderBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { HeroVideoBlock } from '@/blocks/HeroVideoBlock'
import { HeroVideoVimeoBlock } from '@/blocks/HeroVideoVimeoBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { ImageTextBlock } from '@/blocks/ImageTextBlock'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductDocumentsBlock } from '@/blocks/ProductDocumentsBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductPageBlock } from '@/blocks/ProductPageBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { TabsBlock } from '@/blocks/TabsBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { TimelineItemBlock } from '@/blocks/TimelineItemBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'
import { VideoBlock } from '@/blocks/VideoBlock'
import { VideoListBlock } from '@/blocks/VideoListBlock'
import { fetchStory, StoryblokFetchParams } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from './Storyblok.constant'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}

export type ExpectedBlockType<T> = T extends { blok: SbBlokData }
  ? T['blok'][]
  : `ExpectedBlock expects an argument which extends SbBlockData.
     These are likely the props of the block you are looking to render`

export type StoryblokQueryParams = {
  slug: string[]
}

export type StoryblokPageProps = {
  [STORY_PROP_NAME]: ISbStoryData
  [GLOBAL_STORY_PROP_NAME]: GlobalStory
}

export type StoryblokVersion = 'draft' | 'published'

export type StoryblokPreviewData = {
  version?: StoryblokVersion
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

export type ProductStory = ISbStoryData & {
  content: ISbStoryData['content'] & {
    name?: string
    description?: string
    tagline?: string
    productId: string
    priceFormTemplateId: string
    body: Array<SbBlokData>
    global: Array<SbBlokData>
  }
}

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

type LinkData = Pick<
  ISbStoryData,
  'id' | 'slug' | 'name' | 'parent_id' | 'position' | 'uuid' | 'is_startpage'
> & { is_folder: boolean; path: string; published: boolean; real_path: string }

type PageLink = {
  link: LinkData
  locale: RoutingLocale
  slugParts: string[]
}

type NamedBlock = {
  blockName: string
} & React.ElementType

export const initStoryblok = () => {
  const blockComponents: Array<NamedBlock> = [
    AccordionBlock,
    AccordionItemBlock,
    BannerBlock,
    ButtonBlock,
    CheckListBlock,
    ContactSupportBlock,
    ContentBlock,
    FooterBlock,
    FooterLink,
    FooterSection,
    ReusableBlockReference,
    // TODO: Header vs Heading is easy to confuse.  Discuss with team if we should rename one of these
    HeaderBlock,
    HeadingBlock,
    HeroBlock,
    HeroVideoBlock,
    HeroVideoVimeoBlock,
    ImageBlock,
    ImageTextBlock,
    InsurableLimitsBlock,
    NavItemBlock,
    NestedNavContainerBlock,
    PageBlock,
    PerilsBlock,
    ProductPageBlock,
    ProductCardBlock,
    ProductDocumentsBlock,
    ProductGridBlock,
    ProductSlideshowBlock,
    SpacerBlock,
    TabsBlock,
    TimelineBlock,
    TimelineItemBlock,
    TextBlock,
    TopPickCardBlock,
    VideoBlock,
    VideoListBlock,
  ]
  const blockAliases = { reusableBlock: PageBlock }
  const components = {
    ...Object.fromEntries(
      blockComponents.map((blockComponent) => [blockComponent.blockName, blockComponent]),
    ),
    ...blockAliases,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    apiOptions: {
      // ~290ms -> ~15ms for subsequent page renders
      cache: {
        type: 'memory',
        clear: 'auto',
      },
    },
    use: [apiPlugin],
    components,
  })
}

type StoryOptions = {
  locale: string
  version?: StoryblokVersion
}

export const getStoryBySlug = async (slug: string, { version, locale }: StoryOptions) => {
  const params: StoryblokFetchParams = {
    version: version ?? 'published',
    resolve_relations: 'reusableBlockReference.reference',
  }
  return await fetchStory(getStoryblokApi(), `${locale}/${slug}`, params)
}

export const getPageLinks = async (): Promise<PageLink[]> => {
  const storyblokApi = getStoryblokApi()
  const {
    data: { links },
  } = await storyblokApi.get('cdn/links/', {
    // Uncomment for local debug
    // version: 'draft',
  })
  const pageLinks: PageLink[] = []
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

const PRODUCTS_SLUG = 'products'
const REUSABLE_BLOCK = 'reusable-blocks'
export const getFilteredPageLinks = async () => {
  const allLinks = await getPageLinks()
  return allLinks.filter(({ slugParts }) => slugParts[0] !== REUSABLE_BLOCK)
}

export const getGlobalStory = async (options: StoryOptions) => {
  const story = await getStoryBySlug('global', options)
  return story as GlobalStory
}

export const getFilteredProductLinks = async () => {
  const allLinks = await getPageLinks()
  return allLinks.filter(({ slugParts }) => slugParts[0] === PRODUCTS_SLUG)
}
