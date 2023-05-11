import styled from '@emotion/styled'
import { storyblokEditable, renderRichText } from '@storyblok/react'
import Head from 'next/head'
import { useState, useCallback } from 'react'
import { Heading, Text, theme, mq } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
import { Wrapper as TabsBlockWrapper } from '@/blocks/TabsBlock'
import * as Accordion from '@/components/Accordion/Accordion'
import { GridLayout, TEXT_CONTENT_MAX_WIDTH } from '@/components/GridLayout/GridLayout'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { isBrowser } from '@/utils/env'

type Props = SbBaseBlockProps<{
  items: ExpectedBlockType<AccordionItemBlockProps>
  title?: string
  description?: string
  isFAQ?: boolean
  centerLayout?: boolean
}>

export const AccordionBlock = ({ blok, nested }: Props) => {
  const [openItem, setOpenItem] = useState<string>()

  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  const enableFAQStructuredData = blok.isFAQ ?? false
  const displayTitleDescriptionSection = blok.title || blok.description
  const isCentered = blok.centerLayout || !displayTitleDescriptionSection
  const FAQStructuredData = getFAQStructuredData(accordionItems)

  const handleValueChange = useCallback((value: string) => {
    setOpenItem(value)
  }, [])

  let content: React.ReactNode = null
  if (nested) {
    content = (
      <>
        {displayTitleDescriptionSection && <AccodrionTitleDescription blok={blok} />}
        <StyledAccordionRoot
          type="single"
          collapsible
          value={openItem}
          onValueChange={handleValueChange}
        >
          {accordionItems.map((nestedBlock) => (
            <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} openItem={openItem} />
          ))}
        </StyledAccordionRoot>
      </>
    )
  } else {
    content = (
      <Wrapper {...storyblokEditable(blok)}>
        {displayTitleDescriptionSection && (
          <GridLayout.Content width="1/2" align={isCentered ? 'center' : 'left'}>
            <AccodrionTitleDescription blok={blok} />
          </GridLayout.Content>
        )}
        <GridLayout.Content width="1/2" align={isCentered ? 'center' : 'right'}>
          <Accordion.Root
            type="single"
            collapsible
            value={openItem}
            onValueChange={handleValueChange}
          >
            {accordionItems.map((nestedBlock) => (
              <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} openItem={openItem} />
            ))}
          </Accordion.Root>
        </GridLayout.Content>
      </Wrapper>
    )
  }

  return (
    <>
      {isBrowser() && enableFAQStructuredData && (
        // isBrowser check is needed due to bug in Next where script tag is inserted twice despite having a key
        <Head>
          <script
            key="accordion-faq-sctructured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(FAQStructuredData),
            }}
          />
        </Head>
      )}
      {content}
    </>
  )
}
AccordionBlock.blockName = 'accordion'

const AccodrionTitleDescription = ({ blok }: { blok: Props['blok'] }) => {
  return (
    <TextContent>
      {blok.title && (
        <Heading
          as="h2"
          variant={{ _: 'standard.24', ...(!blok.centerLayout && { md: 'standard.32' }) }}
        >
          {blok.title}
        </Heading>
      )}
      {blok.description && (
        <Text color="textSecondary" size={{ _: 'xl', ...(!blok.centerLayout && { md: 'xxl' }) }}>
          {blok.description}
        </Text>
      )}
    </TextContent>
  )
}

const Wrapper = styled(GridLayout.Root)({
  // TODO: harmonize with other grid layouts
  gap: theme.space.lg,

  [mq.lg]: {
    gap: theme.space.md,
    paddingInline: theme.space.lg,
  },
})

const TextContent = styled.div({ maxWidth: TEXT_CONTENT_MAX_WIDTH })

const StyledAccordionRoot = styled(Accordion.Root)({
  [`${TabsBlockWrapper} &`]: {
    gap: theme.space.xxs,
  },
})

const getFAQStructuredData = (
  accordions: ReadonlyArray<Pick<AccordionItemBlockProps['blok'], 'title' | 'body'>>,
) => {
  return {
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
  }
}
