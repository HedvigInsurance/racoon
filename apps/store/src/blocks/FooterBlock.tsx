import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useRef } from 'react'
import { Space } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { LocaleField, TEMP_TRANSLATIONS } from '@/lib/l10n/locales'
import { findMarketLocale, markets } from '@/lib/l10n/markets'
import { Locale } from '@/lib/l10n/types'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { useCurrentMarket } from '@/lib/l10n/useCurrentMarket'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  linkText: string
}>

export const FooterLink = ({ blok }: FooterLinkProps) => (
  <Link href={blok.link.cached_url} passHref {...storyblokEditable(blok)}>
    <StyledLink>{blok.linkText}</StyledLink>
  </Link>
)
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

type FooterBlockProps = SbBaseBlockProps<{
  footerSections: ExpectedBlockType<FooterSectionProps>
}>
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { htmlLang: currentLanguage } = useCurrentLocale()
  const currentMarket = useCurrentMarket()

  const marketList = Object.keys(markets).map((market) => ({
    name: TEMP_TRANSLATIONS[`MARKET_LABEL_${market}`],
    value: market,
  }))

  const languageList = currentMarket.locales.map((locale) => {
    const language = locale.split('-')[0]
    return {
      name: TEMP_TRANSLATIONS[`LANGUAGE_LABEL_${language}`],
      value: language,
    }
  })

  const handleSelectChange = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const router = useRouter()
  const onChangeLocale = (locale: Locale | undefined) => {
    router.push(router.asPath, undefined, { locale })
  }
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChangeLocale(
      findMarketLocale(
        event.target[LocaleField.Market].value,
        event.target[LocaleField.Language].value,
      ),
    )
  }

  const footerSections = filterByBlockType(blok.footerSections, FooterSection.blockName)

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
              name={LocaleField.Market}
              onChange={handleSelectChange}
              value={currentMarket.id}
              options={marketList}
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

export const StyledLink = styled.a({
  textDecoration: 'none',
})
