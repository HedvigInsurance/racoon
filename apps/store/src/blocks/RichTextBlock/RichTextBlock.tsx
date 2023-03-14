import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { Layout } from '../TextContentBlock'
import { richTextStyles, listStyling } from './RichTextBlock.styles'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: ISbRichtext
  layout?: Layout
}>

export const RichTextBlock = ({ blok }: RichTextBlockProps) => {
  const contentHtml = useMemo(() => renderRichText(blok.content), [blok.content])

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <Content
        width={blok.layout?.widths ?? { base: '1', md: '2/3', xl: '1/2' }}
        align={blok.layout?.alignment ?? 'center'}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </GridLayout.Root>
  )
}
RichTextBlock.blockName = 'richText'

const Content = styled(GridLayout.Content)(richTextStyles, listStyling)
