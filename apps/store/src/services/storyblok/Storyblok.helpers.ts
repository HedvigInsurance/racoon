import { SbBlokData } from '@storyblok/react'
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

export const getLinkFieldURL = (link: LinkField) => {
  return link.cached_url === 'home' ? '/' : `/${link.cached_url}`
}
