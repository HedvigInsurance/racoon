import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
import * as Accordion from '@/components/Accordion/Accordion'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = SbBaseBlockProps<{
  title?: string
  items: ExpectedBlockType<AccordionItemBlockProps>
}>

export const AccordionBlock = ({ blok }: Props) => {
  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  return (
    <Wrapper>
      <Space y={1}>
        {blok.title && (
          <StyledHeading as="h2" variant="standard.20">
            {blok.title}
          </StyledHeading>
        )}
        <Accordion.Root type="multiple">
          {accordionItems.map((nestedBlock) => (
            <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </Accordion.Root>
      </Space>
    </Wrapper>
  )
}
AccordionBlock.blockName = 'accordion'

const Wrapper = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

const StyledHeading = styled(Heading)({
  textAlign: 'center',
})
