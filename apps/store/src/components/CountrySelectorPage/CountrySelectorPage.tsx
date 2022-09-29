import styled from '@emotion/styled'
import Link from 'next/link'
import { LinkButton, Space, Heading } from 'ui'
import { countries } from '@/lib/l10n/countries'
import { toRoutingLocale, TEMP_TRANSLATIONS } from '@/lib/l10n/locales'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

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
  return (
    <Container {...props}>
      <Space y={3}>
        <Heading as="h1">
          We’re not quite sure where you’re visiting us from. Select your country below.
        </Heading>
        <CountryOptionsContainer>
          {Object.entries(countries).map(([country, countryData]) => (
            <Link key={country} href={`/${toRoutingLocale(countryData.defaultLocale)}`} passHref>
              <LinkButton>{TEMP_TRANSLATIONS[`COUNTRY_LABEL_${country}`]}</LinkButton>
            </Link>
          ))}
        </CountryOptionsContainer>
      </Space>
    </Container>
  )
}
