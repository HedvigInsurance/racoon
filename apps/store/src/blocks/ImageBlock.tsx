import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ConditionalWrapper, mq, theme } from 'ui'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import {
  type ExpectedBlockType,
  type GridColumnsField,
  type SbBaseBlockProps,
  type StoryblokAsset,
} from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

export type ImageAspectRatio = '1 / 1' | '2 / 1' | '3 / 2' | '4 / 3' | '5 / 4' | '16 / 9'

export type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  aspectRatioLandscape?: ImageAspectRatio
  aspectRatioPortrait?: ImageAspectRatio
  fullBleed?: boolean
  body?: ExpectedBlockType<HeadingBlockProps>
  priority?: boolean
  layout?: GridColumnsField
}>

export const ImageBlock = ({ blok, nested }: ImageBlockProps) => {
  const headingBlocks = filterByBlockType(blok.body, HeadingBlock.blockName)

  return (
    <ConditionalWrapper
      condition={!blok.fullBleed && !nested}
      wrapWith={(children) => (
        <GridLayout.Root>
          <GridLayout.Content
            width={blok.layout?.widths ?? { base: '1' }}
            align={blok.layout?.alignment ?? 'center'}
          >
            {children}
          </GridLayout.Content>
        </GridLayout.Root>
      )}
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
          priority={blok.priority}
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

const Image = styled(ImageWithPlaceholder, {
  shouldForwardProp: (prop) => (prop === 'priority' ? true : isPropValid(prop)),
})<ImageProps>(({ roundedCorners }) => ({
  objectFit: 'cover',
  ...(roundedCorners && {
    borderRadius: theme.radius.md,
    [mq.lg]: {
      borderRadius: theme.radius.xl,
    },
  }),
}))

const BodyWrapper = styled.div({
  position: 'absolute',
  top: theme.space.md,
  left: theme.space.md,
  right: theme.space.md,
})
