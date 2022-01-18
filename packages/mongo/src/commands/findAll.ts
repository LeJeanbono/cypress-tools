/// <reference types="cypress" />

import { FindAll } from "../models";
import { MongoDBTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            mongodbFindAll<T>(findAll: FindAll): Chainable<[T]>
        }
    }
}

Cypress.Commands.add(MongoDBTask.FIND_ALL, (findAll: FindAll) => {
    return cy.task(MongoDBTask.FIND_ALL, findAll)
});

export { };

