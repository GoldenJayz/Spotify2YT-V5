"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Database {
    constructor(url, colName) {
        this.url = url;
        this.colName = colName;
        this.db = new mongodb_1.MongoClient(this.url);
        this.connect(this.colName);
    }
    connect(collectionName) {
        try {
            this.db = this.db.db('Spotify2Yt');
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
}
exports.default = Database;
