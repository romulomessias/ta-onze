describe('play sound', () => {
    it("should load aplication", () => {
        cy.visit("http://localhost:3000/")
    })

    it("should render at least one playlist card", () => {
        cy.get('[data-cy=playlistCard]').should('exist')
    }) 
})