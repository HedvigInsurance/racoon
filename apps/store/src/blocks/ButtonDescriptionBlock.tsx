import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import {
  ButtonDescription,
  ButtonDescriptionProps,
} from '@/components/ButtonDescription/ButtonDescription'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))

export type ButtonDescriptionBlockProps = SbBaseBlockProps<{
  descriptionList: ButtonDescriptionProps['descriptionList']
}>

export const ButtonDescriptionBlock = ({ blok }: ButtonDescriptionBlockProps) => {
  return (
    <Wrapper>
      <ButtonDescription descriptionList={blok.descriptionList} {...storyblokEditable(blok)} />
    </Wrapper>
  )
}
ButtonDescriptionBlock.blockName = 'heading'
