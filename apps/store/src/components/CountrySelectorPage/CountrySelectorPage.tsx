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

const AvailableMarkets = {
  Sweden: 'Sweden',
  Norway: 'Norway',
  Denmark: 'Denmark',
} as const

const MarketsMap = new Map([
  [AvailableMarkets.Denmark, Locale.DaDk],
  [AvailableMarkets.Norway, Locale.NbNo],
  [AvailableMarkets.Sweden, Locale.SvSe],
])

const getLocaleFromMarket = (market: keyof typeof AvailableMarkets) => MarketsMap.get(market)

export const CountrySelectorPage = (props: CountrySelectorPageProps) => {
  return (
    <Container {...props}>
      <h1>Select Country</h1>
      <CountryOptionContainer>
        {ObjectKeys(AvailableMarkets).map((market) => {
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
