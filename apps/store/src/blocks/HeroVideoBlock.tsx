import { getMediaQueryBreakpoint } from 'ui'
import { HeroVideo } from '@/components/HeroVideo/HeroVideo'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType, getOptimizedImageUrl } from '@/services/storyblok/Storyblok.helpers'
import { HeadingBlockProps, HeadingBlock } from './HeadingBlock'

type HeroVideoBlockProps = SbBaseBlockProps<{
  video: StoryblokAsset
  format: string
  height: number
  poster?: StoryblokAsset
  headingsPadding: string
  headings: ExpectedBlockType<HeadingBlockProps>
}>

export const HeroVideoBlock = ({ blok }: HeroVideoBlockProps) => {
  const headingBlocks = filterByBlockType(blok.headings, HeadingBlock.blockName)
  const posterUrl = blok.poster?.filename
    ? getOptimizedImageUrl(blok.poster.filename, {
        maxWidth: getMediaQueryBreakpoint('xxl'),
      })
    : undefined

  return (
    <HeroVideo
      sources={[{ url: blok.video.filename, format: blok.format }]}
      height={blok.height}
      poster={posterUrl}
      childrenPadding={blok.headingsPadding}
    >
      {headingBlocks.map((nestedBlock) => (
        <HeadingBlock blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </HeroVideo>
  )
}
HeroVideoBlock.blockName = 'heroVideoOnStoryblok'
