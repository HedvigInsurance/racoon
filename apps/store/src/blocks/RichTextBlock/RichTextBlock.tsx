import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { Layout } from '../TextContentBlock'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: ISbRichtext
  layout?: Layout
  largeText?: boolean
}>

export const RichTextBlock = ({ blok }: RichTextBlockProps) => {
  const contentHtml = useMemo(() => renderRichText(blok.content), [blok.content])

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1', md: '2/3', xl: '1/2' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        <RichText contentHTML={contentHtml} largeText={blok.largeText} />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
RichTextBlock.blockName = 'richText'
