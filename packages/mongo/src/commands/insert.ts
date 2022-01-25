/// <reference types="cypress" />

import { Insert } from "../models";
import { MongoDBTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            mongodbInsert<Inserted>(insert: Insert): Chainable<[Inserted]>
        }
    }
}

Cypress.Commands.add(MongoDBTask.INSERT, (insert: Insert) => {
    return cy.task(MongoDBTask.INSERT, insert)
});

export { };

