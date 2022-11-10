import { Video } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type VideoBlockProps = SbBaseBlockProps<{
  video: StoryblokAsset
  poster?: StoryblokAsset
}>

export const VideoBlock = ({ blok }: VideoBlockProps) => {
  console.log('test', blok.video)
  return <Video sources={[{ url: blok.video.filename }]} poster={blok.poster?.filename} />
}
VideoBlock.blockName = 'videoBlock'
