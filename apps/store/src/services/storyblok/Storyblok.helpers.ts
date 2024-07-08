import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import type { RoutingLocale } from '@/utils/l10n/types'
import { makeAbsolute, appendAnchor } from '@/utils/url'
import type {
  LinkField,
  PriceCalculatorPageStory,
  ProductStory,
  WidgetFlowStory,
} from './storyblok'

export const filterByBlockType = <BlockData extends SbBlokData>(
  blocks: Array<BlockData> = [],
  targetType: string,
): Array<BlockData> => {
  const result: Array<BlockData> = []
  for (const block of blocks) {
    const blockOfType = checkBlockType(block, targetType)
    if (blockOfType === null) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Found blok of type ${block.component}. Only ${targetType} expected`)
      }
    } else {
      result.push(block)
    }
  }
  return result
}

export const checkBlockType = <BlockData extends SbBlokData>(
  block: SbBlokData,
  targetType: string,
): BlockData | null => {
  if (block.component === targetType) return block as BlockData
  else return null
}

const MISSING_LINKS = new Set()
export const getLinkFieldURL = (link: LinkField, linkText?: string) => {
  if (link.story) return makeAbsolute(appendAnchor(link.story.url, link.anchor))

  if (link.linktype === 'url') return makeAbsolute(appendAnchor(link.url, link.anchor))

  // Warn about CMS links without target. This could be either reference to something not yet created or misconfiguration
  if (!MISSING_LINKS.has(link.id)) {
    MISSING_LINKS.add(link.id)
    console.log('Did not see story field in link, returning empty URL.', linkText, link)
  }

  return makeAbsolute(appendAnchor(link.cached_url, link.anchor))
}

export const isProductStory = (story: ISbStoryData): story is ProductStory => {
  return story.content.component === 'product'
}

export const isWidgetFlowStory = (story: ISbStoryData): story is WidgetFlowStory => {
  return story.content.component === 'widgetFlow'
}

export const isPriceCalculatorPageStory = (
  story: ISbStoryData,
): story is PriceCalculatorPageStory => {
  return story.content.component === 'priceCalculatorPage'
}

export const getStoryblokImageSize = (filename: string) => {
  const [, width, height] = filename.match(/\/(\d+)x(\d+)\//) ?? []

  if (!width || !height) return null

  return { width: Number(width), height: Number(height) }
}

// Replace domain for Storyblok assets
export const getImgSrc = (src: string) => {
  return (src || '').replace('//a.storyblok.com', '//assets.hedvig.com')
}

/**
 * If rel is set, use rel value from custom attributes in Storyblok link field
 * If target is _blank, default to noopener
 */
export const getLinkRel = (link: Pick<LinkField, 'rel' | 'target'>) => {
  if (link.rel) {
    return link.rel
  }

  if (link.target === '_blank') {
    return 'noopener'
  }

  return undefined
}

export type LinkData = Pick<
  ISbStoryData,
  'id' | 'slug' | 'name' | 'parent_id' | 'position' | 'uuid' | 'is_startpage'
> & { is_folder: boolean; path: string; published: boolean; real_path: string }

export type PageLink = {
  link: LinkData
  locale: RoutingLocale
  slugParts: Array<string>
}
