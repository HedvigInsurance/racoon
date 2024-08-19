import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { Text, yStack } from 'ui'
import { LanguageSelector } from '@/blocks/FooterBlock/LanguageSelector'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { BUSINESS_REGISTRATION_NUMBER, organization } from '@/utils/jsonSchema'
import {
  disclaimerStyle,
  gridColumn,
  gridLayout,
  footerLink,
  wrapperStyle,
  languageSelectForm,
} from './FooterBlock.css'

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  linkText: string
}>

export const FooterLinkBlock = ({ blok }: FooterLinkProps) => {
  return (
    <Link
      {...storyblokEditable(blok)}
      className={footerLink}
      href={getLinkFieldURL(blok.link, blok.linkText)}
      target={blok.link.target}
      rel={blok.link.rel}
      prefetch={false}
    >
      {blok.linkText}
    </Link>
  )
}
FooterLinkBlock.blockName = 'footerLink' as const

type FooterSectionProps = SbBaseBlockProps<{
  footerLinks: ExpectedBlockType<FooterLinkProps>
  title: string
}>

export const FooterSectionBlock = ({ blok }: FooterSectionProps) => {
  const filteredFooterLinks = filterByBlockType(blok.footerLinks, FooterLinkBlock.blockName)
  return (
    <div className={yStack({ gap: 'lg' })} {...storyblokEditable(blok)}>
      <Text size="sm" color="textSecondary">
        {blok.title}
      </Text>
      <div className={yStack({ gap: 'xs' })}>
        {filteredFooterLinks.map((nestedBlock) => (
          <FooterLinkBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </div>
    </div>
  )
}
FooterSectionBlock.blockName = 'footerSection' as const

export type FooterBlockProps = SbBaseBlockProps<{
  sections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const footerSections = filterByBlockType(blok.sections, FooterSectionBlock.blockName)
  return (
    <footer className={wrapperStyle}>
      <GridLayout.Root className={gridLayout}>
        {footerSections.map((nestedBlok) => (
          <div key={nestedBlok._uid} className={gridColumn}>
            <FooterSectionBlock blok={nestedBlok} />
          </div>
        ))}

        <div className={languageSelectForm}>
          <LanguageSelector />
        </div>

        <div className={disclaimerStyle}>
          <Text color="textSecondary" size="sm">
            © {new Date().getFullYear()} {organization.name} AB
            <br />
            <br />
            {organization.address.streetAddress}
            <br />
            {organization.address.postalCode} {organization.address.addressLocality}
            <br />
            Org.nr. {BUSINESS_REGISTRATION_NUMBER}
          </Text>
        </div>
      </GridLayout.Root>
    </footer>
  )
}
FooterBlock.blockName = 'footer' as const
