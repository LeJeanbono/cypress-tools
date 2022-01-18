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

Cypress.Commands.add(MongoDBTask.FIND_ALL, (insert: Insert) => {
    return cy.task(MongoDBTask.FIND_ALL, insert)
});

export { };

