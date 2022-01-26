import { faker } from '@faker-js/faker'

it('should get a price quote for a Swedish apartment', () => {
  faker.setLocale('sv')

  cy.visit(`/se-en/new-member/home-accident-needer`, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear()
    },
  })

  // insurance-type
  cy.contains('button', 'Accept All Cookies', { timeout: 10000 }).click()
  cy.contains('button', 'Home Insurance').click()

  // home-type
  cy.contains('button', 'Apartment', { timeout: 1000 }).click()

  // home-type-apartment
  cy.contains('button', 'I own it', { timeout: 1000 }).click()

  // living-space-apartment
  cy.contains('How big is the apartment?', { timeout: 5000 }).should('be.visible')
  cy.focused().type(`${faker.datatype.number({ min: 30, max: 120 })}{enter}`)

  // household-size-apartment
  cy.contains('How many people should be covered by the insurance?', { timeout: 5000 }).should(
    'be.visible',
  )
  cy.focused().type(`${faker.datatype.number({ min: 1, max: 6 })}{enter}`)

  // personal-number-apartment
  cy.contains('All we need now is your personal identity number.', { timeout: 5000 }).should(
    'be.visible',
  )
  cy.focused().type('021118-8941{enter}')

  // name
  cy.contains("What's your name?", { timeout: 5000 }).should('be.visible')
  cy.focused().type(faker.name.firstName())

  cy.contains('Surname')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.name.lastName()}{enter}`)

  // new-address-apartment
  const address = faker.address.streetAddress()
  cy.contains('What address do you want an offer for?', { timeout: 5000 }).should('be.visible')
  cy.focused().type(address)
  cy.contains('Postal code')
    .parent()
    .siblings('input[type=text]')
    .type(`${faker.address.zipCode('### ##')}{enter}`)

  // email-apartment
  cy.contains('OK, we are almost there.', { timeout: 5000 }).should('be.visible')
  cy.focused().type(`${faker.internet.email()}{enter}`)

  // offer page
  cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
  cy.contains(address).should('be.visible')
})
