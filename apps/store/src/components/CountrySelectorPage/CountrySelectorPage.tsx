import styled from '@emotion/styled'
import Link from 'next/link'
import { LinkButton, Space, Heading } from 'ui'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { countries } from '@/utils/l10n/countries'
import { LOCALE_COOKIE_EXPIRY, LOCALE_COOKIE_KEY, TEMP_TRANSLATIONS } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'

const Container = styled.div({
  height: 400,
  display: 'grid',
  alignContent: 'center',
  textAlign: 'center',
  margin: '4rem 1rem',
})

const CountryOptionsContainer = styled.div({
  display: 'grid',
  gap: 8,
})

export const CountrySelectorPage = (props: StoryblokPageProps) => {
  const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)

  const onHandleClick = (locale: IsoLocale) =>
    cookiePersister.save(toRoutingLocale(locale), undefined, { expires: LOCALE_COOKIE_EXPIRY })

  return (
    <Container {...props}>
      <Space y={3}>
        <Heading as="h1">
          We’re not quite sure where you’re visiting us from. Select your country below.
        </Heading>
        <CountryOptionsContainer>
          {Object.entries(countries).map(([country, countryData]) => (
            <Link key={country} href={`/${toRoutingLocale(countryData.defaultLocale)}`} passHref>
              <LinkButton onClick={() => onHandleClick(countryData.defaultLocale)}>
                {TEMP_TRANSLATIONS[`COUNTRY_LABEL_${country}`]}
              </LinkButton>
            </Link>
          ))}
        </CountryOptionsContainer>
      </Space>
    </Container>
  )
}
