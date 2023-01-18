import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, Text, theme, mq } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
import * as Accordion from '@/components/Accordion/Accordion'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = SbBaseBlockProps<{
  title?: string
  description?: string
  items: ExpectedBlockType<AccordionItemBlockProps>
}>

export const AccordionBlock = ({ blok }: Props) => {
  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  const displayTitleDescriptionSection = blok.title || blok.description
  return (
    <Wrapper {...storyblokEditable(blok)}>
      {displayTitleDescriptionSection && (
        <TitleDescriptionWrapper>
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
        </TitleDescriptionWrapper>
      )}
      <StyledAccordion type="multiple">
        {accordionItems.map((nestedBlock) => (
          <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </StyledAccordion>
    </Wrapper>
  )
}
AccordionBlock.blockName = 'accordion'

const Wrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.space.lg,
  paddingInline: theme.space.md,
  marginInline: 'auto',
  maxWidth: '90rem',
})

const TitleDescriptionWrapper = styled.div({
  flex: 1,
  minWidth: 'min(23.75rem, 100%)',
})

const StyledAccordion = styled(Accordion.Root)({
  flex: 1,
  minWidth: 'min(28.125rem, 100%)',
  [mq.md]: {
    gap: theme.space.xs,
  },
})
