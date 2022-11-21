import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { NewLandingPage, NewLandingPageProps } from '@/components/LandingPage/NewLandingPage'
import { OldLandingPage, OldLandingPageProps } from '@/components/LandingPage/OldLandingPage'
import { SwedishLandingPage } from '@/components/SwedishLandingPage/SwedishLandingPage'
import { useFeature } from '@/hooks/useFeature'
import { useCurrentLocale } from '@/lib/l10n'
import { LocaleData, LocaleLabel, locales, LOCALE_URL_PARAMS } from '@/lib/l10n/locales'
import { MarketLabel } from '@/lib/types'
import { Features, Feature } from '@/services/features'
import { Insurances } from '@/services/insurances'
import logger from '@/services/logger'

type MetaLinks = Pick<LocaleData, 'hrefLang' | 'path'> & {
  href: string
}

const metaLinks: MetaLinks[] = LOCALE_URL_PARAMS.map((locale) => ({
  hrefLang: locales[locale].hrefLang,
  path: locales[locale].path,
  href: `https://www.hedvig.com/${locales[locale].path}/new-member`,
}))

const NewMemberPage = (props: NewLandingPageProps | OldLandingPageProps) => {
  const { t } = useTranslation()
  const { marketLabel, path } = useCurrentLocale()
  const [isTravelAccidentStandaloneEnabled] = useFeature([Feature.TRAVEL_ACCIDENT_STANDALONE])

  const canonicalLink = metaLinks.find((link) => link.path === path)?.href

  let LandingPageComponent: React.ReactNode
  if (marketLabel === MarketLabel.SE) {
    LandingPageComponent = <SwedishLandingPage {...(props as NewLandingPageProps)} />
  } else if (isTravelAccidentStandaloneEnabled) {
    LandingPageComponent = <NewLandingPage {...(props as NewLandingPageProps)} />
  } else {
    LandingPageComponent = <OldLandingPage {...(props as OldLandingPageProps)} />
  }

  return (
    <>
      <Head>
        <title>{t('STARTPAGE_PAGE_TITLE')}</title>
        {canonicalLink && <link rel="canonical" href={canonicalLink} />}
        {metaLinks.map((link) => (
          <link rel="alternative" key={link.hrefLang} hrefLang={link.hrefLang} href={link.href} />
        ))}
      </Head>
      {LandingPageComponent}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  NewLandingPageProps | OldLandingPageProps
> = async (context) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (context.locale === 'default') {
    return { notFound: true }
  }

  try {
    const locale = context.locale as LocaleLabel
    const insurances = await Insurances.getInsurancesByLocaleLabel(locale)

    if (insurances.length === 0) {
      logger.error('Cannot render new-member page; no insurances found')
      return {
        notFound: true,
      }
    }

    const marketLabel = getMarketLabelFromLocaleLabel(locale)
    if (
      marketLabel === MarketLabel.SE ||
      Features.getFeature(Feature.TRAVEL_ACCIDENT_STANDALONE, marketLabel)
    ) {
      return {
        props: {
          ...(await serverSideTranslations(locale)),
          insurances,
          referer: context.req.headers.referer ?? null,
        },
      }
    }

    const formInitialState = insurances.reduce(
      (res, { fieldName, isPreselected }) => ({
        ...res,
        [fieldName]: isPreselected ?? false,
      }),
      {},
    )

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        mainCoverageInsurances: insurances.filter((insurance) => !insurance.isAdditionalCoverage),
        additionalCoverageInsurances: insurances.filter(
          (insurance) => insurance.isAdditionalCoverage,
        ),
        formInitialState,
        referer: context.req.headers.referer ?? null,
      },
    }
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }
}

const getMarketLabelFromLocaleLabel = (localeLabel: LocaleLabel) => {
  switch (localeLabel) {
    case 'se':
    case 'se-en':
      return MarketLabel.SE
    case 'dk':
    case 'dk-en':
      return MarketLabel.DK
    case 'no':
    case 'no-en':
      return MarketLabel.NO
  }
}

export default NewMemberPage
