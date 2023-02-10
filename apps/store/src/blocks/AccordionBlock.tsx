import styled from '@emotion/styled'
import { storyblokEditable, renderRichText } from '@storyblok/react'
import Head from 'next/head'
import { Heading, Text, theme, mq } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
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
          <Column>
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
          </Column>
        )}
        <Column center={!displayTitleDescriptionSection}>
          <Accordion.Root type="multiple">
            {accordionItems.map((nestedBlock) => (
              <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
            ))}
          </Accordion.Root>
        </Column>
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
    paddingInline: theme.space.md,
  },
})

const Column = styled.div<{ center?: boolean }>(({ center = false }) => ({
  gridColumn: '1 / -1',
  [mq.lg]: {
    gridColumn: center ? '4 / span 6' : 'span 6',
  },
}))

const TextContent = styled.div({
  maxWidth: TEXT_CONTENT_MAX_WIDTH,
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
