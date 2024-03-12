'use client'
import { storyblokEditable, type ISbRichtext } from '@storyblok/react'
import { useId, useMemo } from 'react'
import { Text } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { RichText } from '@/components/RichText/RichText'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichText } from './RichTextBlock/RichTextBlock'

export type AccordionItemBlockProps = SbBaseBlockProps<{
  title: string
  body: ISbRichtext
}> & { openItem?: string }

export const AccordionItemBlock = ({ blok, openItem }: AccordionItemBlockProps) => {
  const defaultId = useId()
  const content = useMemo(() => renderRichText(blok.body), [blok.body])
  const value = blok._uid || defaultId

  return (
    <Accordion.Item value={value} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>
        <Text as="span" size={{ _: 'md', md: 'lg' }}>
          {blok.title}
        </Text>
      </Accordion.HeaderWithTrigger>
      <Accordion.Content open={openItem === value} asChild={true}>
        <RichText>{content}</RichText>
      </Accordion.Content>
    </Accordion.Item>
  )
}
AccordionItemBlock.blockName = 'accordionItem'
