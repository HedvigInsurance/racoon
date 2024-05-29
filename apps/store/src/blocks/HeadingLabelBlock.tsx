'use client'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import type { BadgeProps } from 'ui'
import { ConditionalWrapper, Badge, theme } from 'ui'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export const Wrapper = styled.div({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})

export type HeadingLabelBlockProps = SbBaseBlockProps<{
  text: string
  as: BadgeProps['as']
}>

export const HeadingLabelBlock = ({ blok, nested }: HeadingLabelBlockProps) => {
  return (
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <Badge as={blok.as} {...storyblokEditable(blok)}>
        {blok.text}
      </Badge>
    </ConditionalWrapper>
  )
}
