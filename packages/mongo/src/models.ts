import { Filter, FindOptions, WithId, ObjectId } from "mongodb";

export class MongoDBConfig {
    debug = false;
}

export interface Insert extends Collection {
    data?: any,
    datas?: any[]
}

export interface Collection {
    collection: string;
}

export interface Query<TSchema> extends Collection {
    filter: Filter<WithId<TSchema>>,
    filterOptions?: FindOptions
}

export interface FindAll extends Collection {

}

export interface FindById extends Collection {
    idKey?: string;
    id: string | number;
}

export interface Aggregate extends Collection {
    pipeline: Document[]
}

export interface Inserted {
    acknowledged: boolean;
    insertedId: ObjectId;
}
