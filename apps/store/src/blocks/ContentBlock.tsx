import styled from '@emotion/styled'
import { ISbRichtext, renderRichText, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Space, HeadingLabel, mq, theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Alignment = 'left' | 'center' | 'right' | 'justify'

export type Props = SbBaseBlockProps<{
  body: ISbRichtext
  heading?: string
  alignment?: Alignment
}>

export const ContentBlock = ({ blok }: Props) => {
  const contentHtml = useMemo(() => renderRichText(blok.body), [blok.body])

  return (
    <Wrapper {...storyblokEditable(blok)} y={1}>
      {blok.heading && <HeadingLabel>{blok.heading}</HeadingLabel>}
      <TextWrapper alignment={blok.alignment ?? 'left'}>
        <Space y={1} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </TextWrapper>
    </Wrapper>
  )
}
ContentBlock.blockName = 'content'

const Wrapper = styled(Space)({
  maxWidth: '37.5rem',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
})

const TextWrapper = styled.div<{ alignment: Alignment }>(({ alignment }) => ({
  fontSize: theme.fontSizes.xl,
  textAlign: alignment,

  [mq.md]: {
    fontSize: theme.fontSizes.xxl,
  },
}))
