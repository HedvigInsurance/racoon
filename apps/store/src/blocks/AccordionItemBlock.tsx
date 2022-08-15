import { getStoryblokApi, Richtext, storyblokEditable } from '@storyblok/react'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type Props = SbBaseBlockProps<{
  title: string
  body: Richtext
}>

export const AccordionItemBlock = ({ blok }: Props) => {
  const contentHtml = getStoryblokApi().richTextResolver.render(blok.body)
  return (
    <Accordion.Item value={blok._uid} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>{blok.title}</Accordion.HeaderWithTrigger>
      <Accordion.Content>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Accordion.Content>
    </Accordion.Item>
  )
}
