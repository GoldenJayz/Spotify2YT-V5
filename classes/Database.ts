import { MongoClient } from "mongodb";

export default class Database {
  private url: string;
  private colName: string;
  private collection: any;
  private db: any;
  private client: any;

  public constructor(url: string, colName: string) {
    this.url = url;
    this.colName = colName;
    this.client = new MongoClient(this.url);
    this.connect(this.colName);
  }

  public connect(collectionName: string) {
    try {
      this.db = this.client.db("Spotify2YT");
      this.collection = this.db.collection(collectionName);

      return this.collection;
    } catch (err) {
      console.error(`Exception while connecting to collection: ${err}`);
      throw err;
    }
  }

  public listDocuments() {
    try {
      const documents = this.collection.find({}).toArray();
      return documents;
    } catch (err) {
      throw err;
    }
  }

  public insertData(data: object[]) {
    let res: any;

    try {
      if (data.length > 1) res = this.collection.insertMany(data);
      else res = this.collection.insertOne(data[0]);
      return res;
    } catch (err) {
      throw err;
    }
  }

  public removeAllData() {
    let res: any;
    try {
      res = this.collection.deleteMany({});
      return res;
    } catch (err) {
      throw err;
    }
  }

  public close() {
    this.client.close();
  }
}
