import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextLink from 'next/link'
import { ButtonVariant, LinkButton } from 'ui'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ButtonVariant
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  const locale = useCurrentLocale()
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <NextLink href={getLinkFieldURL(blok.link, locale)} passHref>
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
