import { HeroVideo } from '@/components/HeroVideo/HeroVideo'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokImage } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { HeadingBlockProps, HeadingBlock } from './HeadingBlock'

type HeroVideoBlockProps = SbBaseBlockProps<{
  video: StoryblokImage
  format: string
  height: number
  poster: StoryblokImage
  headingsPadding: string
  headings: ExpectedBlockType<HeadingBlockProps>
}>

export const HeroVideoBlock = ({ blok }: HeroVideoBlockProps) => {
  const headingBlocks = filterByBlockType(blok.headings, HeadingBlock.blockName)

  return (
    <HeroVideo
      sources={[{ url: blok.video.filename, format: blok.format }]}
      height={blok.height}
      poster={blok.poster.filename}
      childrenPadding={blok.headingsPadding}
    >
      {headingBlocks.map((nestedBlock) => (
        <HeadingBlock blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </HeroVideo>
  )
}
HeroVideoBlock.blockName = 'heroVideoOnStoryblok'
