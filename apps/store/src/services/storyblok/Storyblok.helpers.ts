import { StoryblokClient } from '@storyblok/js'
import { type SbBlokData, type ISbStoryData } from '@storyblok/react'
import { Features } from '@/utils/Features'
import { type Language } from '@/utils/l10n/types'
import { LinkField, ProductStory, StoryblokVersion } from './storyblok'

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

export type StoryblokFetchParams = {
  version: StoryblokVersion
  language?: Language
  resolve_relations?: string
}

const STORYBLOK_CACHE_VERSION = process.env.STORYBLOK_CACHE_VERSION
export const fetchStory = async <StoryData extends ISbStoryData>(
  storyblokClient: StoryblokClient,
  slug: string,
  params: StoryblokFetchParams,
): Promise<StoryData> => {
  let cv: number | undefined
  if (params.version === 'published') {
    const cacheVersion = STORYBLOK_CACHE_VERSION ? parseInt(STORYBLOK_CACHE_VERSION) : NaN
    const isCacheVersionValid = !isNaN(cacheVersion)
    cv = isCacheVersionValid ? cacheVersion : undefined
  }
  const response = await storyblokClient.getStory(slug, {
    ...params,
    cv,
    resolve_links: 'url',
  })

  return response.data.story as StoryData
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

const makeAbsolute = (url: string) => {
  url = removeTrailingSlash(url)
  if (/^(\/|https?:\/\/|\/\/)/.test(url)) {
    return url
  }
  return '/' + url
}

const appendAnchor = (url: string, anchor?: string) => (anchor ? `${url}#${anchor}` : url)

export const isProductStory = (story: ISbStoryData): story is ProductStory => {
  return story.content.component === 'product'
}

export const getStoryblokImageSize = (filename: string) => {
  const [, width, height] = filename.match(/\/(\d+)x(\d+)\//) ?? []

  if (!width || !height) return null

  return { width: Number(width), height: Number(height) }
}

type ImageOptimizationOptions = {
  maxHeight?: number
  maxWidth?: number
}
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: ImageOptimizationOptions = {},
) => {
  let optimizationRules = ''
  if (options.maxHeight || options.maxWidth) {
    optimizationRules = `fit-in/${options.maxWidth ?? 0}x${options.maxHeight ?? 0}`
  }
  return `${originalUrl}/m/${optimizationRules}`
}

// Replace domain for Storyblok assets
export const getImgSrc = (src: string) => {
  if (!Features.enabled('CUSTOM_ASSET_DOMAIN')) {
    return src
  }
  return (src || '').replace('//a.storyblok.com', '//assets.hedvig.com')
}

export const removeTrailingSlash = (url: string) => {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
