import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import { ButtonBlock, ButtonBlockProps } from '@/blocks/ButtonBlock'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokImage } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type HeroBlockProps = SbBaseBlockProps<{
  content: ExpectedBlockType<HeadingBlockProps>
  background: StoryblokImage
  buttons: ExpectedBlockType<ButtonBlockProps>
}>

export const HeroBlock = ({ blok }: HeroBlockProps) => {
  const headingBlocks = filterByBlockType(blok.content, HeadingBlock.blockName)
  const buttonBlocks = filterByBlockType(blok.buttons, ButtonBlock.blockName)

  return (
    <HeroSection {...storyblokEditable(blok)}>
      <HeroImageWrapper>
        <HeroImage
          priority
          src={blok.background.filename}
          alt={blok.background.alt}
          fill
          sizes="100vw"
        />
      </HeroImageWrapper>
      <HeroContent>
        <div>
          {headingBlocks.map((nestedBlock) => (
            <HeadingBlock blok={nestedBlock} key={nestedBlock._uid} />
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

const HeroSection = styled.section(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '80vh',
  paddingTop: theme.space[9],
  paddingBottom: theme.space[9],
}))

const HeroImageWrapper = styled.div({
  zIndex: '-1',
})

const HeroImage = styled(Image)({
  objectFit: 'cover',
  objectPosition: 'center',
})

const HeroContent = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexGrow: 1,
  textAlign: 'center',
})
