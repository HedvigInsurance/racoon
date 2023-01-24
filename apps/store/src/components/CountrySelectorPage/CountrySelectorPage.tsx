import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Space, Heading, Button, theme, mq } from 'ui'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { countries } from '@/utils/l10n/countries'
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_KEY } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { IsoLocale } from '@/utils/l10n/types'

export const CountrySelectorPage = (props: { className?: string }) => {
  const { t } = useTranslation()
  const cookiePersister = new CookiePersister(LOCALE_COOKIE_KEY)

  const onHandleClick = (locale: IsoLocale) =>
    cookiePersister.save(toRoutingLocale(locale), undefined, { maxAge: LOCALE_COOKIE_MAX_AGE })

  return (
    <Wrapper y={3} {...props}>
      <Heading as="h1">
        {t('COUNTRY_NOT_DETECTED', { defaultValue: 'COUNTRY_NOT_DETECTED' })}
      </Heading>
      <Space y={0.5}>
        {Object.entries(countries).map(([country, countryData]) => (
          <Button
            key={country}
            href={`/${toRoutingLocale(countryData.defaultLocale)}`}
            onClick={() => onHandleClick(countryData.defaultLocale)}
          >
            {t(`COUNTRY_LABEL_${country}`, { defaultValue: `MISSING ${country}` })}
          </Button>
        ))}
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingInline: theme.space.md,

  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})
