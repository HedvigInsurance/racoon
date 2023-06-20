import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent } from '@storyblok/react'
import { ConditionalWrapper, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SbBaseBlockProps, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { ImageBlockProps } from './ImageBlock'
import { VideoBlockProps } from './VideoBlock'

type Orientation = 'vertical' | 'fluid'
type TextAlignment = 'top' | 'center' | 'bottom'
type TextHorizontalAlignment = 'left' | 'center' | 'right'
type ImagePlacement = 'left' | 'right'
type MediaPlacementMobile = 'top' | 'bottom'

const DEFAULT_ORIENTATION: Orientation = 'vertical'
const DEFAULT_TEXT_ALIGNMENT: TextAlignment = 'top'
const DEFAULT_TEXT_HORIZONTAL_ALIGNMENT: TextHorizontalAlignment = 'left'
const DEFAULT_IMAGE_PLACEMENT: ImagePlacement = 'right'
const DEFAULT_MEDIA_PLACEMENT_MOBILE: MediaPlacementMobile = 'top'

export type ImageTextBlockProps = SbBaseBlockProps<{
  // TODO: Remove image field after content migration
  image: ExpectedBlockType<ImageBlockProps | VideoBlockProps>
  media: ExpectedBlockType<ImageBlockProps | VideoBlockProps>
  body?: SbBlokData[]
  orientation?: Orientation
  // TODO: rename this to 'textVerticalAlignment'
  textAlignment?: TextAlignment
  textHorizontalAlignment?: TextHorizontalAlignment
  imagePlacement?: ImagePlacement
  mediaPlacementMobile?: MediaPlacementMobile
  minHeightMobile?: string
}>

export const ImageTextBlock = ({ blok, nested }: ImageTextBlockProps) => {
  const { orientation = DEFAULT_ORIENTATION } = blok
  // We expect only one media object from Storyblok
  const imageBlock = Array.isArray(blok.image) ? blok.image[0] : undefined
  const mediaBlock = Array.isArray(blok.media) ? blok.media[0] : undefined

  switch (orientation) {
    case 'fluid':
      return (
        <FluidImageTextBlock
          mediaBlock={mediaBlock}
          imageBlock={imageBlock}
          body={blok.body}
          textAlignment={blok.textAlignment}
          textHorizontalAlignment={blok.textHorizontalAlignment}
          imagePlacement={blok.imagePlacement}
          mediaPlacementMobile={blok.mediaPlacementMobile}
          minHeightMobile={blok.minHeightMobile}
          nested={nested}
        />
      )
    case 'vertical':
      return (
        <VerticalImageTextBlock
          mediaBlock={mediaBlock}
          imageBlock={imageBlock}
          body={blok.body}
          nested={nested}
        />
      )
    default:
      console.warn(`orientation type '${orientation}' is not valid`)
      return null
  }
}
ImageTextBlock.blockName = 'imageText'

type VerticalImageTextBlockProps = Pick<ImageTextBlockProps['blok'], 'body' | 'nested'> & {
  imageBlock?: ImageBlockProps['blok'] | VideoBlockProps['blok']
  mediaBlock?: ImageBlockProps['blok'] | VideoBlockProps['blok']
}

const VerticalImageTextBlock = ({
  mediaBlock,
  imageBlock,
  body,
  nested,
}: VerticalImageTextBlockProps) => {
  return (
    <ConditionalWrapper
      condition={!nested}
      wrapWith={(children) => <ImageTextBlockWrapper>{children}</ImageTextBlockWrapper>}
    >
      {mediaBlock && <StoryblokComponent key={mediaBlock._uid} blok={mediaBlock} nested={true} />}
      {imageBlock && <StoryblokComponent key={imageBlock._uid} blok={imageBlock} nested={true} />}
      <VerticalBodyWrapper>
        {body?.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
        ))}
      </VerticalBodyWrapper>
    </ConditionalWrapper>
  )
}

const VerticalBodyWrapper = styled.div({
  padding: theme.space.xs,

  [mq.md]: {
    paddingBlock: theme.space.md,
  },
})

type FluidImageTextBlockProps = Pick<
  ImageTextBlockProps['blok'],
  | 'body'
  | 'textAlignment'
  | 'textHorizontalAlignment'
  | 'imagePlacement'
  | 'mediaPlacementMobile'
  | 'minHeightMobile'
  | 'nested'
> & {
  imageBlock?: ImageBlockProps['blok'] | VideoBlockProps['blok']
  mediaBlock?: ImageBlockProps['blok'] | VideoBlockProps['blok']
}

const FluidImageTextBlock = ({
  mediaBlock,
  imageBlock,
  body,
  textAlignment = DEFAULT_TEXT_ALIGNMENT,
  textHorizontalAlignment = DEFAULT_TEXT_HORIZONTAL_ALIGNMENT,
  imagePlacement = DEFAULT_IMAGE_PLACEMENT,
  mediaPlacementMobile = DEFAULT_MEDIA_PLACEMENT_MOBILE,
  minHeightMobile,
  nested,
}: FluidImageTextBlockProps) => {
  return (
    <ConditionalWrapper
      condition={!nested}
      wrapWith={(children) => <ImageTextBlockWrapper>{children}</ImageTextBlockWrapper>}
    >
      <FluidImageTextBlockGrid>
        {mediaBlock && (
          <GridLayout.Content width="1/2">
            <StoryblokComponent key={mediaBlock._uid} blok={mediaBlock} nested={true} />
          </GridLayout.Content>
        )}
        {imageBlock && (
          <GridLayout.Content width="1/2">
            <StoryblokComponent key={imageBlock._uid} blok={imageBlock} nested={true} />
          </GridLayout.Content>
        )}
        <FluidBodyWrapper
          imagePlacement={imagePlacement}
          mediaPlacementMobile={mediaPlacementMobile}
          textAlignment={textAlignment}
          textHorizontalAlignment={textHorizontalAlignment}
          minHeightMobile={minHeightMobile}
        >
          <FluidBodyInnerWrapper>
            {body?.map((nestedBlock) => (
              <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
            ))}
          </FluidBodyInnerWrapper>
        </FluidBodyWrapper>
      </FluidImageTextBlockGrid>
    </ConditionalWrapper>
  )
}

const FluidImageTextBlockGrid = styled(GridLayout.Root)({
  rowGap: theme.space.md,
  '&&': {
    padding: 0,
  },

  [mq.lg]: {
    columnGap: theme.space.xxxl,
  },
})

const ImageTextBlockWrapper = styled.div({
  paddingInline: theme.space.xs,

  [mq.md]: {
    paddingInline: theme.space.md,
  },
})

export const FluidBodyWrapper = styled.div<{
  textAlignment: TextAlignment
  textHorizontalAlignment: TextHorizontalAlignment
  imagePlacement: ImagePlacement
  mediaPlacementMobile: MediaPlacementMobile
  minHeightMobile?: string
}>(
  ({
    textAlignment,
    textHorizontalAlignment,
    imagePlacement,
    mediaPlacementMobile,
    minHeightMobile,
  }) => ({
    gridColumn: '1 / -1',
    order: mediaPlacementMobile === 'bottom' ? -1 : 'initial',

    ...(minHeightMobile && {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: `${minHeightMobile}vh`,
    }),

    [mq.lg]: {
      gridColumn: 'span 6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: getTextAlignmentStyles(textHorizontalAlignment),
      justifyContent: getTextAlignmentStyles(textAlignment),
      order: imagePlacement === 'right' ? -1 : 'initial',
      minHeight: 'initial',
    },
  }),
)

const FluidBodyInnerWrapper = styled.div({
  paddingInline: theme.space.xs,

  [mq.lg]: {
    paddingInline: 0,
    maxWidth: '37.5rem',
  },
})

const getTextAlignmentStyles = (alignment: TextAlignment | TextHorizontalAlignment) => {
  switch (alignment) {
    case 'top':
    case 'left':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'bottom':
    case 'right':
      return 'flex-end'
    default:
      return 'initial'
  }
}
