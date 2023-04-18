import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ContentAlignment, ContentWidth } from '@/components/GridLayout/GridLayout.helper'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { HeadingBlockProps } from './HeadingBlock'
import { HeadingLabelBlockProps } from './HeadingLabelBlock'
import { TextBlockProps } from './TextBlock'

export type Layout = {
  widths: ContentWidth
  alignment: ContentAlignment
}

export type Props = SbBaseBlockProps<{
  heading?: ExpectedBlockType<HeadingBlockProps | HeadingLabelBlockProps>
  body: ExpectedBlockType<TextBlockProps>
  layout?: Layout
}>

export const TextContentBlock = ({ blok }: Props) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? '2/3'}
        align={blok.layout?.alignment ?? 'center'}
      >
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
        ))}
      </GridLayout.Content>
    </Wrapper>
  )
}
TextContentBlock.blockName = 'textContent'

const Wrapper = styled(GridLayout.Root)({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
