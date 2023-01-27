import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq, theme } from 'ui'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

export type ImageAspectRatio = '1 / 1' | '2 / 1' | '3 / 2' | '4 / 3' | '5 / 4' | '16 / 9'

type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
  fullBleed?: boolean
  body?: ExpectedBlockType<HeadingBlockProps>
}>

export const ImageBlock = ({ blok }: ImageBlockProps) => {
  const headingBlocks = filterByBlockType(blok.body, HeadingBlock.blockName)

  return (
    <Wrapper
      {...storyblokEditable(blok)}
      aspectRatioLandscape={blok.aspectRatioLandscape}
      aspectRatioPortrait={blok.aspectRatioPortrait}
      includePadding={!blok.fullBleed}
    >
      <Image
        style={{ objectFit: 'cover' }}
        src={blok.image.filename}
        roundedCorners={!blok.fullBleed}
        alt={blok.image.alt}
        fill
      />
      <BodyWrapper>
        {headingBlocks.map((nestedBlock) => (
          <HeadingBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </BodyWrapper>
    </Wrapper>
  )
}
ImageBlock.blockName = 'image'

type WrapperProps = {
  includePadding: boolean
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
}

const Wrapper = styled('div', { shouldForwardProp: isPropValid })<WrapperProps>(
  ({ includePadding, aspectRatioLandscape = '3 / 2', aspectRatioPortrait = '3 / 2' }) => ({
    position: 'relative',
    paddingLeft: includePadding ? theme.space.md : 0,
    paddingRight: includePadding ? theme.space.md : 0,
    ['@media (orientation: landscape)']: {
      aspectRatio: aspectRatioLandscape,
    },
    ['@media (orientation: portrait)']: {
      aspectRatio: aspectRatioPortrait,
    },
  }),
)

type ImageProps = { roundedCorners: boolean }

const Image = styled(NextImage, { shouldForwardProp: isPropValid })<ImageProps>(
  ({ roundedCorners }) => ({
    ...(roundedCorners && {
      borderRadius: theme.radius.md,
      [mq.lg]: {
        borderRadius: theme.radius.xl,
      },
    }),
  }),
)

const BodyWrapper = styled.div({
  position: 'absolute',
  top: theme.space.md,
  left: theme.space.md,
  right: theme.space.md,
})
