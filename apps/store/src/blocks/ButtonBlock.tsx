import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextLink from 'next/link'
import { ButtonVariant, LinkButton } from 'ui'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ButtonVariant
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <NextLink href={blok.link.cached_url} passHref>
        <LinkButton variant={blok.variant} color="dark" size="lg">
          {blok.text}
        </LinkButton>
      </NextLink>
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
