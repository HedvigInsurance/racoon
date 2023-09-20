import styled from '@emotion/styled'
import { ISbRichtext, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Text, getColor, UIColors, FontSizes } from 'ui'
import { RichText } from '@/components/RichText/RichText'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichText } from './RichTextBlock/RichTextBlock'

type TextColor = keyof Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textTertiary'>

export type TextBlockProps = SbBaseBlockProps<{
  body: ISbRichtext
  balance?: boolean
  color?: TextColor
  fontSize?: FontSizes
  fontSizeDesktop?: FontSizes
  textAlignment?: 'left' | 'center' | 'right'
}>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const content = useMemo(() => renderRichText(blok.body), [blok.body])
  const fontSizes = {
    _: blok.fontSize ?? 'md',
    ...(blok.fontSizeDesktop && { md: blok.fontSizeDesktop }),
  }
  return (
    <Text
      {...storyblokEditable(blok)}
      as="div"
      align={blok.textAlignment}
      balance={blok.balance}
      color={blok.color ?? 'textPrimary'}
      size={fontSizes}
    >
      <StyledRichText color={blok.color ?? 'textSecondary'}>{content}</StyledRichText>
    </Text>
  )
}

const StyledRichText = styled(RichText)<{ color: TextColor }>(({ color }) => ({
  fontSize: 'inherit',

  p: {
    color: 'inherit',
    fontSize: 'inherit',
  },
  'h2, h3, h4': {
    color: 'inherit',
    fontSize: 'inherit',
  },
  'ul li': {
    '&::before': {
      backgroundColor: getColor(color),
    },
  },
  'ol li': {
    '::marker': {
      color: 'inherit',
    },
  },
}))

TextBlock.blockName = 'text'
