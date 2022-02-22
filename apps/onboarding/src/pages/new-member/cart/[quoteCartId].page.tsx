import type { GetServerSideProps, NextPage } from 'next'
import { QuoteCartDocument, QuoteCartQuery, QuoteCartQueryVariables } from '@/services/apollo/types'

import { LocaleLabel } from '@/lib/l10n/locales'
import { createApolloClient } from '@/services/apollo'
import { getLocale } from '@/lib/l10n'
import styled from '@emotion/styled'

type Props = {
  quoteCartId: string
  quoteCart: QuoteCartQuery['quoteCart']
}

const NewMemberCartPage: NextPage<Props> = ({ quoteCart }) => {
  return (
    <div>
      <main>{quoteCart.id}</main>
      <div>
        {quoteCart.bundle?.possibleVariations.map((variation) => (
          <div key={variation.id}>{variation.bundle.displayName}</div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale }) => {
  const quoteCartId = query.quoteCartId as string
  const currentLocale = getLocale(locale as LocaleLabel)
  const client = createApolloClient()

  try {
    const { data } = await client.query<QuoteCartQuery, QuoteCartQueryVariables>({
      query: QuoteCartDocument,
      variables: {
        id: quoteCartId,
        locale: currentLocale.isoLocale,
      },
    })

    return {
      props: {
        quoteCartId,
        quoteCart: data.quoteCart,
      },
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default NewMemberCartPage
