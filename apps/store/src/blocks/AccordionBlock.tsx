import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { Heading, Space } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  title?: string
  items: Array<SbBlokData>
}>

export const AccordionBlock = ({ blok }: Props) => {
  return (
    <StyledRoot type="multiple">
      <Space y={1}>
        {blok.title && (
          <Heading as="h2" variant="standard.20">
            <TitleWrapper>{blok.title}</TitleWrapper>
          </Heading>
        )}
        <div>
          {blok.items.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </Space>
    </StyledRoot>
  )
}

const StyledRoot = styled(Accordion.Root)(({ theme }) => ({
  padding: theme.space[4],
}))

const TitleWrapper = styled.div({
  textAlign: 'center',
})
