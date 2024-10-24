'use client'
import { storyblokEditable } from '@storyblok/react'
import { type ComponentProps } from 'react'
import { type Button } from 'ui/src/components/Button/Button'
import { buttonWrapper } from '@/blocks/ButtonBlock.css'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import type { LinkField } from '@/services/storyblok/storyblok'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ComponentProps<typeof Button>['variant']
  size: ComponentProps<typeof Button>['size']
  fullWidth?: boolean
}>

export const ButtonBlock = ({ blok, nested }: ButtonBlockProps) => {
  const button = (
    <ButtonNextLink
      {...storyblokEditable(blok)}
      href={getLinkFieldURL(blok.link, blok.text)}
      variant={blok.variant ?? 'primary'}
      size={blok.size ?? 'medium'}
      fullWidth={blok.fullWidth}
      target={blok.link.target}
      rel={blok.link.rel}
      title={blok.link.title}
    >
      {blok.text}
    </ButtonNextLink>
  )
  if (nested) {
    return button
  } else {
    return <div className={buttonWrapper}>{button}</div>
  }
}
ButtonBlock.blockName = 'button'
