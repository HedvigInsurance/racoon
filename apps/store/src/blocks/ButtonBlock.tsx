import { storyblokEditable } from '@storyblok/react'
import { LinkButton } from 'ui'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
}>

export const ButtonBlock = ({ blok }: ButtonBlockProps) => {
  return (
    <LinkButton
      href={blok.link.cached_url}
      color="dark"
      variant="filled"
      size="lg"
      {...storyblokEditable(blok)}
    >
      {blok.text}
    </LinkButton>
  )
}
