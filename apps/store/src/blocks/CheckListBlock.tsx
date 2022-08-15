import styled from '@emotion/styled'
import { SbBlokData, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { TextBlock, TextBlockProps } from '@/blocks/TextBlock'
import * as CheckList from '@/components/CheckList/CheckList'
import { SbBaseBlockProps, StoryblokBlockName } from '@/services/storyblok/storyblok'

type CheckListBlockProps = SbBaseBlockProps<{
  items: Array<SbBlokData>
}>

export const CheckListBlock = ({ blok }: CheckListBlockProps) => {
  const items = useMemo(() => blok.items.filter(isTextBlock), [blok.items])

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <CheckList.Root>
        {items.map((item) => (
          <CheckList.Item key={item._uid}>
            <TextBlock blok={item} />
          </CheckList.Item>
        ))}
      </CheckList.Root>
    </Wrapper>
  )
}

const isTextBlock = (blok: SbBlokData): blok is TextBlockProps['blok'] => {
  return blok.component === StoryblokBlockName.Text
}

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
