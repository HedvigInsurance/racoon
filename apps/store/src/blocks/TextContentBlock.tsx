import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { mq, Space, theme } from 'ui'
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
      <TextWrapper y={1} alignment={blok.alignment ?? 'left'}>
        {blok.body?.map((nestedBlock) => (
          <StoryblokComponent
            key={nestedBlock._uid}
            blok={{ ...nestedBlock, ...{ nested: true } }}
          />
        ))}
      </TextWrapper>
    </Wrapper>
  )
}
TextContentBlock.blockName = 'textContent'

const Wrapper = styled(GridLayout.Root)({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})

const TextWrapper = styled(Space)<{ alignment: Alignment }>(({ alignment }) => ({
  gridColumn: '1 / span 12',
  textAlign: alignment,

  [mq.md]: {
    gridColumn: '2 / span 10',
  },

  [mq.lg]: {
    gridColumn: '3 / span 8',
  },
}))
