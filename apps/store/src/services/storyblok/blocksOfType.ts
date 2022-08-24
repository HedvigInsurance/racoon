import { SbBlokData } from '@storyblok/react'

export function blocksOfType<BlockData extends SbBlokData>(
  blocks: BlockData[],
  targetType: string,
): BlockData[] {
  const result: BlockData[] = []
  for (const block of blocks) {
    if (block.component !== targetType) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Found blok of type ${block.component}.  Only ${targetType} expected`)
      }
    } else {
      result.push(block)
    }
  }
  return result
}
