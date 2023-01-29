import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq, theme } from 'ui'
import { Wrapper as ButtonBlockWrapper } from '@/blocks/ButtonBlock'
import { Wrapper as HeadingBlockWrapper } from '@/blocks/HeadingBlock'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type Orientation = 'vertical' | 'fluid'
type TextAlignment = 'top' | 'center' | 'bottom'
type ImagePlacement = 'left' | 'right'

const DEFAULT_ORIENTATION: Orientation = 'vertical'
const DEFAULT_TEXT_ALIGNMENT: TextAlignment = 'top'
const DEFAULT_IMAGE_PLACEMENT: ImagePlacement = 'right'

type ImageTextBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  body?: SbBlokData[]
  orientation?: Orientation
  textAlignment?: TextAlignment
  imagePlacement?: ImagePlacement
  reverse?: boolean
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  return (
    <Wrapper
      data-orientation={blok.orientation ?? DEFAULT_ORIENTATION}
      data-text-alignment={blok.textAlignment ?? DEFAULT_TEXT_ALIGNMENT}
      imagePlacement={blok.imagePlacement ?? DEFAULT_IMAGE_PLACEMENT}
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

const Wrapper = styled.div<{ imagePlacement: ImagePlacement }>(({ imagePlacement }) => ({
  display: 'flex',
  paddingInline: theme.space.xs,

  '&[data-orientation="vertical"]': {
    flexFlow: `${imagePlacement === 'right' ? 'column-reverse' : 'column'} nowrap`,
  },
  '&[data-orientation="fluid"]': {
    flexFlow: `${imagePlacement === 'right' ? 'row-reverse' : 'row'} wrap`,
  },

  [mq.lg]: {
    paddingInline: theme.space.md,
  },
}))

const ImageWrapper = styled.div({
  flex: '1',
  position: 'relative',
  aspectRatio: '3 / 2',

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

  [`${Wrapper}[data-text-alignment='top'] &`]: {
    justifyContent: 'flex-start',
  },
  [`${Wrapper}[data-text-alignment='center'] &`]: {
    justifyContent: 'center',
  },
  [`${Wrapper}[data-text-alignment='bottom'] &`]: {
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
