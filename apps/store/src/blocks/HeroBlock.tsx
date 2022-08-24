import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { SbBaseBlockProps, StoryblokImage } from '@/services/storyblok/storyblok'

type HeroBlockProps = SbBaseBlockProps<{
  content: SbBlokData[]
  background: StoryblokImage
  buttons: SbBlokData[]
}>

export const HeroBlock = ({ blok }: HeroBlockProps) => {
  return (
    <HeroSection {...storyblokEditable(blok)} bgImage={blok.background.filename}>
      <div>
        {blok.content.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </div>
      <div>
        {blok.buttons.map((button) => (
          <StoryblokComponent blok={button} key={button._uid} />
        ))}
      </div>
    </HeroSection>
  )
}
HeroBlock.blockName = 'hero'

const HeroSection = styled.section<{ bgImage: string }>(({ theme, bgImage }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '80vh',
  paddingTop: theme.space[9],
  paddingBottom: theme.space[9],
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  textAlign: 'center',
}))
