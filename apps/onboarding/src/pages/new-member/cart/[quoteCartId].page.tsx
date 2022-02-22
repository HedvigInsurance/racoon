import { Footer, FooterProps } from './components/footer'
import type { GetServerSideProps, NextPage } from 'next'
import { QuoteCartDocument, QuoteCartQuery, QuoteCartQueryVariables } from '@/services/apollo/types'

import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/page-link'
import { YourInformation } from './components/your-information'
import { createApolloClient } from '@/services/apollo'
import { getBundlePrice } from './selectors/get-bundle-price'
import { getLocale } from '@/lib/l10n'
import { getSelectedBundleVariant } from './selectors/get-selected-bundle-variant'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Props = {
  footer: { price: FooterProps['price'] }
}

const NewMemberCartPage: NextPage<Props> = ({ footer }) => {
  return (
    <div>
      <YourInformation />

      <Footer {...footer} buttonText="Continue to checkout" buttonLinkTo={PageLink.landing()} />
    </div>
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

    return {
      props: {
        footer: {
          price: getBundlePrice(selectedVariant),
        },

        ...(await serverSideTranslations(locale as string)),
      },
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default NewMemberCartPage
