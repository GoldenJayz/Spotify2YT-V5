"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Database {
    constructor(url, colName) {
        this.url = url;
        this.colName = colName;
        this.client = new mongodb_1.MongoClient(this.url);
        this.connect(this.colName);
    }
    connect(collectionName) {
        try {
            this.db = this.client.db('Spotify2Yt');
            this.collection = this.db.collection(collectionName);
            return this.collection;
        }
        catch (err) {
            console.error(`Exception while connecting to collection: ${err}`);
            throw err;
        }
    }
    listDocuments() {
        try {
            const documents = this.collection.find({}).toArray();
            return documents;
        }
        catch (err) {
            throw err;
        }
    }
    insertData(data) {
        let res;
        try {
            if (data.length > 1)
                res = this.collection.insertMany(data);
            else
                res = this.collection.insertOne(data[0]);
            return res;
        }
        catch (err) {
            throw err;
        }
    }
    removeAllData() {
        let res;
        try {
            res = this.collection.deleteMany({});
            return res;
        }
        catch (err) {
            throw err;
        }
    }
    close() {
        this.client.close();
    }
}
exports.default = Database;
