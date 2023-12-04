import styled from '@emotion/styled'
import { ISbRichtext, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Text, theme, UIColors, FontSizes } from 'ui'
import { listStyles, nestedLinkStyles } from '@/components/RichText/RichText.styles'
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
    <StyledText
      {...storyblokEditable(blok)}
      as="div"
      align={blok.textAlignment}
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
