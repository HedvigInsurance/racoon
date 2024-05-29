'use client'

import { storyblokEditable } from '@storyblok/react'
import type { ContactSupportProps } from '@/components/ContactSupport/ContactSupport'
import { ContactSupport } from '@/components/ContactSupport/ContactSupport'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ContactSupportBlockProps = SbBaseBlockProps<ContactSupportProps>

export const ContactSupportBlock = ({ blok }: ContactSupportBlockProps) => {
  return (
    <ContactSupport
      {...storyblokEditable(blok)}
      chatTitle={blok.chatTitle}
      chatOpeningHours={blok.chatOpeningHours}
      phoneTitle={blok.phoneTitle}
      phoneOpeningHours={blok.phoneOpeningHours}
      phoneLink={blok.phoneLink}
    />
  )
}
ContactSupportBlock.blockName = 'contactSupport'
