/// <reference types="cypress" />

import { Aggregate } from "../models";
import { MongoDBTask } from "../tasks";

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            mongodbAggregate<T>(aggregate: Aggregate): Chainable<[T]>
        }
    }
}

Cypress.Commands.add(MongoDBTask.AGGREGATE, (aggregate: Aggregate) => {
    return cy.task(MongoDBTask.AGGREGATE, aggregate)
});

export { };
