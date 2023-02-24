import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ConditionalWrapper, Heading, HeadingProps, PossibleHeadingVariant, theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { VerticalBodyWrapper, FluidBodyWrapper } from './ImageTextBlock'

const Wrapper = styled.div({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,

  [`${VerticalBodyWrapper} &, ${FluidBodyWrapper} &`]: {
    padding: 0,
  },
})

export type HeadingBlockProps = SbBaseBlockProps<{
  text: string
  as: HeadingProps['as']
  color: HeadingProps['color']
  variant?: PossibleHeadingVariant
  variantDesktop?: PossibleHeadingVariant
  textAlignment?: HeadingProps['align']
  balance?: boolean
}>

export const HeadingBlock = ({ blok, nested }: HeadingBlockProps) => {
  return (
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <Heading
        as={blok.as}
        variant={{ _: blok.variant ?? 'standard.32', md: blok.variantDesktop ?? 'standard.40' }}
        color={blok.color}
        align={blok.textAlignment}
        balance={blok.balance}
        {...storyblokEditable(blok)}
      >
        {blok.text}
      </Heading>
    </ConditionalWrapper>
  )
}
HeadingBlock.blockName = 'heading'
