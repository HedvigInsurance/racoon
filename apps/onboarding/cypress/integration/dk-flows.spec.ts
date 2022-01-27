import { faker } from '@faker-js/faker'
import { getRandomBirthDateDK } from './helpers'

describe('DK Embark Flows', () => {
  faker.setLocale('en')
  const parameters = [
    '/dk-en/new-member/home-needer',
    '/dk-en/new-member/home-accident-needer',
    '/dk-en/new-member/home-accident-travel-needer',
  ]

  parameters.forEach((flowUrl) => {
    it(`should get a Danish price quote (${flowUrl})`, () => {
      cy.visit(flowUrl, {
        onBeforeLoad: (win) => {
          win.sessionStorage.clear()
        },
      })

      // ownership
      cy.contains('button', 'Accept All Cookies', { timeout: 10000 }).click()
      cy.contains('button', 'I rent it').click()

      // size
      cy.contains('Okay. How many square meters is it?', { timeout: 5000 }).should('be.visible')
      cy.focused().type(`${faker.datatype.number({ min: 25, max: 100 })}{enter}`)

      // address
      const address = 'Dansborg Alle 2, 1. tv'
      cy.contains('Enter your home address', { timeout: 5000 }).click()
      cy.focused().type('Dansborg{downarrow}')
      cy.contains('Dansborg Alle', { timeout: 1000 }).click()
      cy.contains('Dansborg Alle 1', { timeout: 1000 }).first().click()
      cy.contains(address, { timeout: 1000 }).click()
      cy.contains('button', 'Continue', { timeout: 1000 }).click()

      // co-insured
      cy.contains('Great. How many people will the insurance cover?', { timeout: 5000 }).click()
      cy.focused().type(`${faker.datatype.number({ min: 1, max: 5 })}{enter}`)

      // name
      cy.contains('First name', { timeout: 5000 })
        .parent()
        .siblings('input[type=text]')
        .type(faker.name.firstName())
      cy.contains('Surname')
        .parent()
        .siblings('input[type=text]')
        .type(`${faker.name.lastName()}{enter}`)

      // birth-date
      cy.contains('And your date of birth?', { timeout: 5000 }).should('be.visible')
      cy.focused().type(`${getRandomBirthDateDK()}{enter}`)

      // email
      cy.contains('Lastly, your email address?', { timeout: 5000 }).should('be.visible')
      cy.focused().type(`${faker.internet.email()}{enter}`)

      // offer page
      cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
      cy.contains(address).should('be.visible')
    })
  })
})
