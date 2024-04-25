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
