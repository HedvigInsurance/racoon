import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextLink from 'next/link'
import { ButtonVariant, LinkButton } from 'ui'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ButtonVariant
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <LinkButton
        as={NextLink}
        href={getLinkFieldURL(blok.link)}
        variant={blok.variant}
        color="dark"
        size="lg"
      >
        {blok.text}
      </LinkButton>
    </Wrapper>
  )
}
ButtonBlock.blockName = 'button'

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
