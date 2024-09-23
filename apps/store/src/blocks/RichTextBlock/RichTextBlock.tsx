'use client'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { type StoryblokRichTextNode } from '@storyblok/richtext'
import { useMemo } from 'react'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { RichText } from '@/components/RichText/RichText'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichTextToJsx } from './richTextReactRenderer'

export type RichTextBlockProps = SbBaseBlockProps<{
  content: StoryblokRichTextNode
  layout?: GridColumnsField
  largeText?: boolean
}>

export const RichTextBlock = ({ blok, nested }: RichTextBlockProps) => {
  const content = useMemo(() => renderRichTextToJsx(blok.content), [blok.content])

  if (nested) {
    return <NestedRichText largeText={blok.largeText}>{content}</NestedRichText>
  }

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1', md: '2/3', xl: '1/2' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        <RichText largeText={blok.largeText}>{content}</RichText>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
RichTextBlock.blockName = 'richText'

const NestedRichText = styled(RichText)({
  ':is([data-large-text=true], &) :is(h2, h3, h4):first-of-type': {
    marginTop: 0,
  },
})
