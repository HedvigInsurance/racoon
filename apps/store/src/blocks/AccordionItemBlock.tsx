import { storyblokEditable, renderRichText, ISbRichtext } from '@storyblok/react'
import { useId } from 'react'
import { Text } from 'ui'
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
      <Accordion.Content>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Accordion.Content>
    </Accordion.Item>
  )
}
AccordionItemBlock.blockName = 'accordionItem'
