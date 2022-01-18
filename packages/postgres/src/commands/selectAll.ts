/// <reference types="cypress" />

import { Table } from "../models";
import { PgTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            pgSelectAll<T>(options: Table): Chainable<[T]>
        }
    }
}

Cypress.Commands.add(PgTask.SELECT_ALL, (options: Table) => {
    return cy.task(PgTask.SELECT_ALL, options)
});

export { };
