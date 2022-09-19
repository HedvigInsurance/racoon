import { StoryblokClient } from '@storyblok/js'
import { SbBlokData, StoryData } from '@storyblok/react'
import { getCountryByLocale } from '@/lib/l10n/countries'
import { LocaleData } from '@/lib/l10n/locales'
import { Language } from '@/lib/l10n/types'
import { LinkField } from './storyblok'

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
  version: 'draft' | 'published'
  language?: Language
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

export const getLinkFieldURL = (link: LinkField, locale: LocaleData) => {
  if (!link.story) {
    // Should never happen, but let's simplify debugging when it does
    console.error('Did not see story field in link, returning empty URL', link)
    return '/'
  }
  const fragments = link.story.full_slug.split('/')

  // en/SE/page => SE/page, SE/page => unchanged
  const country = getCountryByLocale(locale.locale)
  const hasLangPrefix = locale.locale !== country.defaultLocale
  if (hasLangPrefix) {
    fragments.shift()
  }

  // SE/page => /page
  fragments.shift()

  return `/${fragments.join('/')}`
}
