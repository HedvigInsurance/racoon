import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LandingPage, LandingPageProps } from '@/components/LandingPage/LandingPage'
import { SwedishLandingPage } from '@/components/SwedishLandingPage/SwedishLandingPage'
import { useCurrentLocale } from '@/lib/l10n'
import { LocaleData, LocaleLabel, locales, LOCALE_URL_PARAMS } from '@/lib/l10n/locales'
import { MarketLabel } from '@/lib/types'
import { TypeOfContract } from '@/services/graphql/generated'
import { Insurances, Insurance } from '@/services/insurances'

const SELECTED_INSURANCE_QUERY_KEY = 'type'

type MetaLinks = Pick<LocaleData, 'hrefLang' | 'path'> & {
  href: string
}

const metaLinks: MetaLinks[] = LOCALE_URL_PARAMS.map((locale) => ({
  hrefLang: locales[locale].hrefLang,
  path: locales[locale].path,
  href: `https://www.hedvig.com/${locales[locale].path}/new-member`,
}))

const NewMemberPage = (props: LandingPageProps) => {
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
        <SwedishLandingPage {...props} />
      ) : (
        <LandingPage {...props} />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<LandingPageProps> = async (context) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (context.locale === 'default') {
    return { notFound: true }
  }

  try {
    const locale = context.locale as LocaleLabel
    const insurances = await Insurances.getInsurancesByLocaleLabel(locale)

    if (insurances.length === 0) {
      console.error('Cannot render new-member page; no insurances found')
      return {
        notFound: true,
      }
    }

    const preSelectedInsurances = (context.query[SELECTED_INSURANCE_QUERY_KEY] ?? []) as Array<
      Insurance['typeOfContract']
    >
    const sortedInsurances = getSortedInsurances(insurances, preSelectedInsurances)

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        insurances: sortedInsurances,
        preSelectedInsurances,
        referer: context.req.headers.referer ?? null,
      },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

const typePriority = (insurance: Insurance) => {
  const type = insurance.typeOfContract

  if (type.includes('HOME_CONTENT') || type.includes('HOUSE')) {
    return 0
  }

  if (type.includes('TRAVEL')) {
    return 1
  }

  return 2
}

const selectionStatePriority = (
  insurance: Insurance,
  selectedInsurances: Array<Insurance['typeOfContract']>,
) => {
  return selectedInsurances.includes(insurance.typeOfContract) ? 0 : 1
}

const getSortedInsurances = (insurances: Insurance[], preSelectedInsurances: TypeOfContract[]) => {
  return insurances
    .sort((a, b) => typePriority(a) - typePriority(b))
    .sort(
      (a, b) =>
        selectionStatePriority(a, preSelectedInsurances) -
        selectionStatePriority(b, preSelectedInsurances),
    )
}

export default NewMemberPage
