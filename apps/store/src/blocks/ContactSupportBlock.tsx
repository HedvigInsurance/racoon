import { storyblokEditable } from '@storyblok/react'
import { ContactSupport } from '@/components/ContactSupport/ContactSupport'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ContactSupportBlockProps = SbBaseBlockProps<{
  title: string
  showCallButton: boolean
  availabilityText?: string
}>

export const ContactSupportBlock = ({ blok }: ContactSupportBlockProps) => {
  return (
    <ContactSupport
      {...storyblokEditable(blok)}
      title={blok.title}
      showCallButton={blok.showCallButton}
      availabilityText={blok.availabilityText}
    />
  )
}
