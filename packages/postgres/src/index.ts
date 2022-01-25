/// <reference types="cypress" />
/// <reference types="pg" />

import * as fs from "fs";
import { Client, QueryResult } from 'pg';
import { Logger } from '@cypress-tools/common';
import { Column, InsertInto, PgConfig, SelectById, Table } from './models';

let configuration: Cypress.PluginConfigOptions;
let pluginConfig: PgConfig
let client: Client;
let logger: Logger;

function init(config: Cypress.PluginConfigOptions, options: PgConfig) {
    configuration = config;
    pluginConfig = options;
    client = new Client({
        user: configuration.env.TOOL_PG_USER,
        host: configuration.env.TOOL_PG_HOST,
        database: configuration.env.TOOL_PG_DB,
        password: configuration.env.TOOL_PG_PASSWORD,
        port: configuration.env.TOOL_PG_PORT,
    })
    client.connect()
    logger = new Logger(pluginConfig.debug);
}

function queryRows<T>(query: string): Promise<T[]> {
    logger.log(query);
    return new Promise((resolve, reject) => {
        client.query(query, (err: Error, res: QueryResult<T>) => {
            if (err) {
                return reject(err);
            }
            resolve(res.rows);
        })
    })
}

function queryFirstRow<T>(query: string): Promise<T> {
    return new Promise((resolve, reject) => {
        client.query(query, (err: Error, res: QueryResult<T>) => {
            if (err) {
                return reject(err);
            }
            resolve(res.rows[0]);
        })
    })
}

export const pgTasks = (config: Cypress.PluginConfigOptions, options: PgConfig = new PgConfig()) => {
    init(config, options)
    return {
        pgQuery,
        pgSelectAll,
        pgQueryFile,
        pgDeleteAll,
        pgInsertInto,
        pgDropTable,
        pgCreateTable,
        pgSelectById
    }
}

export function pgQuery<T>(query: string): Promise<T[]> {
    return queryRows(query);
}

export function pgSelectAll<T>(options: Table): Promise<T[]> {
    const query = `SELECT * FROM ${options.table}`;
    return queryRows(query);
}

export function pgQueryFile<T>(filePath: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (errP, data) => {
            if (errP) {
                reject(errP);
            }
            logger.log(data.toString());
            client.query(data.toString(), (err: Error, res: QueryResult<T>) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows ?? 'VIDE');
            })
        });
    })
}

export function pgDeleteAll<T>(table: string): Promise<T[]> {
    const query = `DELETE FROM ${table}`;
    return queryRows(query);
}

export function pgInsertInto(options: InsertInto): Promise<any> {
    if (options.datas) {
        return new Promise((resolve, reject) => {
            if (options.datas) {
                Promise.all(options.datas.map(data => pgInsertInto({ table: options.table, data }))).then(datas => {
                    resolve(datas)
                }).catch(e => reject(e))
            }
        })
    }
    if (options.data) {
        const keys = Object.keys(options.data);
        let values = "";
        keys.map((key, index) => {
            values += `'${options.data[key]}'`
            if (index != keys.length - 1) {
                values += ','
            }
        })
        let insertQuery = `INSERT INTO ${options.table}(${keys.join()}) VALUES(${values})`;
        logger.log(insertQuery)
        insertQuery += ' RETURNING *';
        return queryFirstRow(insertQuery);
    }
    throw new Error('Need to specify data or datas attribute')
}

export function pgDropTable(table: string) {
    const query = `DROP TABLE IF EXISTS ${table}`
    console.log(query)
    return queryRows(query)
}

export function pgCreateTable(options: { table: string, columns: Column[] }) {
    let queryColumns = '';
    options.columns.map((column, index) => {
        queryColumns += `${column.key} ${column.type}`
        if (index != options.columns.length - 1) {
            queryColumns += ','
        }
    })
    const query = `CREATE TABLE ${options.table}(${queryColumns})`;
    return queryRows(query);
}

export function pgSelectById(options: SelectById) {
    options.idKey = options.idKey ?? 'id'
    const query = `SELECT * FROM ${options.table} WHERE ${options.idKey} = ${options.id}`;
    logger.log(query)
    return queryFirstRow(query);
}
