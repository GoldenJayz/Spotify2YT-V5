/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, MongoClient } from 'mongodb';

export default class Database {
	private readonly url: string;
	private readonly colName: string;
	private readonly client: MongoClient;
	private readonly dbName;
	private collection: Collection<any>;
	private db: any;

	public constructor(url: string, colName: string, dbName: string) {
		this.url = url;
		this.colName = colName;
		this.dbName = dbName;
		this.client = new MongoClient(this.url);
		this.collection = new Collection();
		this.connect(this.colName);
	}

	public connect(collectionName: string) {
		try {
			this.db = this.client.db(this.dbName);
			this.collection = this.db.collection(collectionName);

			return this.collection;
		} catch (err) {
			console.error(`Exception while connecting to collection: ${err}`);
			throw err;
		}
	}

	public listDocuments(id?: string) {
		let documents;
		if (id == undefined) documents = this.collection.find({}).toArray();
		else documents = this.collection.find({ id }).toArray();

		return documents;
	}

	public insertData(data: object[]) {
		let res: any;

		if (data.length > 1) res = this.collection.insertMany(data);
		else res = this.collection.insertOne(data[0]);
		return res;
	}

	public updateData(id: string, data: object) {
		const filter = { id: id };
		const update = { $set: data };
		const res = this.collection.updateOne(filter, update);
		return res;
	}

	public removeAllData() {
		const res = this.collection.deleteMany({});
		return res;
	}

	public close() {
		this.client.close();
	}
}
