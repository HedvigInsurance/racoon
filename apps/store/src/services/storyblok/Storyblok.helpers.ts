import { StoryblokClient } from '@storyblok/js'
import { SbBlokData, ISbStoryData } from '@storyblok/react'
import { get as getFromConfig } from '@vercel/edge-config'
import { fetchJson } from '@/services/authApi/fetchJson'
import { Language } from '@/utils/l10n/types'
import { LinkField, ProductStory, StoryblokVersion } from './storyblok'

export const filterByBlockType = <BlockData extends SbBlokData>(
  blocks: BlockData[] = [],
  targetType: string,
): BlockData[] => {
  const result: BlockData[] = []
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

export const fetchStory = async <StoryData extends ISbStoryData | undefined>(
  storyblokClient: StoryblokClient,
  slug: string,
  params: StoryblokFetchParams,
): Promise<StoryData> => {
  // let cv: number | undefined
  // if (params.version === 'published') {
  //   cv = await getStoryblokCacheVersion()
  // }
  const response = await storyblokClient.get(`cdn/stories/${slug}`, {
    ...params,
    // cv,
    resolve_links: 'url',
  })

  const {
    data: { story },
  } = response
  return story as StoryData
}

const missingLinks = new Set()
export const getLinkFieldURL = (link: LinkField, linkText?: string) => {
  if (link.story) return makeAbsolute(link.story.url)

  if (link.linktype === 'url') return makeAbsolute(link.url)

  // Warn about CMS links without target. This could be either reference to something not yet created or misconfiguration
  if (!missingLinks.has(link.id)) {
    missingLinks.add(link.id)
    console.log('Did not see story field in link, returning empty URL.', linkText, link)
  }
  return '/'
}

const makeAbsolute = (url: string) => {
  if (/^(\/|https?:\/\/|\/\/)/.test(url)) {
    return url
  }
  return '/' + url
}

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

export const getStoryblokCacheVersion = async () => {
  return await getFromConfig<number>('storyblokCacheVersion')
}

export const publishStoryblokCacheVersion = async (cacheVersion: number) => {
  console.log('Updating Storyblok cache version in Edge config', cacheVersion)
  const manageApiUrl = process.env.EDGE_CONFIG_MANAGE_API_URL
  if (!manageApiUrl) {
    throw new Error('EDGE_CONFIG_MANAGE_API_URL not configured')
  }
  const manageApiToken = process.env.EDGE_CONFIG_MANAGE_API_TOKEN
  if (!manageApiToken) {
    throw new Error('EDGE_CONFIG_MANAGE_API_TOKEN not configured')
  }
  return fetchJson(manageApiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${manageApiToken}`,
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: 'storyblokCacheVersion',
          value: cacheVersion,
        },
      ],
    }),
  })
}
