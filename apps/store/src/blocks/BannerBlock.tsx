import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq } from 'ui'
import { HeadingBlock, HeadingBlockProps, isHeadingBlock } from '@/blocks/HeadingBlock'
import { TextBlock, TextBlockProps, isTextBlock } from '@/blocks/TextBlock'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type ImageSize = {
  aspectRatioLandscape?: '4 / 3' | '16 / 9'
  aspectRatioPortrait?: '1 / 1' | '4 / 5'
}

type BannerBlockProps = SbBaseBlockProps<
  {
    image: StoryblokAsset
    fullBleed?: boolean
    body?: Array<HeadingBlockProps['blok'] | TextBlockProps['blok']>
  } & ImageSize
>

export const BannerBlock = ({ blok }: BannerBlockProps) => {
  const headingBlocks = blok.body?.filter(isHeadingBlock)
  const textBlocks = blok.body?.filter(isTextBlock)

  return (
    <Wrapper
      aspectRatioLandscape={blok.aspectRatioLandscape ?? '16 / 9'}
      aspectRatioPortrait={blok.aspectRatioPortrait ?? '1 / 1'}
      {...storyblokEditable(blok)}
    >
      <Image src={blok.image.filename} alt={blok.image.alt} fill={true} />
      <BodyWrapper>
        {headingBlocks?.map((nestedBlock) => (
          <HeadingBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
        {textBlocks?.map((nestedBlock) => (
          <TextBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </BodyWrapper>
    </Wrapper>
  )
}
BannerBlock.blockName = 'banner'

const Wrapper = styled('div')<ImageSize>(
  ({ theme, aspectRatioLandscape, aspectRatioPortrait }) => ({
    position: 'relative',
    marginInline: theme.space.xs,
    borderRadius: theme.radius.md,
    overflow: 'hidden',

    [mq.md]: {
      marginInline: theme.space.md,
      borderRadius: theme.radius.lg,
    },

    ['@media (orientation: portrait)']: {
      ...(aspectRatioPortrait && { aspectRatio: aspectRatioPortrait }),
    },
    ['@media (orientation: landscape)']: {
      ...(aspectRatioLandscape && { aspectRatio: aspectRatioLandscape }),
    },
  }),
)

const Image = styled(NextImage)({
  objectFit: 'cover',
})

const BodyWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.space.md,

  [mq.md]: {
    padding: theme.space.xl,
  },
}))
