describe('Forever page flow', () => {
  it('should load Forever page', () => {
    const foreverCode = 'ABC1234'

    cy.visit(`/se-EN/forever/${foreverCode}`)
    cy.get('[data-cy=code-input]').should('have.value', foreverCode)
  })
})
