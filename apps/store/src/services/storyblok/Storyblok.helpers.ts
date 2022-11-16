import { StoryblokClient } from '@storyblok/js'
import { SbBlokData, StoryData } from '@storyblok/react'
import { Language } from '@/utils/l10n/types'
import { LinkField, StoryblokVersion } from './storyblok'

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

export const fetchStory = async (
  storyblokClient: StoryblokClient,
  slug: string,
  params: StoryblokFetchParams,
): Promise<StoryData | undefined> => {
  const {
    data: { story },
  } = await storyblokClient.get(`cdn/stories/${slug}`, { ...params, resolve_links: 'url' })
  return story
}

export const getLinkFieldURL = (link: LinkField) => {
  if (link.story) return makeAbsolute(link.story.url)

  if (link.linktype === 'url') return makeAbsolute(link.url)

  // Should never happen, but let's simplify debugging when it does
  console.warn('Did not see story field in link, returning empty URL', link)
  return '/'
}

const makeAbsolute = (url: string) => {
  if (/^(\/|https?:\/\/|\/\/)/.test(url)) {
    return url
  }
  return '/' + url
}
