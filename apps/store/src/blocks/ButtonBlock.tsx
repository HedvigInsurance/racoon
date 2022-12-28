import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import NextLink from 'next/link'
import { ComponentProps } from 'react'
import { Button } from 'ui'
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
      <NextLink href={getLinkFieldURL(blok.link)} passHref legacyBehavior>
        <Button variant={blok.variant} color="dark" size="large">
          {blok.text}
        </Button>
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
