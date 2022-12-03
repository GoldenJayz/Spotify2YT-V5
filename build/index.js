"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./classes/Database"));
require("fs");
const fs_1 = require("fs");
// Get Configuration from Configuration file
let config = (0, fs_1.readFileSync)('./config.json');
let data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
// Main
function main() {
    const db = new Database_1.default(url, colName);
    db.listDocuments().then((data) => {
        console.log(data);
        db.close();
    });
}
main();
