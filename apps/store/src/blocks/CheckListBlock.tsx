import styled from '@emotion/styled'
import { SbBlokData, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { theme } from 'ui'
import { TextBlock, TextBlockProps } from '@/blocks/TextBlock'
import * as CheckList from '@/components/CheckList/CheckList'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type CheckListBlockProps = SbBaseBlockProps<{
  items: Array<SbBlokData>
}>

export const CheckListBlock = ({ blok }: CheckListBlockProps) => {
  // TODO: Ensure on storyblok level (acceptable child type)
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
CheckListBlock.blockName = 'checkList'

const isTextBlock = (blok: SbBlokData): blok is TextBlockProps['blok'] => {
  return blok.component === TextBlock.blockName
}

const Wrapper = styled.div({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
})
