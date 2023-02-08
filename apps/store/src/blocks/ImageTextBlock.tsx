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
      <BodyWrapper imagePlacement={blok.imagePlacement ?? DEFAULT_IMAGE_PLACEMENT}>
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
  flexDirection: 'column',

  '&[data-orientation="vertical"]': {
    paddingInline: theme.space.xs,
    [mq.md]: {
      paddingInline: theme.space.md,
    },
  },
  '&[data-orientation="fluid"]': {
    paddingInline: theme.space.xs,
    [mq.md]: {
      paddingInline: theme.space.md,
    },
    [mq.lg]: {
      flexDirection: imagePlacement === 'right' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
  },
}))

const ImageWrapper = styled.div({
  flex: '1',
  position: 'relative',
  aspectRatio: '3 / 2',
  minWidth: '22rem',

  [`${Wrapper}[data-orientation="fluid"] &`]: {
    [mq.lg]: {
      maxWidth: '43.5rem',
    },
  },
})

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.lg,
})

const BodyWrapper = styled.div<{ imagePlacement: ImagePlacement }>(({ imagePlacement }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',

  [`${Wrapper}[data-orientation="vertical"] &`]: {
    padding: theme.space.xs,
    [mq.md]: {
      paddingBlock: theme.space.md,
    },
  },
  [`${Wrapper}[data-orientation="fluid"] &`]: {
    paddingBlock: theme.space.md,
    paddingInline: theme.space.xs,
    [mq.lg]: {
      maxWidth: '37.5rem',
      paddingInline:
        imagePlacement === 'right'
          ? `${theme.space.xs} ${theme.space.xxl}`
          : `${theme.space.xxl} ${theme.space.xs}`,
    },
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
}))
