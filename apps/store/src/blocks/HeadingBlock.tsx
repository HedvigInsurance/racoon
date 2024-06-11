'use client'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import type { HeadingProps, PossibleHeadingVariant } from 'ui'
import { ConditionalWrapper, Heading, theme } from 'ui'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

const Wrapper = styled.div({
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
  balance?: boolean
}>

export const HeadingBlock = ({ blok, nested }: HeadingBlockProps) => {
  // Gotcha: we may get emtpy string from Storyblok for 'color' and 'textAlignment', this should handled safely
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const color = blok.color || 'textPrimary'
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const align = blok.textAlignment || 'center'

  return (
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <Heading
        as={blok.as}
        variant={{ _: blok.variant ?? 'standard.32', md: blok.variantDesktop ?? 'standard.40' }}
        color={color}
        align={align}
        balance={blok.balance}
        {...storyblokEditable(blok)}
      >
        {blok.text}
      </Heading>
    </ConditionalWrapper>
  )
}
HeadingBlock.blockName = 'heading'
