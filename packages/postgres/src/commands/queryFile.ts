/// <reference types="cypress" />

import { PgTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            pgQueryFile(filePath: string): void
        }
    }
}

Cypress.Commands.add(PgTask.QUERY_FILE, (filePath: string) => {
    cy.task(PgTask.QUERY_FILE, filePath)
});

export { };
