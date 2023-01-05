import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useRef } from 'react'
import { Space } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { countries } from '@/utils/l10n/countries'
import { getCountryLocale } from '@/utils/l10n/countryUtils'
import { LocaleField, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_KEY } from '@/utils/l10n/locales'
import {
  getLocaleOrFallback,
  toRoutingLocale,
  translateLanguageName,
} from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'
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
    <Accordion.Item key={blok._uid} value={blok.title.toString()} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>{blok.title}</Accordion.HeaderWithTrigger>
      <StyledAccordionContent>
        <Space y={1}>
          {filteredFooterLinks.map((nestedBlock) => (
            <div key={nestedBlock._uid}>
              <FooterLink blok={nestedBlock} />
            </div>
          ))}
        </Space>
      </StyledAccordionContent>
    </Accordion.Item>
  )
}
FooterSection.blockName = 'footerSection' as const

export type FooterBlockProps = SbBaseBlockProps<{
  sections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { language: currentLanguage } = useCurrentLocale()
  const currentCountry = useCurrentCountry()
  const { t } = useTranslation()
  const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)

  const countryList = Object.keys(countries).map((country) => ({
    name: t(`COUNTRY_LABEL_${country}`, { defaultValue: country }),
    value: country,
  }))

  const languageList = currentCountry.locales.map((locale) => {
    const { language } = getLocaleOrFallback(locale)
    return {
      name: translateLanguageName(language, t),
      value: language,
    }
  })

  const handleSelectChange = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const router = useRouter()
  const onChangeLocale = (locale: IsoLocale) => {
    cookiePersister.save(toRoutingLocale(locale), undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })
    router.push(router.asPath, undefined, { locale: toRoutingLocale(locale) })
  }
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChangeLocale(
      getCountryLocale(
        event.target[LocaleField.Country].value,
        event.target[LocaleField.Language].value,
      ),
    )
  }
  const footerSections = filterByBlockType(blok.sections, FooterSection.blockName)
  return (
    <Wrapper as="footer" y={2}>
      <Accordion.Root type="multiple">
        {footerSections.map((nestedBlok) => (
          <FooterSection key={nestedBlok._uid} blok={nestedBlok} />
        ))}
      </Accordion.Root>
      <form ref={formRef} onSubmit={handleSubmit}>
        <SpaceFlex>
          <Flex>
            <InputSelect
              name={LocaleField.Country}
              onChange={handleSelectChange}
              value={currentCountry.id}
              options={countryList}
            />
          </Flex>

          <Flex>
            <InputSelect
              name={LocaleField.Language}
              onChange={handleSelectChange}
              value={currentLanguage}
              options={languageList}
            />
          </Flex>
        </SpaceFlex>
      </form>

      <TextMuted>Hedvig © 2022, All rights reserved</TextMuted>
    </Wrapper>
  )
}
FooterBlock.blockName = 'footer' as const

export const Wrapper = styled(Space)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.gray200,
  padding: `${theme.space[6]} ${theme.space[4]}`,
  paddingBottom: theme.space[9],
}))

export const Flex = styled.div({ flex: 1 })

export const TextMuted = styled.p(({ theme }) => ({
  color: theme.colors.gray600,
  fontSize: theme.fontSizes[1],
}))

export const StyledAccordionContent = styled(Accordion.Content)(({ theme }) => ({
  padding: theme.space[4],
  paddingTop: theme.space[2],
}))

export const StyledLink = styled(Link)({ textDecoration: 'none' })
