import { faker } from '@faker-js/faker'

it('should get a price quote for a Swedish house', () => {
  faker.setLocale('sv')

  cy.visit(`/se-en/new-member/home-accident-needer`)

  // eslint-disable-next-line testing-library/await-async-utils
  cy.wait(1000)
  cy.get('button').contains('Accept All Cookies').click()

  cy.contains('button', 'Home & Accident Insurance').click()

  cy.contains('button', 'House', { timeout: 1000 }).click()

  cy.contains('button', 'I own it', { timeout: 1000 }).click()

  cy.get('input[inputmode=numeric]', { timeout: 1000 }).type('971023-2068{enter}')

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

  // manual-info-villa
  cy.contains('p', 'square meters', { timeout: 1000 })
    .first()
    .siblings('input[type=number]')
    .type(faker.datatype.number({ min: 30, max: 120 }).toString())

  cy.contains('p', 'square meters', { timeout: 1000 })
    .last()
    .siblings('input[type=number]')
    .type(faker.datatype.number({ min: 0, max: 40 }).toString())

  cy.contains('span', 'Year of construction')
    .parent()
    .siblings('input[type=number]')
    .type(`${faker.datatype.number({ min: 1930, max: 2010 })}{enter}`)

  // baths
  cy.contains('button', 'Two bathrooms', { timeout: 1000 }).click()

  // floors
  cy.contains('button', 'Four floors or less', { timeout: 1000 }).click()

  // household-size-villa
  cy.contains('p', /^people*/)
    .siblings('input[type=number]')
    .type(`${faker.datatype.number({ min: 0, max: 6 })}{enter}`)

  // subletting
  cy.contains('button', "No, I don't sublet", { timeout: 1000 }).click()

  // extra-buildings
  cy.contains('button', 'extra-buildings', { timeout: 1000 }).click()

  // email-villa
  cy.get('input[type=email]', { timeout: 1000 }).type(`${faker.internet.email()}{enter}`)

  // offer page
  cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
  cy.contains(address).should('be.visible')
})
