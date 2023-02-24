import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { HeadingBlockProps } from './HeadingBlock'
import { HeadingLabelBlockProps } from './HeadingLabelBlock'
import { TextBlockProps } from './TextBlock'

type Alignment = 'left' | 'center' | 'right' | 'justify'

export type Props = SbBaseBlockProps<{
  heading?: ExpectedBlockType<HeadingBlockProps | HeadingLabelBlockProps>
  body: ExpectedBlockType<TextBlockProps>
  alignment?: Alignment
}>

export const TextContentBlock = ({ blok }: Props) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <GridLayout.Content
        width="2/3"
        align="center"
        style={{ textAlign: blok.alignment ?? 'left' }}
      >
        <Space y={1}>
          {blok.body?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
          ))}
        </Space>
      </GridLayout.Content>
    </Wrapper>
  )
}
TextContentBlock.blockName = 'textContent'

const Wrapper = styled(GridLayout.Root)({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
