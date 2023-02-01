import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { Heading, Text, mq, theme } from 'ui'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type ImageSize = {
  aspectRatioLandscape?: '4 / 3' | '16 / 9'
  aspectRatioPortrait?: '1 / 1' | '4 / 5'
}

type BannerBlockProps = SbBaseBlockProps<
  {
    image: StoryblokAsset
    title?: string
    description?: string
  } & ImageSize
>

export const BannerBlock = ({ blok }: BannerBlockProps) => {
  const hasContent = blok.title || blok.description

  return (
    <Wrapper
      aspectRatioLandscape={blok.aspectRatioLandscape ?? '16 / 9'}
      aspectRatioPortrait={blok.aspectRatioPortrait ?? '1 / 1'}
      {...storyblokEditable(blok)}
    >
      <Image src={blok.image.filename} alt={blok.image.alt} fill={true} />
      {hasContent && (
        <BodyWrapper>
          {blok.title && (
            <Title as="h1" align="center" color="textNegative" variant="serif.32">
              {blok.title}
            </Title>
          )}
          {blok.description && (
            <Description color="textNegative" size={{ _: 'md', lg: 'lg' }} align="center">
              {blok.description}
            </Description>
          )}
        </BodyWrapper>
      )}
    </Wrapper>
  )
}
BannerBlock.blockName = 'banner'

const Wrapper = styled('div')<ImageSize>(({ aspectRatioLandscape, aspectRatioPortrait }) => ({
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
}))

const Image = styled(NextImage)({
  objectFit: 'cover',
})

const BodyWrapper = styled.div({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateAreas: `
    'title'
    '.'
    'content'
  `,
  padding: theme.space.md,

  [mq.md]: {
    padding: theme.space.xl,
  },
})

const Title = styled(Heading)({
  gridArea: 'title',
  fontSize: theme.fontSizes[6],

  [mq.md]: {
    fontSize: theme.fontSizes[10],
  },
})

const Description = styled(Text)({
  gridArea: 'content',
})
