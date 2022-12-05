"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("fs");
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
// Get Configuration from Configuration file
let config = (0, fs_1.readFileSync)('./config.json');
let data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const PORT = data.port;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World');
});
const listener = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
// Main
// function main()
// {
//     const db = new Database(url, colName);
//     db.listDocuments().then((data: any) => { console.log (data); db.close(); });
// }
// main();
