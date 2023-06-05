import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { UIColors, Text, FontSizes, Space } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { nestedLinkStyles } from './RichTextBlock/RichTextBlock.styles'

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
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])
  const fontSizes = {
    _: blok.fontSize ?? 'md',
    ...(blok.fontSizeDesktop && { md: blok.fontSizeDesktop }),
  }
  return (
    <StyledText
      {...storyblokEditable(blok)}
      as="div"
      align={blok.textAlignment}
      balance={blok.balance}
      color={blok.color ?? 'textPrimary'}
      size={fontSizes}
    >
      <Space y={1} dangerouslySetInnerHTML={{ __html: contentHtml }}></Space>
    </StyledText>
  )
}

const StyledText = styled(Text)(nestedLinkStyles)

TextBlock.blockName = 'text'
