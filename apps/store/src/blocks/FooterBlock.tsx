import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ChangeEventHandler } from 'react'
import { mq, Space, Text, theme } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
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

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  linkText: string
}>

export const FooterLink = ({ blok }: FooterLinkProps) => {
  return (
    <StyledLink href={getLinkFieldURL(blok.link, blok.linkText)} {...storyblokEditable(blok)}>
      {blok.linkText}
    </StyledLink>
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
  onLocaleChange?: (newLocale: IsoLocale) => void
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
    onLocaleChange?.(newLocale)
  }

  const handleChangeLanguage: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLanguage = event.target.value as Language
    const newLocale = getCountryLocale(currentCountry.id, newLanguage)
    onLocaleChange?.(newLocale)
  }

  const footerSections = filterByBlockType(blok.sections, FooterSection.blockName)
  return (
    <Wrapper>
      <Content>
        {footerSections.map((nestedBlok) => (
          <FooterSection key={nestedBlok._uid} blok={nestedBlok} />
        ))}

        <Bottom>
          <Disclaimer>
            <Text color="textSecondary" size="sm">
              © Hedvig 2023
            </Text>
          </Disclaimer>

          <LocaleForm>
            <StyledInputSelect
              name={LocaleField.Country}
              onChange={handleChangeCountry}
              defaultValue={currentCountry.id}
              options={countryList}
            />
            <StyledInputSelect
              name={LocaleField.Language}
              onChange={handleChangeLanguage}
              defaultValue={currentLanguage}
              options={languageList}
            />
          </LocaleForm>
        </Bottom>
      </Content>
    </Wrapper>
  )
}
FooterBlock.blockName = 'footer' as const

const Wrapper = styled.footer({
  width: '100%',
  backgroundColor: theme.colors.gray100,
  paddingInline: theme.space.md,
  paddingTop: theme.space.xxl,

  // Clear floating price calculator button
  paddingBottom: theme.space[9],
})

const Content = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, auto)',
  columnGap: theme.space.md,
  rowGap: theme.space.xxl,

  maxWidth: `calc(8 * 6.25rem + 7 * ${theme.space.md})`,
  marginInline: 'auto',

  [mq.md]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

const Bottom = styled.div({
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateAreas: `
    'form'
    'disclaimer'
  `,
  columnGap: theme.space.md,
  rowGap: theme.space.xxl,

  [mq.md]: {
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridTemplateAreas: `
      'disclaimer disclaimer none none form form form form'
    `,
    alignItems: 'center',
  },
})

const Disclaimer = styled.div({
  gridArea: 'disclaimer',
  textAlign: 'center',

  [mq.md]: { textAlign: 'left' },
})

const LocaleForm = styled.div({
  gridArea: 'form',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.space.md,
})

const StyledLink = styled(Link)({ textDecoration: 'none', display: 'block' })

const StyledInputSelect = styled(InputSelect)({
  backgroundColor: theme.colors.gray300,
})
