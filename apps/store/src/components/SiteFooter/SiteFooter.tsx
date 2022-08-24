import styled from '@emotion/styled'
import Link from 'next/link'
import { ChangeEvent, useRef } from 'react'
import { Space } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Locale } from '@/lib/l10n/types'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { Field, MARKET_MAP, SECTIONS, TEMP_TRANSLATIONS } from './SiteFooter.constants'
import { findLocale } from './SiteFooter.helpers'

export type SiteFooterProps = {
  onChangeLocale: (locale: Locale | undefined) => void
}

export const SiteFooter = ({ onChangeLocale }: SiteFooterProps) => {
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

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChangeLocale(findLocale(event.target[Field.Market].value, event.target[Field.Language].value))
  }

  return (
    <Wrapper y={2}>
      <Accordion.Root type="multiple">
        {SECTIONS.map((section, index) => (
          <Accordion.Item key={index} value={index.toString()}>
            <Accordion.HeaderWithTrigger>{section.title}</Accordion.HeaderWithTrigger>
            <StyledAccordionContent>
              <Space y={1}>
                {section.links.map((link) => (
                  <div key={link.href}>
                    <Link href={link.href}>
                      <StyledLink>{link.title}</StyledLink>
                    </Link>
                  </div>
                ))}
              </Space>
            </StyledAccordionContent>
          </Accordion.Item>
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
