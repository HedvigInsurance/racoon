import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, HeadingProps, PossibleHeadingVariant, theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export const Wrapper = styled.div({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})

export type HeadingBlockProps = SbBaseBlockProps<{
  text: string
  as: HeadingProps['as']
  color: HeadingProps['color']
  variant?: PossibleHeadingVariant
  variantDesktop?: PossibleHeadingVariant
  textAlignment?: HeadingProps['align']
}>

export const HeadingBlock = ({ blok }: HeadingBlockProps) => {
  return (
    <Wrapper>
      <Heading
        as={blok.as}
        variant={{ _: blok.variant ?? 'standard.32', md: blok.variantDesktop ?? 'standard.40' }}
        color={blok.color}
        align={blok.textAlignment}
        {...storyblokEditable(blok)}
      >
        {blok.text}
      </Heading>
    </Wrapper>
  )
}
HeadingBlock.blockName = 'heading'
