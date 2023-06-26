import styled from '@emotion/styled'
import { storyblokEditable, renderRichText, ISbRichtext } from '@storyblok/react'
import { useId } from 'react'
import { Text, mq, theme } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { richTextStyles } from '@/components/RichText/RichText.styles'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

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
  paddingTop: theme.space.xxs,
  paddingBottom: theme.space.md,

  [mq.lg]: {
    paddingTop: 0,
    paddingBottom: theme.space.lg,
  },
})

const Content = styled.div(richTextStyles, {
  p: {
    marginBlock: 0,
    color: theme.colors.textSecondaryOnGray,
  },

  a: {
    textDecorationColor: theme.colors.gray500,
  },

  '& > *:not(:last-of-type)': {
    marginBottom: theme.space.md,
  },
})
