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

type Props = SbBaseBlockProps<{
  items: ExpectedBlockType<AccordionItemBlockProps>
  title?: string
  description?: string
  isFAQ?: boolean
  centerLayout?: boolean
}>

export const AccordionBlock = ({ blok, nested }: Props) => {
  const [openedItem, setOpenedItem] = useState<string>()

  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  const enableFAQStructuredData = blok.isFAQ ?? false
  const displayTitleDescriptionSection = blok.title || blok.description
  const isCentered = blok.centerLayout || !displayTitleDescriptionSection

  const handleValueChange = useCallback((value: string) => {
    setOpenedItem(value)
  }, [])

  let content: React.ReactNode = null
  if (nested) {
    content = (
      <>
        {displayTitleDescriptionSection && <AccodrionTitleDescription blok={blok} />}
        <StyledAccordionRoot
          type="single"
          collapsible
          value={openedItem}
          onValueChange={handleValueChange}
        >
          {accordionItems.map((nestedBlock) => (
            <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} openedItem={openedItem} />
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
            value={openedItem}
            onValueChange={handleValueChange}
          >
            {accordionItems.map((nestedBlock) => (
              <AccordionItemBlock
                key={nestedBlock._uid}
                blok={nestedBlock}
                openedItem={openedItem}
              />
            ))}
          </Accordion.Root>
        </GridLayout.Content>
      </Wrapper>
    )
  }

  return (
    <>
      {enableFAQStructuredData && (
        <Head>
          <script key="accordion-faq-sctructured-data" type="application/ld+json">
            {getFAQStructuredData(accordionItems)}
          </script>
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
