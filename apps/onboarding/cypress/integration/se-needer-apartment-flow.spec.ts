import { faker } from '@faker-js/faker'

it('should get a price quote for a Swedish apartment', () => {
  faker.setLocale('sv')

  cy.visit(`/se-en/new-member/home-accident-needer`)

  // eslint-disable-next-line testing-library/await-async-utils
  cy.wait(1000)
  cy.get('button').contains('Accept All Cookies').click()

  cy.contains('button', 'Home Insurance').click()

  cy.contains('button', 'Apartment', { timeout: 1000 }).click()

  cy.contains('button', 'I own it', { timeout: 1000 }).click()

  cy.contains('p', 'square meters', { timeout: 1000 })
    .siblings('input[type=number]')
    .type('55{enter}')

  cy.contains('p', /^people*/)
    .siblings('input[type=number]')
    .type('2{enter}')

  cy.get('input[inputmode=numeric]', { timeout: 1000 }).type('021118-8941{enter}')

  cy.contains('First name', { timeout: 5000 })
    .parent()
    .siblings('input[type=text]')
    .type(faker.name.firstName())
  cy.contains('Surname')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.name.lastName()}{enter}`)

  const address = faker.address.streetAddress()
  cy.contains('Address', { timeout: 1000 }).parent().siblings('input[type=text]').type(address)
  cy.contains('Postal code')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.address.zipCode('### ##')}{enter}`)

  cy.get('input[type=email]', { timeout: 1000 }).type(`${faker.internet.email()}{enter}`)

  cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
  cy.contains(address).should('be.visible')
})
