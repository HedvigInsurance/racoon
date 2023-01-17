import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space, UIColors, getColor } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type TextColor = keyof Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textTertiary'>

export type TextBlockProps = SbBaseBlockProps<{ body: ISbRichtext; color?: TextColor }>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])
  return (
    <Text
      {...storyblokEditable(blok)}
      color={blok.color ?? 'textPrimary'}
      y={1}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  )
}
TextBlock.blockName = 'text'

const Text = styled(Space)<{ color: TextColor }>(({ color }) => ({
  color: getColor(color),
}))
