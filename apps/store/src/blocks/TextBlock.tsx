import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { UIColors, Text, FontSizes } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { linkStyles } from './RichTextBlock/RichTextBlock.styles'

type TextColor = keyof Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textTertiary'>

export type TextBlockProps = SbBaseBlockProps<{
  body: ISbRichtext
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
      color={blok.color ?? 'textPrimary'}
      y={1}
      size={fontSizes}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  )
}

const StyledText = styled(Text)(linkStyles)

TextBlock.blockName = 'text'
