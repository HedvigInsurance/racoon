import { Footer, FooterProps } from './components/footer'
import type { GetServerSideProps, NextPage } from 'next'
import { QuoteCartDocument, QuoteCartQuery, QuoteCartQueryVariables } from '@/services/apollo/types'
import { Benefits } from './components/benefits'
import { Hero } from './components/hero'
import { Intro } from './components/intro'
import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLayout } from '../start/components/page-layout'
import { PageLink } from '@/lib/page-link'
import { Table } from './types'
import { YourInformation } from './components/your-information'
import { createApolloClient } from '@/services/apollo'
import { getBundlePrice } from './selectors/get-bundle-price'
import { getInformationTable } from './selectors/get-information-table'
import { getLocale } from '@/lib/l10n'
import { getMainQuote } from './selectors/get-main-quote'
import { getSelectedBundleVariant } from './selectors/get-selected-bundle-variant'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Props = {
  intro: { price: FooterProps['price'] }
  footer: { price: FooterProps['price'] }
  yourInformation: Table
}

const NewMemberCartPage: NextPage<Props> = ({ intro, footer, yourInformation }) => {
  return (
    <PageLayout headerVariant="light">
      <Hero />
      <Intro {...intro} />
      <YourInformation table={yourInformation} />
      <Benefits />
      <Footer {...footer} buttonText="Continue to checkout" buttonLinkTo={PageLink.landing()} />
    </PageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale }) => {
  const quoteCartId = query.quoteCartId as string
  const selectedInsuranceTypes = (query.type || []) as string[]
  const currentLocale = getLocale(locale as LocaleLabel)
  const client = createApolloClient()

  try {
    const { data } = await client.query<QuoteCartQuery, QuoteCartQueryVariables>({
      query: QuoteCartDocument,
      variables: { id: quoteCartId, locale: currentLocale.isoLocale },
    })

    const selectedVariant = getSelectedBundleVariant(data, selectedInsuranceTypes)
    const mainQuote = getMainQuote(selectedVariant)
    const price = getBundlePrice(selectedVariant)

    return {
      props: {
        intro: { price },
        yourInformation: getInformationTable(mainQuote),
        footer: { price },

        ...(await serverSideTranslations(locale as string)),
      },
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default NewMemberCartPage
