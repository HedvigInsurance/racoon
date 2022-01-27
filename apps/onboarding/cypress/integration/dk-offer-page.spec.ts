import faker from '@faker-js/faker'
import { getRandomIsoBirthDate } from './helpers'

const QUOTE_CART_MUTATION = /* GraphQL */ `
  mutation CreateOnboardingQuoteCart {
    onboardingQuoteCart_create(input: { market: DENMARK, locale: "en_DK" }) {
      id
    }
  }
`

const QUOTE_BUNDLE_MUTATION = /* GraphQL */ `
  mutation CreateQuoteBundle($id: ID!, $input: CreateQuoteBundleInput!) {
    quoteCart_createQuoteBundle(id: $id, input: $input) {
      ... on QuoteCart {
        id
        bundle {
          quotes {
            id
          }
        }
      }
      ... on QuoteBundleError {
        message
        type
        limits {
          code
        }
      }
    }
  }
`

const HOME_CONTENT_QUOTE = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  birthDate: getRandomIsoBirthDate(),
  data: {
    type: 'DANISH_HOME_CONTENT',
    street: faker.address.streetAddress(),
    zipCode: faker.address.zipCode('####'),
    city: faker.address.city(),
    numberCoInsured: faker.datatype.number({ min: 0, max: 5 }),
    livingSpace: faker.datatype.number({ min: 30, max: 120 }),
    subType: 'RENT',
    isStudent: false,
  },
}

describe('DK Offer Page', () => {
  faker.setLocale('en')

  it('should display a Danish price quote', async () => {
    cy.request('POST', 'https://graphql.dev.hedvigit.com/graphql', {
      query: QUOTE_CART_MUTATION,
    }).then((response) => {
      const quoteCartId = response.body.data.onboardingQuoteCart_create.id
      console.log(quoteCartId)

      cy.request('POST', 'https://graphql.dev.hedvigit.com/graphql', {
        query: QUOTE_BUNDLE_MUTATION,
        variables: {
          id: quoteCartId,
          input: {
            payload: [HOME_CONTENT_QUOTE],
          },
        },
      }).then(() => {
        cy.visit(`/dk-en/new-member/offer/${quoteCartId}`)

        cy.contains('button', 'Accept All Cookies', { timeout: 10000 }).click()

        cy.contains('Your price quote').should('be.visible')
        cy.contains(HOME_CONTENT_QUOTE.firstName).should('be.visible')
        cy.contains(HOME_CONTENT_QUOTE.data.street).should('be.visible')

        cy.contains('button', 'Update details').click()
        const $form = cy.contains('Your information', { timeout: 5000 }).parent()
        const newFirstName = faker.name.firstName()
        $form.find('input[name=firstName]').clear().type(`${newFirstName}{enter}`)
        cy.contains(newFirstName).should('be.visible', { timeout: 2000 })

        cy.contains('button', 'Add discount code').click()
        const discountCode = 'hedvig20'
        cy.get('input[name=code]').type(`${discountCode}{enter}`)
        cy.contains('20% discount for 5 months').should('be.visible')
      })
    })
  })
})
