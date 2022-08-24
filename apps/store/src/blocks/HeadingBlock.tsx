import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, HeadingProps } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  textAlign: 'center',
}))

type HeadingBlockProps = SbBaseBlockProps<{
  text: string
  variant: HeadingProps['variant']
  as: HeadingProps['as']
}>

export const HeadingBlock = ({ blok }: HeadingBlockProps) => {
  return (
    <Wrapper>
      <Heading as={blok.as} variant={blok.variant} {...storyblokEditable(blok)}>
        {blok.text}
      </Heading>
    </Wrapper>
  )
}
HeadingBlock.blockName = 'heading'
