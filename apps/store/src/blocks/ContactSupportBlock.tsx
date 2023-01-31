import { storyblokEditable } from '@storyblok/react'
import { ContactSupport, ContactSupportProps } from '@/components/ContactSupport/ContactSupport'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ContactSupportBlockProps = SbBaseBlockProps<ContactSupportProps>

export const ContactSupportBlock = ({ blok }: ContactSupportBlockProps) => {
  return (
    <ContactSupport
      {...storyblokEditable(blok)}
      title={blok.title}
      chatTitle={blok.chatTitle}
      chatOpeningHours={blok.chatOpeningHours}
      phoneTitle={blok.phoneTitle}
      phoneOpeningHours={blok.phoneOpeningHours}
      phoneLink={blok.phoneLink}
    />
  )
}
ContactSupportBlock.blockName = 'contactSupport'
