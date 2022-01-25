import { MongoDBTask } from '@cypress-tools/mongodb/tasks';
import { Inserted } from '@cypress-tools/mongodb/models';
import { PersonMongoDB } from '../../models/person';

describe('MongoDB Tasks', () => {

    it('Task query', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        cy.task(MongoDBTask.INSERT, { collection: 'person', data: { name: 'myName' } })
        // Test
        cy.task<PersonMongoDB[]>(MongoDBTask.FIND_ALL, { collection: 'person' }).then(datas => {
            // Verify
            expect(datas.length).equal(1);
            assert.typeOf(datas[0]._id, 'string');
            expect(datas[0].name).equal('myName');
        });
    });

    it('Task Insert', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        // Test
        cy.task(MongoDBTask.INSERT, { collection: 'person', data: { name: 'myName' } })
        // Verify
        cy.task<PersonMongoDB[]>(MongoDBTask.FIND_ALL, { collection: 'person' }).then(datas => {
            expect(datas.length).equal(1);
            assert.typeOf(datas[0]._id, 'string');
            expect(datas[0].name).equal('myName');
        });
    });

    it('Task Insert datas', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        // Test
        cy.task(MongoDBTask.INSERT, { collection: 'person', datas: [{ name: 'myName' }, { name: 'otherName' }] })
        // Verify
        cy.task<PersonMongoDB[]>(MongoDBTask.FIND_ALL, { collection: 'person' }).then(datas => {
            expect(datas.length).equal(2);
            assert.typeOf(datas[0]._id, 'string');
            expect(datas[0].name).equal('myName');
            assert.typeOf(datas[1]._id, 'string');
            expect(datas[1].name).equal('otherName');
        });
    });

    it('Task FindAll', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        cy.task<Inserted>(MongoDBTask.INSERT, { collection: 'person', datas: [{ name: 'myName' }, { name: 'otherName' }] }).then(datasInserted => {
            console.log(datasInserted);
            // Test
            cy.task<PersonMongoDB[]>(MongoDBTask.FIND_ALL, { collection: 'person' }).then(datas => {
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

    it('Task FindById', () => {
        // Init
        // Test
        // Verify
    })

    it('Task Aggregate', () => {
        // Init
        cy.task(MongoDBTask.DROP_COLLECTION, 'person')
        cy.task(MongoDBTask.CREATE_COLLECTION, 'person')
        cy.task(MongoDBTask.INSERT, { collection: 'person', datas: [{ name: 'myName' }, { name: 'otherName' }] })
        // Test
        cy.task(MongoDBTask.AGGREGATE, { collection: 'person', pipeline: [{ $match: { name: "myName" } }, { $project: { name: 1, _id: 0 } }] }).then(datas => {
            // Verify
            expect(datas).to.deep.equal([{ name: 'myName' }])
        })
    })

});