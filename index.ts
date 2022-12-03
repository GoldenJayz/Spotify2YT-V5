import Database from './classes/Database';
import 'fs';
import { readFileSync } from 'fs';

// Get Configuration from Configuration file

let config = readFileSync('./config.json');
let data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];

// Main

function main()
{
    const db = new Database(url, colName);

    db.listDocuments().then((data: any) => {
        console.log(data);
        db.close();
    });
}

main();
