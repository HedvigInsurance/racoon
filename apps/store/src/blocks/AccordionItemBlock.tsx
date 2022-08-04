import styled from '@emotion/styled'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps, LinkField, StoryblokImage } from '@/services/storyblok/storyblok'

export type Props = SbBaseBlockProps<{
  title: string
  body: string
}>

export const AccordionItemBlock = ({ blok }: Props) => {
  return (
    <Accordion.Item value={blok._uid}>
      <Accordion.HeaderWithTrigger>{blok.title}</Accordion.HeaderWithTrigger>
      <Accordion.Content>{blok.body}</Accordion.Content>
    </Accordion.Item>
  )
}
