import { Video } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type VideoBlockProps = SbBaseBlockProps<{
  video: StoryblokAsset
  poster?: StoryblokAsset
  autoplay?: boolean
}>

export const VideoBlock = ({ blok }: VideoBlockProps) => {
  return (
    <Video
      sources={[{ url: blok.video.filename }]}
      poster={blok.poster?.filename}
      autoplay={blok.autoplay}
    />
  )
}
VideoBlock.blockName = 'videoBlock'
