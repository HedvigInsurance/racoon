import { faker } from '@faker-js/faker'

describe('NO Embark Flows', () => {
  faker.setLocale('nb_NO')
  const parameters = ['/no-en/new-member/home']

  parameters.forEach((flowUrl) => {
    it(`should get a Norwegian price quote (${flowUrl})`, () => {
      cy.visit(flowUrl, {
        onBeforeLoad: (win) => {
          win.sessionStorage.clear()
        },
      })

      // start
      cy.contains('button', 'Accept All Cookies', { timeout: 10000 }).click()
      cy.contains('button', 'My current apartment').click()

      // ownership
      cy.contains('button', 'I rent it', { timeout: 5000 }).click()

      // address
      const address = faker.address.streetAddress()
      cy.contains("What's the address?", { timeout: 5000 }).should('be.visible')
      cy.focused().type(address)
      cy.contains('Postal code')
        .parent()
        .siblings('input[type=text]')
        .type(`${faker.address.zipCode('####')}{enter}`)

      // size
      cy.contains('How many square meters is it?', { timeout: 5000 }).should('be.visible')
      cy.focused().type(`${faker.datatype.number({ min: 25, max: 100 })}{enter}`)

      // co-insured
      cy.contains('How many others would you like to be covered', { timeout: 5000 }).click()
      cy.focused().type(`${faker.datatype.number({ min: 0, max: 5 })}{enter}`)

      // name
      cy.contains("What's your name?", { timeout: 5000 }).should('be.visible')
      cy.focused().type(faker.name.firstName())
      cy.contains('Surname')
        .parent()
        .siblings('input[type=text]')
        .type(`${faker.name.lastName()}{enter}`)

      // birth-date
      cy.contains("What's your birth date?", { timeout: 5000 }).should('be.visible')
      const pastDate = faker.date.between('1940-01-01', '1990-01-01')
      const date = String(pastDate.getDate()).padStart(2, '0')
      const month = String(pastDate.getMonth() + 1).padStart(2, '0')
      const birthDate = `${date}-${month}-${pastDate.getFullYear()}`
      cy.focused().type(`${birthDate}{enter}`)

      // currently-insured
      cy.contains('button', 'Yes, I have contents insurance', { timeout: 5000 }).click()

      // current-insurer
      cy.contains('button', 'Fremtind', { timeout: 5000 }).click()

      // email
      cy.contains('Enter you email address', { timeout: 5000 }).should('be.visible')
      cy.focused().type(`${faker.internet.email()}{enter}`)

      // offer page
      cy.contains('Your price quote', { timeout: 10000 }).should('be.visible')
      cy.contains(address).should('be.visible')
    })
  })
})
