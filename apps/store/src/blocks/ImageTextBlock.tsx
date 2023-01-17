import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq, theme } from 'ui'
import { Wrapper as ButtonBlockWrapper } from '@/blocks/ButtonBlock'
import { Wrapper as HeadingBlockWrapper } from '@/blocks/HeadingBlock'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type Orientation = 'vertical' | 'horizontal' | 'fluid'
type Alignment = 'top' | 'center' | 'bottom'

const DEFAULT_ORIENTATION: Orientation = 'vertical'
const DEFAULT_ALIGNMENT: Alignment = 'top'

type ImageTextBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  body?: SbBlokData[]
  orientation?: Orientation
  alignment?: Alignment
  reverse?: boolean
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  return (
    <Wrapper
      data-orientation={blok.orientation ?? DEFAULT_ORIENTATION}
      data-alignment={blok.alignment ?? DEFAULT_ALIGNMENT}
      reverse={blok.reverse ?? false}
      {...storyblokEditable(blok)}
    >
      <ImageWrapper>
        <Image src={blok.image.filename} alt={blok.image.alt} fill={true} />
      </ImageWrapper>
      <BodyWrapper>
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

const Wrapper = styled.div<{ reverse: boolean }>(({ reverse }) => ({
  display: 'flex',
  paddingInline: theme.space.xs,
  [mq.lg]: {
    paddingInline: theme.space.md,
  },

  '&[data-orientation="horizontal"]': {
    flexFlow: `${reverse ? 'row-reverse' : 'row'} nowrap`,
  },
  '&[data-orientation="vertical"]': {
    flexFlow: `${reverse ? 'column-reverse' : 'column'} nowrap`,
  },
  '&[data-orientation="fluid"]': {
    flexFlow: `${reverse ? 'row-reverse wrap-reverse' : 'row wrap'}`,
  },
}))

const ImageWrapper = styled.div({
  flex: '1',
  position: 'relative',
  aspectRatio: '1 / 1',

  [`${Wrapper}[data-orientation="fluid"] &`]: {
    // This constraint helps flex algorithm to decide when to wrap
    minWidth: '22rem',
  },
})

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.lg,
})

const BodyWrapper = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.space.sm,
  [mq.md]: {
    padding: theme.space.md,
  },

  [`${Wrapper}[data-orientation="fluid"] &`]: {
    // This constraint helps flex algorithm to decide when to wrap
    minWidth: '35ch',
  },

  [`${Wrapper}[data-alignment='top'] &`]: {
    justifyContent: 'flex-start',
  },
  [`${Wrapper}[data-alignment='center'] &`]: {
    justifyContent: 'center',
  },
  [`${Wrapper}[data-alignment='bottom'] &`]: {
    justifyContent: 'flex-end',
  },

  [`${HeadingBlockWrapper}`]: {
    padding: 0,
  },
  [`${ButtonBlockWrapper}`]: {
    display: 'inline-block',
    padding: 0,
  },
})
