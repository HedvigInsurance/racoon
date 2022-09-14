import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextLink from 'next/link'
import { ButtonVariant, LinkButton } from 'ui'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useStroryblokLinkURL } from '@/utils/useStroryblokLinkURL'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ButtonVariant
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  const href = useStroryblokLinkURL(blok.link)
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <NextLink href={href} passHref>
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
