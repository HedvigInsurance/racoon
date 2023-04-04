import styled from '@emotion/styled'
import { storyblokEditable, renderRichText, ISbRichtext } from '@storyblok/react'
import { useId } from 'react'
import { Text, mq, theme } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { RichTextContent } from '@/components/RichTextContent/RichTextContent'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type AccordionItemBlockProps = SbBaseBlockProps<{
  title: string
  body: ISbRichtext
}> & { openedItem?: string }

export const AccordionItemBlock = ({ blok, openedItem }: AccordionItemBlockProps) => {
  const defaultId = useId()
  const contentHtml = renderRichText(blok.body)
  const value = blok._uid || defaultId

  return (
    <Accordion.Item value={value} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>
        <Text size={{ _: 'md', md: 'lg' }}>{blok.title}</Text>
      </Accordion.HeaderWithTrigger>
      <Accordion.Content opened={openedItem === value}>
        <ContentWrapper>
          <RichTextContent dangerouslySetInnerHTML={{ __html: contentHtml }} />
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
