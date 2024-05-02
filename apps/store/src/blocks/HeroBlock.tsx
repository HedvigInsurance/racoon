'use client'

import styled from '@emotion/styled'
import type { SbBlokData } from '@storyblok/react'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import type { ButtonBlockProps } from '@/blocks/ButtonBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import type {
  ExpectedBlockType,
  SbBaseBlockProps,
  StoryblokAsset,
} from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type VerticalAlignment = 'top' | 'center' | 'bottom'

type HeroBlockProps = SbBaseBlockProps<{
  background?: StoryblokAsset
  backgroundLandscape?: StoryblokAsset
  buttons: ExpectedBlockType<ButtonBlockProps>
  content: Array<SbBlokData>
  heightPortrait?: string
  heightLandscape?: string
  verticalAlignment?: VerticalAlignment
  priority?: boolean
}>

export const HeroBlock = ({ blok }: HeroBlockProps) => {
  const buttonBlocks = filterByBlockType(blok.buttons, ButtonBlock.blockName)
  const background = blok.background?.filename ? blok.background : undefined
  const backgroundLandscape = blok.backgroundLandscape?.filename
    ? blok.backgroundLandscape
    : undefined

  return (
    <HeroSection
      {...storyblokEditable(blok)}
      heightPortrait={blok.heightPortrait}
      heightLandscape={blok.heightLandscape}
    >
      <HeroImageWrapper>
        {background && (
          <HeroImage
            priority={blok.priority}
            src={background.filename}
            alt={background.alt}
            data-portrait-image={!!backgroundLandscape}
            fill
          />
        )}
        {backgroundLandscape && (
          <HeroImageLandscape
            priority={blok.priority}
            src={backgroundLandscape.filename}
            alt={backgroundLandscape.alt}
            fill
          />
        )}
      </HeroImageWrapper>
      <HeroContent verticalAlignment={blok.verticalAlignment}>
        <div>
          {blok.content.map((nestedBlock) => (
            <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </div>
        <div>
          {buttonBlocks.map((nestedBlock) => (
            <ButtonBlock blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </div>
      </HeroContent>
    </HeroSection>
  )
}

const HeroSection = styled.section<
  Pick<HeroBlockProps['blok'], 'heightPortrait' | 'heightLandscape'>
>(({ heightPortrait, heightLandscape }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  ['@media (orientation: portrait)']: {
    ...(heightPortrait && { minHeight: `${heightPortrait}vh` }),
  },
  ['@media (orientation: landscape)']: {
    ...(heightLandscape && { minHeight: `${heightLandscape}vh` }),
  },
}))

const HeroImageWrapper = styled.div({
  zIndex: '-1',
})

const HeroImage = styled(ImageWithPlaceholder)({
  objectFit: 'cover',
  objectPosition: 'center',

  '&[data-portrait-image="true"]': {
    ['@media (orientation: portrait)']: { display: 'block' },
    ['@media (orientation: landscape)']: { display: 'none' },
  },
})

const HeroImageLandscape = styled(HeroImage)({
  ['@media (orientation: portrait)']: { display: 'none' },
  ['@media (orientation: landscape)']: { display: 'block' },
})

const HeroContent = styled.div<Pick<HeroBlockProps['blok'], 'verticalAlignment'>>(
  ({ verticalAlignment }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: getAlignmentStyles(verticalAlignment),
    flexGrow: 1,
  }),
)

const getAlignmentStyles = (alignment: VerticalAlignment | undefined) => {
  switch (alignment) {
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
