import { Video } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokImage } from '@/services/storyblok/storyblok'

type VideoBlockProps = SbBaseBlockProps<{
  video: StoryblokImage
  poster?: StoryblokImage
}>

export const VideoBlock = ({ blok }: VideoBlockProps) => {
  return <Video sources={[{ url: blok.video.filename }]} poster={blok.poster?.filename} />
}
VideoBlock.blockName = 'videoBlock'
