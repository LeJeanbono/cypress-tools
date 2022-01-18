import { MongoDBTask } from '@cypress-tools/mongodb/tasks'
import { PersonMongoDB } from 'test/cypress/models/person';

describe('MongoDB Commands', () => {

    it('Command Aggregate', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        cy.task(MongoDBTask.INSERT, { collection: 'person', datas: [{ name: 'myName' }, { name: 'otherName' }] })
        // Test
        cy.mongodbAggregate<PersonMongoDB[]>({ collection: 'person', pipeline: [{ $match: { name: "myName" } }, { $project: { name: 1, _id: 0 } }] }).then(datas => {
            // Verify
            expect(datas).to.deep.equal([{ name: 'myName' }])
        });
    });

    it('Command FindAll', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        cy.mongodbInsert({ collection: 'person', datas: [{ name: 'myName' }, { name: 'otherName' }] }).then(datasInserted => {
            console.log(datasInserted);
            // Test
            cy.mongodbFindAll<PersonMongoDB>({ collection: 'person' }).then(datas => {
                console.log(datas);
                // Verify
                expect(datas.length).equal(2);
                expect(datas[0]._id).equal(datasInserted[0].insertedId);
                expect(datas[0].name).equal('myName');
                expect(datas[1]._id).equal(datasInserted[1].insertedId);
                expect(datas[1].name).equal('otherName');
            });
        })
    });

});