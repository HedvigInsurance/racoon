import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq } from 'ui'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  fullBleed?: boolean
  body?: ExpectedBlockType<HeadingBlockProps>
}>

export const ImageBlock = ({ blok }: ImageBlockProps) => {
  const sizeProps = getSizeFromURL(blok.image.filename)
  const headingBlocks = filterByBlockType(blok.body, HeadingBlock.blockName)

  return (
    <Wrapper {...storyblokEditable(blok)} includePadding={!blok.fullBleed}>
      <Image
        src={blok.image.filename}
        roundedCorners={!blok.fullBleed}
        {...sizeProps}
        alt={blok.image.alt}
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

type WrapperProps = { includePadding: boolean }

const Wrapper = styled('div', { shouldForwardProp: isPropValid })<WrapperProps>(
  ({ theme, includePadding }) => ({
    paddingLeft: includePadding ? theme.space[4] : 0,
    paddingRight: includePadding ? theme.space[4] : 0,
    position: 'relative',
  }),
)

type ImageProps = { roundedCorners: boolean }

const Image = styled(NextImage, { shouldForwardProp: isPropValid })<ImageProps>(
  ({ theme, roundedCorners }) => ({
    ...(roundedCorners && {
      borderRadius: theme.radius.md,
      [mq.lg]: {
        borderRadius: theme.radius.xl,
      },
    }),
  }),
)

const BodyWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: theme.space[4],
  left: theme.space[4],
  right: theme.space[4],
}))

export const getSizeFromURL = (url: string) => {
  const [, rawWidth, rawHeight] = url.match(/\/(\d+)x(\d+)\//) || []

  const width = parseInt(rawWidth, 10) || 0
  const height = parseInt(rawHeight, 10) || 0

  return { width, height }
}
