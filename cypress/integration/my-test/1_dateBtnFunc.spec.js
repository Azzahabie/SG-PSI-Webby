describe('Date Button Is Working', () => {
    it('Button Present', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#btn_calendarContainer').children().should('have.class', 'button1')
    })
    it('Button Is Clickable', () => {
        cy.get('#btn_calendarContainer').children().click()
    })
    it('Calendar Shows Data', () => {
        cy.get('abbr')
    })
    it('Calendar Date is clickable', () => {
        cy.get('abbr').contains('1').click()
    })
    it('Main Container Found"', () => {
        cy.get('#mainContainer')
    })
    it('My Header Present"', () => {
        cy.get('#myHeader')
    })
    it('SVG container Present"', () => {
        cy.get('#svgContainer')
    })
    it('SVG Present"', () => {
        cy.get('#svgContainer')
    })
    it('Date Info Present', () => {
        cy.get('#dateChosen')
    })
    it('5 Avg Data Present', () => {
        cy.get('#averageDataContainer').children().should('have.length', 5)
    })
    it('Choose data button Present', () => {
        cy.get('#btn_calendarContainer').children().should('have.class', 'button1')
    })
    it('Range Container Present', () => {
        cy.get('#rangeContainer').children().should('have.length', 5)
    })
    it('Chart Container Present', () => {
        cy.get('#chartContainer')
    })
    it('Table Container Present', () => {
        cy.get('#tableContainer')
    })
    it('Table Header Present', () => {
        cy.get('#tableContainer').contains('National')
        cy.get('#tableContainer').contains('North')
        cy.get('#tableContainer').contains('South')
        cy.get('#tableContainer').contains('East')
        cy.get('#tableContainer').contains('West')
        cy.get('#tableContainer').contains('Time')
    })
})