import styled from '@emotion/styled'
import { getStoryblokApi, Richtext, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type Props = SbBaseBlockProps<{
  body: Richtext
}>

export const ContentBlock = ({ blok }: Props) => {
  const contentHtml = useRichText(blok.body)
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

const useRichText = (body: Richtext) => {
  return useMemo(() => getStoryblokApi().richTextResolver.render(body), [body])
}
