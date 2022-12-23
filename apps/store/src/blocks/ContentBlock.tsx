import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type Props = SbBaseBlockProps<{
  body: ISbRichtext
}>

export const ContentBlock = ({ blok }: Props) => {
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Space y={1} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Wrapper>
  )
}
ContentBlock.blockName = 'content'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  textAlign: 'center',
}))
