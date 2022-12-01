import { Video, VideoSize } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type VideoBlockProps = SbBaseBlockProps<
  {
    video: StoryblokAsset
    poster?: StoryblokAsset
    autoplay?: boolean
  } & VideoSize
>

export const VideoBlock = ({ blok }: VideoBlockProps) => {
  return (
    <Video
      sources={[{ url: blok.video.filename }]}
      poster={blok.poster?.filename}
      autoplay={blok.autoplay}
      aspectRatioLandscape={blok.aspectRatioLandscape}
      aspectRatioPortrait={blok.aspectRatioPortrait}
      maxHeightLandscape={blok.maxHeightLandscape}
      maxHeightPortrait={blok.maxHeightPortrait}
    />
  )
}
VideoBlock.blockName = 'videoBlock'
