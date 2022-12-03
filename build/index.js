"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./classes/Database"));
// Connect to the MongoDB database
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0';
const colName = 'users';
async function main() {
    const db = await new Database_1.default(url, colName);
    let docs = db.listDocuments().then((data) => console.log(data));
}
main();
