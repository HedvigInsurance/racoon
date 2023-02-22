import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent } from '@storyblok/react'
import { mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SbBaseBlockProps, StoryblokAsset, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { ImageBlock, ImageBlockProps } from './ImageBlock'

type Orientation = 'vertical' | 'fluid'
type TextAlignment = 'top' | 'center' | 'bottom'
type ImagePlacement = 'left' | 'right'

const DEFAULT_ORIENTATION: Orientation = 'vertical'
const DEFAULT_TEXT_ALIGNMENT: TextAlignment = 'top'
const DEFAULT_IMAGE_PLACEMENT: ImagePlacement = 'right'

type ImageTextBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  imageBlock: ExpectedBlockType<ImageBlockProps>
  body?: SbBlokData[]
  orientation?: Orientation
  textAlignment?: TextAlignment
  imagePlacement?: ImagePlacement
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  const { orientation = DEFAULT_ORIENTATION } = blok
  // We only expect only one image from Storyblok
  const imageBlock = filterByBlockType(blok.imageBlock, ImageBlock.blockName)[0]

  switch (orientation) {
    case 'fluid':
      return (
        <FluidImageTextBlock
          imageBlock={imageBlock}
          body={blok.body}
          textAlignment={blok.textAlignment}
          imagePlacement={blok.imagePlacement}
        />
      )
    case 'vertical':
      return <VerticalImageTextBlock imageBlock={imageBlock} body={blok.body} />
    default:
      console.warn(`orientation type '${orientation}' is not valid`)
      return null
  }
}
ImageTextBlock.blockName = 'imageText'

type VerticalImageTextBlockProps = Pick<ImageTextBlockProps['blok'], 'body'> & {
  imageBlock?: ImageBlockProps['blok']
}

const VerticalImageTextBlock = ({ imageBlock, body }: VerticalImageTextBlockProps) => {
  return (
    <VerticalImageTextBlockWrapper>
      {imageBlock && <ImageBlock key={imageBlock._uid} blok={imageBlock} nested={true} />}
      <VerticalBodyWrapper>
        {body?.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
        ))}
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

const VerticalBodyWrapper = styled.div({
  padding: theme.space.xs,

  [mq.md]: {
    paddingBlock: theme.space.md,
  },
})

type FluidImageTextBlockProps = Pick<
  ImageTextBlockProps['blok'],
  'body' | 'textAlignment' | 'imagePlacement'
> & { imageBlock?: ImageBlockProps['blok'] }

const FluidImageTextBlock = ({
  imageBlock,
  body,
  textAlignment = DEFAULT_TEXT_ALIGNMENT,
  imagePlacement = DEFAULT_IMAGE_PLACEMENT,
}: FluidImageTextBlockProps) => {
  return (
    <FluidImageTextBlockWrapper>
      {imageBlock && (
        <GridLayout.Content width="1/2">
          <ImageBlock key={imageBlock._uid} blok={imageBlock} nested={true} />
        </GridLayout.Content>
      )}
      <FluidBodyWrapper textAlignment={textAlignment} imagePlacement={imagePlacement}>
        <div>
          {body?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
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
