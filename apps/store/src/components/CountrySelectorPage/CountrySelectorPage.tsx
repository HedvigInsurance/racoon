import styled from '@emotion/styled'
import Link from 'next/link'
import { LinkButton } from 'ui'
import { countries } from '@/lib/l10n/countries'
import { routingLocale, TEMP_TRANSLATIONS } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/PageLink'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

const Container = styled.div({
  height: 400,
  display: 'grid',
  alignContent: 'center',
  textAlign: 'center',
})

const CountryOptionContainer = styled.div({
  display: 'grid',
  gap: 5,
})

export const CountrySelectorPage = (props: StoryblokPageProps) => {
  return (
    <Container {...props}>
      <h1>Select Country</h1>
      <CountryOptionContainer>
        {Object.keys(countries).map((country) => (
          <Link
            key={country}
            href={PageLink.store({
              locale: routingLocale(countries[country as keyof typeof countries].defaultLocale),
            })}
            passHref
          >
            <LinkButton>{TEMP_TRANSLATIONS[`COUNTRY_LABEL_${country}`]}</LinkButton>
          </Link>
        ))}
      </CountryOptionContainer>
    </Container>
  )
}
