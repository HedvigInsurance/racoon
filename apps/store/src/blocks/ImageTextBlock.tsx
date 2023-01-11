import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq, theme } from 'ui'
import { Wrapper as ButtonBlockWrapper } from '@/blocks/ButtonBlock'
import { Wrapper as HeadingBlockWrapper } from '@/blocks/HeadingBlock'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type Orientation = 'left' | 'right'

type Alignment = 'top' | 'center' | 'bottom'

type ImageTextBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  body?: SbBlokData[]
  orientation?: Orientation
  alignment?: Alignment
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  return (
    <Wrapper data-orientation={blok.orientation ?? 'left'} {...storyblokEditable(blok)}>
      <ImageWrapper>
        <Image src={blok.image.filename} alt={blok.image.alt} fill={true} />
      </ImageWrapper>
      <BodyWrapper data-alignment={blok.alignment ?? 'top'}>
        <div>
          {blok.body?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </BodyWrapper>
    </Wrapper>
  )
}
ImageTextBlock.blockName = 'imageText'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingInline: theme.space[2],
  minHeight: '37.5rem',
  [mq.md]: {
    minHeight: 'revert',
    "&[data-orientation='left']": {
      flexDirection: 'row',
    },
    "&[data-orientation='right']": {
      flexDirection: 'row-reverse',
    },
  },
  [mq.lg]: {
    paddingInline: theme.space[4],
  },
})

const ImageWrapper = styled.div({
  flex: 1,
  position: 'relative',
  aspectRatio: '1 / 1',
})

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.lg,
})

const BodyWrapper = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.space[5]} ${theme.space[4]}`,
  [mq.md]: {
    padding: `${theme.space[4]} ${theme.space[6]}`,
    "&[data-alignment='top']": {
      justifyContent: 'flex-start',
    },
    "&[data-alignment='center']": {
      justifyContent: 'center',
    },
    "&[data-alignment='bottom']": {
      justifyContent: 'flex-end',
    },
  },
  [`${HeadingBlockWrapper}`]: {
    padding: 0,
  },
  [`${ButtonBlockWrapper}`]: {
    display: 'inline-block',
    padding: 0,
  },
})
