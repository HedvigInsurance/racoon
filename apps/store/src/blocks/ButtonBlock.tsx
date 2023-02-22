import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ComponentProps } from 'react'
import { Button, ConditionalWrapper, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ComponentProps<typeof Button>['variant']
  size: ComponentProps<typeof Button>['size']
}>

export const ButtonBlock = ({ blok, nested }: ButtonBlockProps) => {
  return (
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <ButtonNextLink
        {...storyblokEditable(blok)}
        href={getLinkFieldURL(blok.link, blok.text)}
        variant={blok.variant ?? 'primary'}
        size={blok.size ?? 'medium'}
      >
        {blok.text}
      </ButtonNextLink>
    </ConditionalWrapper>
  )
}
ButtonBlock.blockName = 'button'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
