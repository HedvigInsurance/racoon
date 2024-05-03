'use client'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import type { ChangeEventHandler } from 'react'
import { mq, Space, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { linkStyles } from '@/components/RichText/RichText.styles'
import type { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { BUSINESS_REGISTRATION_NUMBER, organization } from '@/utils/jsonSchema'
import { getCountryLocale } from '@/utils/l10n/countryUtils'
import { LocaleField } from '@/utils/l10n/locales'
import { getLocaleOrFallback, translateLanguageName } from '@/utils/l10n/localeUtils'
import type { Language } from '@/utils/l10n/types'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { disclaimerStyle, wrapperStyle } from './FooterBlock.css'

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  linkText: string
}>

export const FooterLinkBlock = ({ blok }: FooterLinkProps) => {
  const Component = blok.link.linktype === 'url' ? StyledAnchor : StyledLink

  return (
    <Component
      {...storyblokEditable(blok)}
      href={getLinkFieldURL(blok.link, blok.linkText)}
      target={blok.link.target}
      rel={blok.link.rel}
    >
      {blok.linkText}
    </Component>
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
    <Space y={1.5} {...storyblokEditable(blok)}>
      <Text size="sm" color="textSecondary">
        {blok.title}
      </Text>
      <Space y={0.5}>
        {filteredFooterLinks.map((nestedBlock) => (
          <FooterLinkBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </Space>
    </Space>
  )
}
FooterSectionBlock.blockName = 'footerSection' as const

export type FooterBlockProps = SbBaseBlockProps<{
  sections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const { language: currentLanguage } = useCurrentLocale()
  const currentCountry = useCurrentCountry()
  const { t } = useTranslation()
  const handleLocaleChange = useChangeLocale()

  const languageList = currentCountry.locales.map((locale) => {
    const { language } = getLocaleOrFallback(locale)
    return {
      name: translateLanguageName(language, t),
      value: language,
    }
  })

  const handleChangeLanguage: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLanguage = event.target.value as Language
    const newLocale = getCountryLocale(currentCountry.id, newLanguage)
    handleLocaleChange(newLocale)
  }

  const footerSections = filterByBlockType(blok.sections, FooterSectionBlock.blockName)
  return (
    <footer className={wrapperStyle}>
      <h1>footer</h1>
    </footer>
  )
}
FooterBlock.blockName = 'footer' as const

const RootLayout = styled(GridLayout.Root)({
  rowGap: theme.space.xxl,
})

const Column = styled.div({
  gridColumn: 'span 6',

  [mq.md]: { gridColumn: 'span 3' },
  [mq.xxl]: {
    gridColumn: 'auto / span 2',
    ':first-of-type': { gridColumnStart: 3 },
  },
})

const LocaleForm = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.space.md,

  gridColumn: '1 / -1',

  [mq.md]: {
    gridRow: 2,
    gridColumn: '7 / -1',
  },
  [mq.xxl]: { gridColumn: '7 / span 4' },
})

const StyledAnchor = styled.a(linkStyles, { textDecorationColor: 'transparent', display: 'block' })

const StyledLink = StyledAnchor.withComponent(Link)

const StyledInputSelect = styled(InputSelect)({
  backgroundColor: theme.colors.gray300,
})
