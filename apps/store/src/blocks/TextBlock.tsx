import { getStoryblokApi, Richtext, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type TextBlockProps = SbBaseBlockProps<{ body: Richtext }>

export const TextBlock = ({ blok }: TextBlockProps) => {
  const contentHtml = useRichText(blok.body)
  return (
    <Space {...storyblokEditable(blok)} y={1} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  )
}

const useRichText = (body: Richtext) => {
  return useMemo(() => getStoryblokApi().richTextResolver.render(body), [body])
}
