import { PgTask } from '@cypress-tools/postgres/tasks';
import { Person } from 'test/cypress/models/person';

describe('Postgres Tasks', () => {

    it('Task query', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        cy.task(PgTask.INSERT, { table: 'person', data: { name: 'me' } })
        // Test
        cy.task(PgTask.QUERY, 'SELECT * FROM person').then(data => {
            // Verify
            expect(data).to.deep.equal([{ id: 1, name: 'me' }])
        })
    })

    it('Task dropTable unknown table without error', () => {
        // Test
        cy.task(PgTask.DROP_TABLE, 'animals');
    })

    it('Task dropTable', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        cy.task(PgTask.QUERY, 'SELECT table_name FROM information_schema.columns').then(datas => {
            expect(datas).to.deep.include({ table_name: 'person' })
        });
        // Test
        cy.task(PgTask.DROP_TABLE, 'person');
        // Verify
        cy.task(PgTask.QUERY, 'SELECT table_name FROM information_schema.columns').then(datas => {
            expect(datas).to.not.deep.include({ table_name: 'person' })
        });
    })

    it('Task queryFile', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        // Test
        cy.task(PgTask.QUERY_FILE, 'cypress/fixtures/postgres/init.sql')
        // Verify
        cy.task<Person[]>(PgTask.SELECT_ALL, { table: 'person' }).then(datas => {
            expect(datas.length).equal(1)
            expect(datas[0]).to.deep.equal({ id: 1, name: 'myName' })
        })
    })

    it('Task deleteAll', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        cy.task(PgTask.INSERT, { table: 'person', data: { name: 'myName2' } }).then(data => {
            console.log(data)
            expect(data).to.deep.equal({ id: 1, name: 'myName2' })
        })
        cy.task<Person[]>(PgTask.SELECT_ALL, { table: 'person' }).then(datas => {
            expect(datas.length).equal(1)
            expect(datas[0]).to.deep.equal({ id: 1, name: 'myName2' })
        })
        // Test
        cy.task(PgTask.DELETE_ALL, 'person');
        // Verify
        cy.task<Person[]>(PgTask.SELECT_ALL, { table: 'person' }).then(datas => {
            expect(datas.length).equal(0)
        })
    })

    it('Task insertInto', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        // Test
        cy.task<Person[]>(PgTask.INSERT, { table: 'person', datas: [{ name: 'myName2' }, { name: 'myName3' }] }).then(datas => {
            expect(datas.length).equal(2)
            expect(datas[0]).to.deep.equal({ id: 1, name: 'myName2' })
            expect(datas[1]).to.deep.equal({ id: 2, name: 'myName3' })
        })
        // Verify
        cy.task<Person[]>(PgTask.SELECT_ALL, { table: 'person' }).then(datas => {
            expect(datas.length).equal(2)
            expect(datas[0]).to.deep.equal({ id: 1, name: 'myName2' })
            expect(datas[1]).to.deep.equal({ id: 2, name: 'myName3' })
        })
    })

    it('Task selectById', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        cy.task<Person>(PgTask.INSERT, { table: 'person', data: { name: 'selectById' } }).then(data => {
            // Test
            cy.task(PgTask.SELECT_BY_ID, { table: 'person', id: data.id }).then(data => {
                // Verify
                expect(data).to.deep.equal({ id: 1, name: 'selectById' })
            })
        })
    })

    it('Task selectAll', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        cy.task(PgTask.INSERT, { table: 'person', data: { name: 'selectById' } })
        // Test
        cy.task(PgTask.SELECT_ALL, { table: 'person', id: 1 }).then(data => {
            // Verify
            expect(data).to.deep.equal([{ id: 1, name: 'selectById' }])
        })
    })

    it('Task createTable', () => {
        // Init
        cy.task(PgTask.DROP_TABLE, 'person');
        cy.task(PgTask.QUERY, 'SELECT table_name FROM information_schema.columns').then(datas => {
            expect(datas).to.not.deep.include({ table_name: 'person' })
        });
        // Test
        cy.task(PgTask.CREATE_TABLE, { table: 'person', columns: [{ key: 'id', type: 'SERIAL' }, { key: 'name', type: 'VARCHAR(100)' }] })
        // Verify
        cy.task(PgTask.QUERY, 'SELECT table_name, column_name, data_type FROM information_schema.columns').then(datas => {
            expect(datas).to.deep.include({ table_name: 'person', column_name: 'id', data_type: 'integer' })
            expect(datas).to.deep.include({ table_name: 'person', column_name: 'name', data_type: 'character varying' })
        });
    })
})