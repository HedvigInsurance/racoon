import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ConditionalWrapper, mq, theme } from 'ui'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

export type ImageAspectRatio = '1 / 1' | '2 / 1' | '3 / 2' | '4 / 3' | '5 / 4' | '16 / 9'

export type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
  fullBleed?: boolean
  body?: ExpectedBlockType<HeadingBlockProps>
}>

export const ImageBlock = ({ blok, nested }: ImageBlockProps) => {
  const headingBlocks = filterByBlockType(blok.body, HeadingBlock.blockName)

  return (
    <ConditionalWrapper
      condition={!blok.fullBleed && !nested}
      wrapWith={(children) => <Layout>{children}</Layout>}
    >
      <ImageWrapper
        {...storyblokEditable(blok)}
        aspectRatioLandscape={blok.aspectRatioLandscape}
        aspectRatioPortrait={blok.aspectRatioPortrait}
      >
        <Image
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
      </ImageWrapper>
    </ConditionalWrapper>
  )
}
ImageBlock.blockName = 'image'

const Layout = styled.div({ paddingInline: theme.space.md })

type WrapperProps = {
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
}

const ImageWrapper = styled('div', { shouldForwardProp: isPropValid })<WrapperProps>(
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

const Image = styled(ImageWithPlaceholder, { shouldForwardProp: isPropValid })<ImageProps>(
  ({ roundedCorners }) => ({
    objectFit: 'cover',
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
