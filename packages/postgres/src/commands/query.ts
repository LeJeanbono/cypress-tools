/// <reference types="cypress" />

import { PgTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            pgQuery<T>(query: string): Chainable<[T]>
        }
    }
}

Cypress.Commands.add(PgTask.QUERY, (query: string) => {
    return cy.task(PgTask.QUERY, query)
});

export { }