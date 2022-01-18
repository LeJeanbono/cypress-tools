/// <reference types="cypress" />

import { MongoClient, WithId } from "mongodb";
import { Logger } from "./logger";
import { Aggregate, FindAll, FindById, Insert, MongoDBConfig, Query } from "./models";
import { find } from 'lodash';
export { Document } from "mongodb";

let configuration: Cypress.PluginConfigOptions;
let pluginConfig: MongoDBConfig;
// @ts-ignore
let logger: Logger;
let client: MongoClient;


export async function mongoDBTasks(config: Cypress.PluginConfigOptions, options: MongoDBConfig = new MongoDBConfig()) {
    configuration = config;
    pluginConfig = options;
    logger = new Logger(pluginConfig.debug);
    client = new MongoClient(`mongodb://${configuration.env.TOOL_MONGODB_USER}:${configuration.env.TOOL_MONGODB_PASSWORD}@${configuration.env.TOOL_MONGODB_HOST}:${configuration.env.TOOL_MONGODB_PORT}`);
    await client.connect()
    return {
        mongodbCreateCollection,
        mongodbDropCollection,
        mongodbInsert,
        mongodbFind,
        mongodbFindAll,
        mongodbFindById,
        mongodbAggregate
    }
}

export async function mongodbCreateCollection(collection: string) {
    await client.db().createCollection(collection)
    logger.log(`CREATED ${collection}`)
    return new Promise((resolve) => resolve(true))
}

export async function mongodbDropCollection(collection: string) {
    if (await isCollectionExist(collection)) {
        logger.log(`DROP ${collection}`)
        return client.db().collection(collection).drop()
    } else {
        logger.log('EXIST PAS')
        return new Promise(resolve => resolve(true));
    }
}

export async function mongodbInsert(insert: Insert) {
    if (insert.datas) {
        return new Promise((resolve, reject) => {
            if (insert.datas) {
                Promise.all(insert.datas.map(data => {
                    console.log(data)
                    return mongodbInsert({ data, collection: insert.collection })
                })).then(datas => {
                    console.log(datas)
                    resolve(datas)
                }).catch(e => reject(e))
            }
        })
    }
    return client.db().collection(insert.collection).insertOne(insert.data);
}

export async function mongodbFind<Document>(find: Query<Document>) {
    return client.db().collection(find.collection).find({}, find.filterOptions);
}

export async function mongodbFindAll<Document>(findAll: FindAll): Promise<WithId<Document>[] | null> {
    logger.log('FIND ALL ' + findAll.collection);
    return new Promise((resolve, reject) => {
        client.db().collection(findAll.collection).find().toArray((error, docs) => {
            if (error) {
                reject(error)
            }
            if (docs === undefined) {
                resolve(null);
            }
            // @ts-ignore
            resolve(docs);
        });
    });
}

export async function mongodbFindById(findById: FindById) {
    findById.idKey = findById.idKey ?? '_id';
    client.db().collection(findById.collection).findOne()
}

export async function mongodbAggregate(aggregate: Aggregate) {
    return new Promise((resolve, reject) => {
        client.db().collection(aggregate.collection).aggregate(aggregate.pipeline).toArray((error, docs) => {
            if (error) {
                reject(error)
            }
            if (docs === undefined) {
                resolve(null);
            }
            // @ts-ignore
            resolve(docs);
        });
    });
}

async function isCollectionExist(collection: string) {
    const dbCollections = await client
        .db()
        .listCollections()
        .toArray();
    return Boolean(find(dbCollections, { name: collection }));
}