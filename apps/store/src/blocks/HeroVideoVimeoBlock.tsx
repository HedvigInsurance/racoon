import { HeroVideoVimeo } from '@/components/HeroVideoVimeo/HeroVideoVimeo'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { HeadingBlockProps, HeadingBlock } from './HeadingBlock'

type HeroVideoBlockProps = SbBaseBlockProps<{
  videoId: string
  height: string
  headingsPadding: string
  headings: ExpectedBlockType<HeadingBlockProps>
}>

export const HeroVideoVimeoBlock = ({ blok }: HeroVideoBlockProps) => {
  const headingBlocks = filterByBlockType(blok.headings, HeadingBlock.blockName)

  return (
    <HeroVideoVimeo
      videoId={blok.videoId}
      height={blok.height}
      childrenPadding={blok.headingsPadding}
    >
      {headingBlocks.map((nestedBlock) => (
        <HeadingBlock blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </HeroVideoVimeo>
  )
}
HeroVideoVimeoBlock.blockName = 'heroVideoOnVimeo'
