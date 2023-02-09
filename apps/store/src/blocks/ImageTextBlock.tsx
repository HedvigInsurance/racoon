import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
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
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  const { orientation = DEFAULT_ORIENTATION } = blok

  switch (orientation) {
    case 'fluid':
      return (
        <FluidImageTextBlock
          image={blok.image}
          body={blok.body}
          textAlignment={blok.textAlignment}
          imagePlacement={blok.imagePlacement}
        />
      )
    case 'vertical':
      return <VerticalImageTextBlock image={blok.image} body={blok.body} />
    default:
      console.warn(`orientation type '${orientation}' is not valid`)
      return null
  }
}
ImageTextBlock.blockName = 'imageText'

type VerticalImageTextBlockProps = Pick<ImageTextBlockProps['blok'], 'image' | 'body'>

const VerticalImageTextBlock = ({ image, body }: VerticalImageTextBlockProps) => {
  return (
    <VerticalImageTextBlockWrapper>
      <VerticalImageWrapper>
        <Image src={image.filename} alt={image.alt} fill={true} />
      </VerticalImageWrapper>
      <VerticalBodyWrapper>
        <div>
          {body?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </VerticalBodyWrapper>
    </VerticalImageTextBlockWrapper>
  )
}

const VerticalImageTextBlockWrapper = styled.div({
  paddingInline: theme.space.xs,
  [mq.md]: {
    paddingInline: theme.space.md,
  },
})

export const VerticalBodyWrapper = styled.div({
  padding: theme.space.xs,
  [mq.md]: {
    paddingBlock: theme.space.md,
  },
})

const VerticalImageWrapper = styled.div({
  position: 'relative',
  aspectRatio: '3 / 2',
})

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.lg,
})

type FluidImageTextBlockProps = Pick<
  ImageTextBlockProps['blok'],
  'image' | 'body' | 'textAlignment' | 'imagePlacement'
>

const FluidImageTextBlock = ({
  image,
  body,
  textAlignment = DEFAULT_TEXT_ALIGNMENT,
  imagePlacement = DEFAULT_IMAGE_PLACEMENT,
}: FluidImageTextBlockProps) => {
  return (
    <FluidImageTextBlockWrapper>
      <FluidImageWrapper>
        <Image src={image.filename} alt={image.alt} fill={true} />
      </FluidImageWrapper>
      <FluidBodyWrapper textAlignment={textAlignment} imagePlacement={imagePlacement}>
        <div>
          {body?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </FluidBodyWrapper>
    </FluidImageTextBlockWrapper>
  )
}

const FluidImageTextBlockWrapper = styled(GridLayout.Root)({
  paddingInline: theme.space.xs,
  [mq.md]: {
    paddingInline: theme.space.md,
  },
})

const FluidImageWrapper = styled.div({
  position: 'relative',
  aspectRatio: '3 / 2',
  gridColumn: '1 / -1',
  [mq.lg]: {
    gridColumn: 'span 6',
  },
})

export const FluidBodyWrapper = styled.div<{
  textAlignment: TextAlignment
  imagePlacement: ImagePlacement
}>(({ textAlignment, imagePlacement }) => ({
  paddingBlock: theme.space.md,
  paddingInline: theme.space.xs,
  gridColumn: '1 / -1',
  [mq.lg]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: getTextAlignmentStyles(textAlignment),
    gridColumn: 'span 6',
    order: imagePlacement === 'right' ? -1 : 'initial',
    maxWidth: '37.5rem',
    paddingInline:
      imagePlacement === 'right'
        ? `${theme.space.xs} ${theme.space.xxl}`
        : `${theme.space.xxl} ${theme.space.xs}`,
  },
}))

const getTextAlignmentStyles = (textAlignment: TextAlignment) => {
  switch (textAlignment) {
    case 'top':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'bottom':
      return 'flex-end'
    default:
      return 'initial'
  }
}
