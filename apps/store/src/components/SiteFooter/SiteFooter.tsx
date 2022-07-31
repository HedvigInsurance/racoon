import styled from '@emotion/styled'
import { ChangeEvent, useRef } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Locale } from '@/lib/l10n/types'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { Field, MARKET_MAP, TEMP_TRANSLATIONS } from './SiteFooter.constants'
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

const Wrapper = styled(Space)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.gray200,
  padding: `${theme.space[6]} ${theme.space[4]}`,
}))

const Flex = styled.div({ flex: 1 })

const TextMuted = styled.p(({ theme }) => ({
  color: theme.colors.gray600,
  fontSize: theme.fontSizes[1],
}))
