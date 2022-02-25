import type { BundledQuote } from './get-main-quote'
import { Table } from '../types'

const getAddress = (quote: BundledQuote) => {
  const { street, zipCode, city } = quote.data
  const address = `${street} \n ${zipCode} ${city || ''}`
  return address
}

const getName = (quote: BundledQuote) => {
  const { firstName, lastName } = quote.data
  return [firstName, lastName].join(' ')
}

export const getInformationTable = (quote: BundledQuote): Table => {
  return {
    rows: [
      {
        title: 'Name',
        value: { type: 'text', text: getName(quote) },
      },
      {
        title: 'CHECKOUT_DETAILS_ADDRESS',
        value: { type: 'text', text: getAddress(quote) },
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
