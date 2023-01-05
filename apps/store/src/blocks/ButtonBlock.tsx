import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ComponentProps } from 'react'
import { Button } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ComponentProps<typeof Button>['variant']
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <ButtonNextLink
        href={getLinkFieldURL(blok.link, blok.text)}
        variant={blok.variant}
        size="large"
      >
        {blok.text}
      </ButtonNextLink>
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
