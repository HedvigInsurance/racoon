import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { AccordionItemBlock, AccordionItemBlockProps } from '@/blocks/AccordionItemBlock'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = SbBaseBlockProps<{
  title?: string
  items: Array<AccordionItemBlockProps['blok']>
}>

export const AccordionBlock = ({ blok }: Props) => {
  const accordionItems = filterByBlockType(blok.items, AccordionItemBlock.blockName)
  return (
    <StyledRoot type="multiple">
      <Space y={1}>
        {blok.title && (
          <StyledHeading as="h2" variant="standard.20">
            {blok.title}
          </StyledHeading>
        )}
        <div>
          {accordionItems.map((nestedBlock) => (
            <AccordionItemBlock key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </Space>
    </StyledRoot>
  )
}
AccordionBlock.blockName = 'accordion'

const StyledRoot = styled(Accordion.Root)(({ theme }) => ({
  padding: theme.space[4],
}))

const StyledHeading = styled(Heading)({
  textAlign: 'center',
})
