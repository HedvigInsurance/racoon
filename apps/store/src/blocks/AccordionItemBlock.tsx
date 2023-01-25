import styled from '@emotion/styled'
import { storyblokEditable, renderRichText, ISbRichtext } from '@storyblok/react'
import { useId } from 'react'
import { Text, theme } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type AccordionItemBlockProps = SbBaseBlockProps<{
  title: string
  body: ISbRichtext
}>

export const AccordionItemBlock = ({ blok }: AccordionItemBlockProps) => {
  const defaultId = useId()
  const contentHtml = renderRichText(blok.body)
  return (
    <Accordion.Item value={blok._uid || defaultId} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>
        <Text size={{ _: 'md', md: 'xl' }}>{blok.title}</Text>
      </Accordion.HeaderWithTrigger>
      <Accordion.Content asChild>
        <RichTextContent dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Accordion.Content>
    </Accordion.Item>
  )
}
AccordionItemBlock.blockName = 'accordionItem'

const RichTextContent = styled.div({
  '& b': {
    fontWeight: 'bold',
  },
  '& i': {
    fontStyle: 'italic',
  },
  '& strike': {
    textDecoration: 'line-through',
  },
  '& u': {
    textDecoration: 'underline',
  },
  '& :where(ul, ol)': {
    paddingLeft: theme.space.xl,
    marginBlock: theme.space.md,
  },
  '& ul': {
    listStyle: 'disc',
  },
  '& ol': {
    listStyle: 'decimal',
  },
})
