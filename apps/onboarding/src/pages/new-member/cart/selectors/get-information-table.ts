import type { BundledQuote } from './get-main-quote'
import { Table } from '../types'

const getAddress = (quote: BundledQuote) => {
  const { street, zipCode, city } = quote.data
  return [street, zipCode, city].filter((item) => item).join(', ')
}

const getName = (quote: BundledQuote) => {
  const { firstName, lastName } = quote.data
  return [firstName, lastName].join(' ')
}

const getHouseholdSize = (quote: BundledQuote) => {
  const { numberCoInsured } = quote.data
  return (numberCoInsured as number) + 1
}

export const getInformationTable = (quote: BundledQuote): Table => {
  const householdSize = getHouseholdSize(quote)

  return {
    rows: [
      {
        title: 'Name',
        value: { type: 'text', text: getName(quote) },
      },
      {
        title: 'CHECKOUT_DETAILS_HOUSEHOLD_SIZE',
        value: {
          type: 'translation',
          key:
            householdSize > 1 ? 'CHECKOUT_DETAILS_PERSONS_VALUE' : 'CHECKOUT_DETAILS_SINGLE_PERSON',
          variables: {
            VALUE: householdSize.toString(),
          },
        },
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
