import Database from './classes/Database';
import 'fs';
import { readFileSync } from 'fs';
import express from 'express';
// Get Configuration from Configuration file



let config = readFileSync('./config.json');
let data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const PORT = data.port;

const app = express();


app.get('/', (req: any, res: any) => {
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
