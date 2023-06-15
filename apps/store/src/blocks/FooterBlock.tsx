import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ChangeEventHandler } from 'react'
import { mq, Space, Text, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { linkStyles } from '@/components/RichText/RichText.styles'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { Features } from '@/utils/Features'
import { countries } from '@/utils/l10n/countries'
import { getCountryLocale } from '@/utils/l10n/countryUtils'
import { LocaleField } from '@/utils/l10n/locales'
import {
  getLocaleOrFallback,
  translateCountryName,
  translateLanguageName,
} from '@/utils/l10n/localeUtils'
import { CountryLabel, IsoLocale, Language } from '@/utils/l10n/types'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const COUNTRY_SELECTOR_ENABLED = Features.enabled('COUNTRY_SELECTOR')
const ENGLISH_LANGUAGE_ENABLED = Features.enabled('ENGLISH_LANGUAGE')

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  linkText: string
}>

export const FooterLink = ({ blok }: FooterLinkProps) => {
  const Component = blok.link.linktype === 'url' ? StyledAnchor : StyledLink
  return (
    <Component href={getLinkFieldURL(blok.link, blok.linkText)} {...storyblokEditable(blok)}>
      {blok.linkText}
    </Component>
  )
}
FooterLink.blockName = 'footerLink' as const

type FooterSectionProps = SbBaseBlockProps<{
  footerLinks: ExpectedBlockType<FooterLinkProps>
  title: string
}>

export const FooterSection = ({ blok }: FooterSectionProps) => {
  const filteredFooterLinks = filterByBlockType(blok.footerLinks, FooterLink.blockName)
  return (
    <Space y={1.5} {...storyblokEditable(blok)}>
      <Text size="sm" color="textSecondary">
        {blok.title}
      </Text>
      <Space y={0.5}>
        {filteredFooterLinks.map((nestedBlock) => (
          <FooterLink key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </Space>
    </Space>
  )
}
FooterSection.blockName = 'footerSection' as const

export type FooterBlockProps = {
  onLocaleChange: (newLocale: IsoLocale) => void
} & SbBaseBlockProps<{
  sections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok, onLocaleChange }: FooterBlockProps) => {
  const { language: currentLanguage } = useCurrentLocale()
  const currentCountry = useCurrentCountry()
  const { t } = useTranslation()

  const countryList = Object.keys(countries).map((country) => ({
    name: translateCountryName(country as CountryLabel, t),
    value: country,
  }))

  const languageList = currentCountry.locales.map((locale) => {
    const { language } = getLocaleOrFallback(locale)
    return {
      name: translateLanguageName(language, t),
      value: language,
    }
  })

  const handleChangeCountry: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newCountry = event.target.value as CountryLabel
    const newLocale = getCountryLocale(newCountry, currentLanguage)
    onLocaleChange(newLocale)
  }

  const handleChangeLanguage: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLanguage = event.target.value as Language
    const newLocale = getCountryLocale(currentCountry.id, newLanguage)
    onLocaleChange(newLocale)
  }

  const footerSections = filterByBlockType(blok.sections, FooterSection.blockName)
  return (
    <Wrapper>
      <RootLayout>
        {footerSections.map((nestedBlok) => (
          <Column key={nestedBlok._uid}>
            <FooterSection blok={nestedBlok} />
          </Column>
        ))}

        <LocaleForm>
          {COUNTRY_SELECTOR_ENABLED && (
            <StyledInputSelect
              name={LocaleField.Country}
              onChange={handleChangeCountry}
              defaultValue={currentCountry.id}
              options={countryList}
            />
          )}
          {ENGLISH_LANGUAGE_ENABLED && (
            <StyledInputSelect
              name={LocaleField.Language}
              onChange={handleChangeLanguage}
              defaultValue={currentLanguage}
              options={languageList}
            />
          )}
        </LocaleForm>

        <Disclaimer>
          <Text color="textSecondary" size="sm">
            © 2023 Hedvig AB
            <br />
            <br />
            Malmskillnadsgatan 32
            <br />
            SE-111 51, Stockholm
            <br />
            Org.nr. 559093-0334
          </Text>
        </Disclaimer>
      </RootLayout>
    </Wrapper>
  )
}
FooterBlock.blockName = 'footer' as const

const Wrapper = styled.footer({
  backgroundColor: theme.colors.gray100,
  paddingTop: theme.space.xxl,

  // Clear floating price calculator button
  paddingBottom: theme.space[10],
})

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
  gridTemplateColumns: ENGLISH_LANGUAGE_ENABLED ? 'repeat(2, 1fr)' : '1fr',
  gap: theme.space.md,

  gridColumn: '1 / -1',

  [mq.md]: {
    gridRow: 2,
    gridColumn: '7 / -1',
  },
  [mq.xxl]: { gridColumn: '7 / span 4' },
})

const Disclaimer = styled.div({
  gridColumn: '1 / -1',
  textAlign: 'center',

  [mq.md]: {
    gridRow: 2,
    gridColumn: 'span 2',
    textAlign: 'left',
  },

  [mq.xxl]: { gridColumn: '3 / span 2' },
})

const StyledAnchor = styled.a(linkStyles, { textDecorationColor: 'transparent', display: 'block' })

const StyledLink = StyledAnchor.withComponent(Link)

const StyledInputSelect = styled(InputSelect)({
  backgroundColor: theme.colors.gray300,
})
