import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { ChangeEvent, useRef } from 'react'
import { Space } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import {
  Flex,
  SiteFooterProps,
  StyledAccordionContent,
  StyledLink,
  TextMuted,
  Wrapper,
} from '@/components/SiteFooter/SiteFooter'
import { Field, MARKET_MAP, TEMP_TRANSLATIONS } from '@/components/SiteFooter/SiteFooter.constants'
import { findLocale } from '@/components/SiteFooter/SiteFooter.helpers'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Locale } from '@/lib/l10n/types'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type FooterLinkProps = SbBaseBlockProps<{
  link: LinkField
  name: string
}>
export const FooterLink = ({ blok }: FooterLinkProps) => {
  return (
    <Link href={blok.link.cached_url} passHref {...storyblokEditable(blok)}>
      <StyledLink>{blok.title}</StyledLink>
    </Link>
  )
}
FooterLink.blockName = 'footerLink'

type FooterSectionProps = SbBaseBlockProps<{
  footerLinks: FooterLinkProps['blok'][]
  title: string
}>

export const FooterSection = ({ blok }: FooterSectionProps) => {
  return (
    <Accordion.Item key={blok._uid} value={blok.title.toString()} {...storyblokEditable(blok)}>
      <Accordion.HeaderWithTrigger>{blok.title}</Accordion.HeaderWithTrigger>
      <StyledAccordionContent>
        <Space y={1}>
          {blok.footerLinks.map((nestedBlock) => (
            <div key={nestedBlock._uid}>
              <FooterLink blok={nestedBlock} />
            </div>
          ))}
        </Space>
      </StyledAccordionContent>
    </Accordion.Item>
  )
}
FooterSection.blockName = 'footerSection'

type FooterBlockProps = SbBaseBlockProps<{
  sections: FooterSectionProps['blok'][]
}> &
  SiteFooterProps
export const FooterBlock = ({ blok }: FooterBlockProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { marketLabel: currentMarket, htmlLang: currentLanguage } = useCurrentLocale()

  const marketList = Object.keys(MARKET_MAP).map((market) => ({
    name: TEMP_TRANSLATIONS[`MARKET_LABEL_${market}`],
    value: market,
  }))

  const languageList = MARKET_MAP[currentMarket].map((language) => ({
    name: TEMP_TRANSLATIONS[`LANGUAGE_LABEL_${language}`],
    value: language,
  }))

  const handleSelectChange = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  // todo: connect to locale / market
  const onChangeLocale = (value: Locale | undefined) => console.log('Location changed:', value)

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChangeLocale(findLocale(event.target[Field.Market].value, event.target[Field.Language].value))
  }

  return (
    <Wrapper y={2}>
      <Accordion.Root type="multiple">
        {blok.sections.map((nestedBlok) => (
          <FooterSection key={nestedBlok._uid} blok={nestedBlok} />
        ))}
      </Accordion.Root>
      <form ref={formRef} onSubmit={handleSubmit}>
        <SpaceFlex>
          <Flex>
            <InputSelect
              name={Field.Market}
              onChange={handleSelectChange}
              value={currentMarket}
              options={marketList}
            />
          </Flex>

          <Flex>
            <InputSelect
              name={Field.Language}
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
FooterBlock.blockName = 'footer'
