import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Space, Heading, Button } from 'ui'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { countries } from '@/utils/l10n/countries'
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_KEY } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'

export const CountrySelectorPage = (props: StoryblokPageProps) => {
  const { t } = useTranslation()
  const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)

  const onHandleClick = (locale: IsoLocale) =>
    cookiePersister.save(toRoutingLocale(locale), undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })

  return (
    <Wrapper {...props}>
      <Section>
        <Space y={3}>
          <Heading as="h1">
            {t('COUNTRY_NOT_DETECTED', { defaultValue: 'COUNTRY_NOT_DETECTED' })}
          </Heading>
          <Space y={0.5}>
            {Object.entries(countries).map(([country, countryData]) => (
              <Link
                key={country}
                href={`/${toRoutingLocale(countryData.defaultLocale)}`}
                passHref
                legacyBehavior
              >
                <Button onClick={() => onHandleClick(countryData.defaultLocale)}>
                  {t(`COUNTRY_LABEL_${country}`, { defaultValue: `MISSING ${country}` })}
                </Button>
              </Link>
            ))}
          </Space>
        </Space>
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  maxWidth: '40rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const Section = styled(Space)(({ theme }) => ({
  padding: `${theme.space.xxl} ${theme.space.md} `,
}))
