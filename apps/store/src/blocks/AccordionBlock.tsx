import styled from '@emotion/styled'
import { storyblokEditable, renderRichText } from '@storyblok/react'
import Head from 'next/head'
import { Heading, Text, theme, mq } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
import { Wrapper as TabsBlockWrapper } from '@/blocks/TabsBlock'
import * as Accordion from '@/components/Accordion/Accordion'
import { GridLayout, TEXT_CONTENT_MAX_WIDTH } from '@/components/GridLayout/GridLayout'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = SbBaseBlockProps<{
  items: ExpectedBlockType<AccordionItemBlockProps>
  title?: string
  description?: string
  isFAQ?: boolean
}>

export const AccordionBlock = ({ blok }: Props) => {
  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  const enableFAQStructuredData = blok.isFAQ ?? false
  const displayTitleDescriptionSection = blok.title || blok.description

  return (
    <>
      {enableFAQStructuredData && (
        <Head>
          <script key="accordion-faq-sctructured-data" type="application/ld+json">
            {getFAQStructuredData(accordionItems)}
          </script>
        </Head>
      )}
      <Wrapper {...storyblokEditable(blok)}>
        {displayTitleDescriptionSection && (
          <GridLayout.Content width="1/2" align="left">
            <TextContent>
              {blok.title && (
                <Heading as="h2" variant={{ _: 'standard.24', md: 'standard.32' }}>
                  {blok.title}
                </Heading>
              )}
              {blok.description && (
                <Text color="textSecondary" size={{ _: 'xl', md: 'xxl' }}>
                  {blok.description}
                </Text>
              )}
            </TextContent>
          </GridLayout.Content>
        )}
        <GridLayout.Content width="1/2" align={displayTitleDescriptionSection ? 'right' : 'center'}>
          <Accordion.Root type="single" collapsible>
            {accordionItems.map((nestedBlock) => (
              <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
            ))}
          </Accordion.Root>
        </GridLayout.Content>
      </Wrapper>
    </>
  )
}
AccordionBlock.blockName = 'accordion'

const Wrapper = styled(GridLayout.Root)({
  // TODO: harmonize with other grid layouts
  gap: theme.space.lg,
  [mq.lg]: {
    gap: theme.space.md,
    paddingInline: theme.space.lg,
  },

  [`${TabsBlockWrapper} &`]: {
    all: 'unset',
  },
})

const TextContent = styled.div({
  maxWidth: TEXT_CONTENT_MAX_WIDTH,

  [mq.lg]: {
    paddingRight: theme.space.xl,
  },
})

const getFAQStructuredData = (
  accordions: ReadonlyArray<Pick<AccordionItemBlockProps['blok'], 'title' | 'body'>>,
) => {
  return JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'FAQPage',
    mainEntity: accordions.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: renderRichText(item.body),
      },
    })),
  })
}
