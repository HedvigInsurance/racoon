import { apiPlugin, getStoryblokApi, SbBlokData, storyblokInit, StoryData } from '@storyblok/react'
import { AccordionBlock } from '@/blocks/AccordionBlock'
import { AccordionItemBlock } from '@/blocks/AccordionItemBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { CheckListBlock } from '@/blocks/CheckListBlock'
import { ContactSupportBlock } from '@/blocks/ContactSupportBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { FooterBlock, FooterLink, FooterSection } from '@/blocks/FooterBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { PriceCalculatorBlock } from '@/blocks/PriceCalculatorBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ProductSummaryBlock } from '@/blocks/ProductSummaryBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { TabsBlock } from '@/blocks/TabsBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { TimelineItemBlock } from '@/blocks/TimelineItemBlock'
import { NavItemBlock, NestedNavContainerBlock, HeaderBlock } from '@/blocks/TopMenuBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'
import { countries, getCountryByLocale } from '@/lib/l10n/countries'
import { getLocaleOrFallback } from '@/lib/l10n/locales'
import { CountryCode } from '@/lib/l10n/types'

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
  story: StoryData
  globalStory: GlobalStory
}

export type StoryblokImage = {
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
  linktype: 'story' | 'url'
  // Assumes we're using resolve_links=url
  story: {
    id: number
    uuid: string
    name: string
    slug: string
    url: string
    full_slug: string
  }
}

export type ProductStory = StoryData & {
  content: StoryData['content'] & {
    name: string
    productId: string
    priceFormTemplateId: string
    body: Array<SbBlokData>
    global: Array<SbBlokData>
  }
}

type GlobalStory = StoryData & {
  content: StoryData['content'] & {
    navMenuContainer: Array<SbBlokData>
  }
}

type LinkData = Pick<
  StoryData,
  'id' | 'slug' | 'name' | 'parent_id' | 'position' | 'uuid' | 'is_startpage'
> & { is_folder: boolean; path: string; published: boolean; real_path: string }

type PageLink = {
  link: LinkData
  countryId: CountryCode
  slugParts: string[]
}

type NamedBlock = {
  blockName: string
} & React.ElementType

export const initStoryblok = () => {
  const blockComponents: Array<NamedBlock> = [
    AccordionBlock,
    AccordionItemBlock,
    ButtonBlock,
    CheckListBlock,
    ContactSupportBlock,
    ContentBlock,
    FooterBlock,
    FooterLink,
    FooterSection,
    // TODO: Header vs Heading is easy to confuse.  Discuss with team if we should rename one of these
    HeaderBlock,
    HeadingBlock,
    HeroBlock,
    ImageBlock,
    InsurableLimitsBlock,
    NavItemBlock,
    NestedNavContainerBlock,
    PageBlock,
    PriceCalculatorBlock,
    ProductCardBlock,
    ProductGridBlock,
    ProductSlideshowBlock,
    ProductSummaryBlock,
    SpacerBlock,
    TabsBlock,
    TimelineBlock,
    TimelineItemBlock,
    TextBlock,
    TopPickCardBlock,
    PerilsBlock,
  ]
  const blockAliases = { product: PageBlock }
  const components = {
    ...Object.fromEntries(
      blockComponents.map((blockComponent) => [blockComponent.blockName, blockComponent]),
    ),
    ...blockAliases,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
  })
}

type StoryOptions = {
  locale: string
  preview?: boolean
}

export const getStoryBySlug = async (slug: string, { preview, locale }: StoryOptions) => {
  const country = getCountryByLocale(locale)
  const params: Record<string, string> = {
    version: preview ? 'draft' : 'published',
    resolve_links: 'url',
  }
  // Special case: in Storyblok default language means country default, ie Swedish in Sweden, Danish in Denmark, etc
  // Therefore we're not passing language code from NextJs locale here
  if (locale !== country.defaultLocale) {
    params.language = getLocaleOrFallback(locale).language
  }
  const { data } = await getStoryblokApi().get(`cdn/stories/${country.id}/${slug}`, params)
  return data.story as StoryData | undefined
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
    const [countryId, ...slugParts] = link.slug.split('/')
    if (!(countryId in countries)) {
      return
    }
    if (slugParts[0] === 'global') {
      return
    }
    pageLinks.push({
      link,
      countryId: countryId as CountryCode,
      slugParts,
    })
  })
  return pageLinks
}

const PRODUCTS_SLUG = 'products'
export const getNonProductPageLinks = async () => {
  const allLinks = await getPageLinks()
  return allLinks.filter(({ slugParts }) => slugParts[0] !== PRODUCTS_SLUG)
}

export const getGlobalStory = async (options: StoryOptions) => {
  const story = await getStoryBySlug('global', options)
  return story as GlobalStory
}

export const getProductStory = async (slug: string, options: StoryOptions) => {
  const story = await getStoryBySlug(`/products/${slug}`, options)
  return story as ProductStory
}
