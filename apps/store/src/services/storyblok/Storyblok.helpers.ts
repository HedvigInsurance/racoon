import { SbBlokData } from '@storyblok/react'
import { getCountryByLocale } from '@/lib/l10n/countries'
import { LocaleData } from '@/lib/l10n/locales'
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

export const getLinkFieldURL = (link: LinkField, locale: LocaleData) => {
  const country = getCountryByLocale(locale.locale)
  const fragments = link.story.full_slug.split('/')

  // en/SE/page => SE/page, SE/page => unchanged
  const hasLangPrefix = locale.locale !== country.defaultLocale
  if (hasLangPrefix) {
    fragments.shift()
  }

  // SE/page => page
  fragments.shift()

  // home => '', products/home => unchanged
  if (fragments.length === 2 && link.story.slug === 'home') {
    fragments.pop()
  }

  return `/${fragments.join('/')}`
}
