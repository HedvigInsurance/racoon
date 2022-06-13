import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LandingPage, LandingPageProps } from '@/components/LandingPage/LandingPage'
import {
  getInsurancesByLocaleLabel,
  getMainCoverageInsurances,
  getAdditionalCoverageInsurances,
  getFormInitialState,
} from '@/components/LandingPage/LandingPage.helpers'
import { SwedishLandingPage } from '@/components/SwedishLandingPage/SwedishLandingPage'
import { useCurrentLocale } from '@/lib/l10n'
import { LocaleData, LocaleLabel, locales, LOCALE_URL_PARAMS } from '@/lib/l10n/locales'
import { MarketLabel } from '@/lib/types'

type MetaLinks = Pick<LocaleData, 'hrefLang' | 'path'> & {
  href: string
}

const metaLinks: MetaLinks[] = LOCALE_URL_PARAMS.map((locale) => ({
  hrefLang: locales[locale].hrefLang,
  path: locales[locale].path,
  href: `https://www.hedvig.com/${locales[locale].path}/new-member`,
}))

const NewMemberPage: NextPage<LandingPageProps> = ({
  mainCoverageInsurances,
  additionalCoverageInsurances,
  formInitialState,
}) => {
  const { t } = useTranslation()
  const { marketLabel, path } = useCurrentLocale()

  const canonicalLink = metaLinks.find((link) => link.path === path)?.href

  return (
    <>
      <Head>
        <title>{t('STARTPAGE_PAGE_TITLE')}</title>
        {canonicalLink && <link rel="canonical" href={canonicalLink} />}
        {metaLinks.map((link) => (
          <link rel="alternative" key={link.hrefLang} hrefLang={link.hrefLang} href={link.href} />
        ))}
      </Head>
      {marketLabel === MarketLabel.SE ? (
        <SwedishLandingPage mainCoverageInsurances={mainCoverageInsurances} />
      ) : (
        <LandingPage
          mainCoverageInsurances={mainCoverageInsurances}
          additionalCoverageInsurances={additionalCoverageInsurances}
          formInitialState={formInitialState}
        />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps<LandingPageProps> = async (context) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (context.locale === 'default') {
    return { notFound: true }
  }

  const locale = context.locale as LocaleLabel
  const insurances = getInsurancesByLocaleLabel(locale)

  if (insurances.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      mainCoverageInsurances: getMainCoverageInsurances(insurances),
      additionalCoverageInsurances: getAdditionalCoverageInsurances(insurances),
      formInitialState: getFormInitialState(insurances),
    },
  }
}

export default NewMemberPage
