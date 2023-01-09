import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type TextBlockProps = SbBaseBlockProps<{ body: ISbRichtext }>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])
  return (
    <Space {...storyblokEditable(blok)} y={1} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  )
}
TextBlock.blockName = 'text'
