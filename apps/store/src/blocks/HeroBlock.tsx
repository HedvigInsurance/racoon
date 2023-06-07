import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { ButtonBlock, ButtonBlockProps } from '@/blocks/ButtonBlock'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type HeroBlockProps = SbBaseBlockProps<{
  background: StoryblokAsset
  backgroundLandscape: StoryblokAsset
  buttons: ExpectedBlockType<ButtonBlockProps>
  content: SbBlokData[]
  heightPortrait?: string
  heightLandscape?: string
}>

export const HeroBlock = ({ blok }: HeroBlockProps) => {
  const buttonBlocks = filterByBlockType(blok.buttons, ButtonBlock.blockName)

  return (
    <HeroSection
      {...storyblokEditable(blok)}
      heightPortrait={blok.heightPortrait}
      heightLandscape={blok.heightLandscape}
    >
      <HeroImageWrapper>
        <HeroImage
          priority
          src={blok.background.filename}
          alt={blok.background.alt}
          data-portrait-image={!!blok.backgroundLandscape.filename}
          fill
        />
        {blok.backgroundLandscape.filename && (
          <HeroImageLandscape
            priority
            src={blok.backgroundLandscape.filename}
            alt={blok.backgroundLandscape.alt}
            fill
          />
        )}
      </HeroImageWrapper>
      <HeroContent>
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
HeroBlock.blockName = 'hero'

const HeroSection = styled.section(
  ({
    heightPortrait,
    heightLandscape,
  }: Pick<HeroBlockProps['blok'], 'heightPortrait' | 'heightLandscape'>) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: theme.space[9],
    paddingBottom: theme.space[9],

    ['@media (orientation: portrait)']: {
      ...(heightPortrait && { minHeight: `${heightPortrait}vh` }),
    },
    ['@media (orientation: landscape)']: {
      ...(heightLandscape && { minHeight: `${heightLandscape}vh` }),
    },
  }),
)

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

const HeroContent = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexGrow: 1,
})
