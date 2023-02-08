import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { UIColors, Text, FontSizes } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type TextColor = keyof Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textTertiary'>

export type TextBlockProps = SbBaseBlockProps<{
  body: ISbRichtext
  color?: TextColor
  fontSize?: FontSizes
  fontSizeDesktop?: FontSizes
}>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])
  const fontSizes = {
    _: blok.fontSize ?? 'md',
    ...(blok.fontSizeDesktop && { md: blok.fontSizeDesktop }),
  }
  return (
    <Text
      {...storyblokEditable(blok)}
      as="div"
      color={blok.color ?? 'textPrimary'}
      y={1}
      size={fontSizes}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  )
}
TextBlock.blockName = 'text'
