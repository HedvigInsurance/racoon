import type { BundledQuote } from './get-main-quote'
import { Table } from '../types'

const getAddress = (quote: BundledQuote) => {
  const { street, zipCode, city } = quote.data
  return [street, zipCode, city].filter((item) => item).join(', ')
}

export const getInformationTable = (quote: BundledQuote): Table => {
  return {
    rows: [
      {
        title: 'CHECKOUT_DETAILS_ADDRESS',
        value: {
          type: 'text',
          text: getAddress(quote),
        },
      },
      {
        title: 'CHECKOUT_DETAILS_LIVING_SPACE',
        value: {
          type: 'translation',
          key: 'CHECKOUT_DETAILS_SQM_VALUE',
          variables: {
            VALUE: quote.data.livingSpace,
          },
        },
      },
    ],
  }
}
