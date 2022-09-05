import styled from '@emotion/styled'
import Link from 'next/link'
import { LinkButton } from 'ui'
import { Locale } from '@/lib/l10n/types'
import { PageLink } from '@/lib/PageLink'
import { ObjectKeys } from './CountrySelectorPage.helpers'

type CountrySelectorPageProps = any

const Container = styled.div(({ theme }) => ({
  height: 400,
  display: 'grid',
  alignContent: 'center',
  textAlign: 'center',
  background: theme.colors.gray100,
}))

const CountryOptionContainer = styled.div({
  display: 'grid',
  gap: 5,
})

const SupportedMarkets = {
  Sweden: 'Sweden',
  Norway: 'Norway',
  Denmark: 'Denmark',
} as const

const MarketsMap = new Map([
  [SupportedMarkets.Denmark, Locale.DaDk],
  [SupportedMarkets.Norway, Locale.NbNo],
  [SupportedMarkets.Sweden, Locale.SvSe],
])

type SupportedMarketsKeys = keyof typeof SupportedMarkets

const getLocaleFromMarket = (market: SupportedMarketsKeys) => MarketsMap.get(market)

export const CountrySelectorPage = (props: CountrySelectorPageProps) => {
  return (
    <Container {...props}>
      <h1>Select Country</h1>
      <CountryOptionContainer>
        {ObjectKeys(SupportedMarkets).map((market) => {
          return (
            <Link
              key={market}
              href={PageLink.store({ locale: getLocaleFromMarket(market) })}
              passHref
            >
              <LinkButton>{market}</LinkButton>
            </Link>
          )
        })}
      </CountryOptionContainer>
    </Container>
  )
}
