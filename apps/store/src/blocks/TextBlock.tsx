'use client'

import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { type StoryblokRichTextNode } from '@storyblok/richtext'
import { useMemo } from 'react'
import { Text, theme, type UIColors, type FontSizes } from 'ui'
import { listStyles, nestedLinkStyles } from '@/components/RichText/RichText.styles'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichTextToJsx } from './RichTextBlock/richTextReactRenderer'

type TextColor = keyof Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textTertiary'>

export type TextBlockProps = SbBaseBlockProps<{
  body: StoryblokRichTextNode
  balance?: boolean
  color?: TextColor
  fontSize?: FontSizes
  fontSizeDesktop?: FontSizes
  textAlignment?: 'left' | 'center' | 'right' | ''
}>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const content = useMemo(() => renderRichTextToJsx(blok.body), [blok.body])
  const fontSizes = {
    _: blok.fontSize ?? 'md',
    ...(blok.fontSizeDesktop && { md: blok.fontSizeDesktop }),
  }
  return (
    <StyledText
      {...storyblokEditable(blok)}
      as="div"
      align={blok.textAlignment === '' ? undefined : blok.textAlignment}
      balance={blok.balance}
      color={blok.color ?? 'textPrimary'}
      size={fontSizes}
      // TODO: handle larger text sizes
      data-large-text={blok.fontSizeDesktop === 'xl'}
    >
      {content}
    </StyledText>
  )
}

const StyledText = styled(Text)(
  {
    'p:not(:first-of-type)': {
      marginTop: theme.space.md,
    },
  },
  listStyles,
  nestedLinkStyles,
)

TextBlock.blockName = 'text'
