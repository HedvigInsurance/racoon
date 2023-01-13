import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { addLocale } from 'next/dist/client/add-locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEventHandler } from 'react'
import { mq, Space, Text, theme } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { countries } from '@/utils/l10n/countries'
import { getCountryByLocale, getCountryLocale } from '@/utils/l10n/countryUtils'
import { LocaleField, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_KEY } from '@/utils/l10n/locales'
import {
  getLocaleOrFallback,
  toRoutingLocale,
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

export type FooterBlockProps = SbBaseBlockProps<{
  sections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const { language: currentLanguage } = useCurrentLocale()
  const currentCountry = useCurrentCountry()
  const { t } = useTranslation()
  const apolloClient = useApolloClient()

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

  const router = useRouter()
  const onChangeLocale = (locale: IsoLocale) => {
    const nextLocale = toRoutingLocale(locale)
    const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)
    cookiePersister.save(nextLocale, undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })
    const nextCountry = getCountryByLocale(nextLocale)
    if (nextCountry === currentCountry) {
      router.push(router.asPath, undefined, { locale: nextLocale })
    } else {
      // Country change should be full app reload to maintain our programming assumptions
      // We may clean any previous shop session while we're at it
      setupShopSessionServiceClientSide(apolloClient).reset()
      window.location.href = addLocale(router.asPath, nextLocale)
    }
  }

  const handleChangeCountry: ChangeEventHandler<HTMLSelectElement> = (event) => {
    try {
      const newCountry = event.target.value as CountryLabel
      const newLocale = getCountryLocale(newCountry, currentLanguage)
      onChangeLocale(newLocale)
    } catch (error) {
      datadogLogs.logger.error('Failed to change country', { error, country: event.target.value })
      router.reload()
    }
  }

  const handleChangeLanguage: ChangeEventHandler<HTMLSelectElement> = (event) => {
    try {
      const newLanguage = event.target.value as Language
      const newLocale = getCountryLocale(currentCountry.id, newLanguage)
      onChangeLocale(newLocale)
    } catch (error) {
      datadogLogs.logger.error('Failed to change language', { error, language: event.target.value })
      router.reload()
    }
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
