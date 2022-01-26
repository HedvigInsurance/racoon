import { faker } from '@faker-js/faker'

it('should get a price quote for a Swedish house', async () => {
  faker.setLocale('sv')

  cy.visit(`/se-en/new-member/home-accident-needer`, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear()
    },
  })

  // insurance-type
  cy.contains('button', 'Accept All Cookies', { timeout: 10000 }).click()
  cy.contains('button', 'Home & Accident Insurance').click()

  // home-type
  cy.contains('button', 'House', { timeout: 1000 }).click()

  // home-type-villa
  cy.contains('button', 'I own it', { timeout: 1000 }).click()

  // personal-number-villa
  cy.contains('All we need now is your personal identity number.', { timeout: 5000 }).should(
    'be.visible',
  )
  cy.focused().type('971023-2068{enter}')

  // manual-name-villa
  cy.contains("What's your name?", { timeout: 5000 }).should('be.visible')
  cy.focused().type(faker.name.firstName())
  cy.contains('Surname')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.name.lastName()}{enter}`)

  // manual-address-villa
  const address = faker.address.streetAddress()
  cy.contains('What address do you want an offer for?', { timeout: 5000 }).should('be.visible')
  cy.focused().type(address)
  cy.contains('Postal code')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.address.zipCode('### ##')}{enter}`)

  // manual-info-villa
  cy.contains("We can't fetch any information about your house.", { timeout: 5000 }).should(
    'be.visible',
  )
  cy.focused().type(faker.datatype.number({ min: 30, max: 120 }).toString())
  cy.contains('span', 'Ancillary area')
    .parent()
    .parent()
    .find('input[type=number]')
    .type(faker.datatype.number({ min: 0, max: 40 }).toString())
  cy.contains('span', 'Year of construction')
    .parent()
    .parent()
    .find('input[type=number]')
    .type(`${faker.datatype.number({ min: 1930, max: 2010 })}{enter}`)

  // baths
  cy.contains('button', 'Two bathrooms', { timeout: 1000 }).click()

  // floors
  cy.contains('button', 'Four floors or less', { timeout: 1000 }).click()

  // household-size-villa
  cy.contains('How many people should be covered', { timeout: 5000 }).should('be.visible')
  cy.focused().type(`${faker.datatype.number({ min: 0, max: 6 })}{enter}`)

  // subletting
  cy.contains('button', "No, I don't sublet", { timeout: 1000 }).click()

  // extra-buildings
  cy.contains('button', 'Continue', { timeout: 1000 }).click()

  // email-villa
  cy.contains('OK, we are almost there.', { timeout: 5000 }).should('be.visible')
  cy.focused().type(`${faker.internet.email()}{enter}`)

  // offer page
  cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
  cy.contains(address).should('be.visible')
})
