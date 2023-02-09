import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextImage from 'next/image'
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

  const content = (
    <Wrapper
      {...storyblokEditable(blok)}
      aspectRatioLandscape={blok.aspectRatioLandscape}
      aspectRatioPortrait={blok.aspectRatioPortrait}
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

  if (blok.fullBleed) return content

  return <Layout>{content}</Layout>
}
ImageBlock.blockName = 'image'

const Layout = styled.div({ paddingInline: theme.space.md })

type WrapperProps = {
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
}

const Wrapper = styled('div', { shouldForwardProp: isPropValid })<WrapperProps>(
  ({ aspectRatioLandscape = '3 / 2', aspectRatioPortrait = '3 / 2' }) => ({
    position: 'relative',
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
