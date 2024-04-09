'use client'

import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import {
  type ExpectedBlockType,
  type GridColumnsField,
  type SbBaseBlockProps,
} from '@/services/storyblok/storyblok'
import type { HeadingBlockProps } from './HeadingBlock'
import type { HeadingLabelBlockProps } from './HeadingLabelBlock'
import type { TextBlockProps } from './TextBlock'

export type Props = SbBaseBlockProps<{
  heading?: ExpectedBlockType<HeadingBlockProps | HeadingLabelBlockProps>
  body: ExpectedBlockType<TextBlockProps>
  layout?: GridColumnsField
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
