import styled from '@emotion/styled'
import { storyblokEditable, renderRichText, ISbRichtext } from '@storyblok/react'
import { useId } from 'react'
import { Text, mq, theme } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { richTextStyles } from './RichTextBlock/RichTextBlock.styles'

export type AccordionItemBlockProps = SbBaseBlockProps<{
  title: string
  body: ISbRichtext
}> & { openItem?: string }

export const AccordionItemBlock = ({ blok, openItem }: AccordionItemBlockProps) => {
  const defaultId = useId()
  const contentHtml = renderRichText(blok.body)
  const value = blok._uid || defaultId

  return (
    <Accordion.Item value={value} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>
        <Text size={{ _: 'md', md: 'lg' }}>{blok.title}</Text>
      </Accordion.HeaderWithTrigger>
      <Accordion.Content open={openItem === value}>
        <ContentWrapper>
          <Content dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </ContentWrapper>
      </Accordion.Content>
    </Accordion.Item>
  )
}
AccordionItemBlock.blockName = 'accordionItem'

const ContentWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxs,

  [mq.lg]: {
    paddingBottom: theme.space.xs,
  },
})

const Content = styled.div(richTextStyles, {
  p: { marginBlock: 0 },
  '& > *:not(:last-of-type)': {
    marginBottom: theme.space.md,
  },
})
