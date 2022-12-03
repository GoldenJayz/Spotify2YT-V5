import Database from './classes/Database';

// Connect to the MongoDB database

const url: string = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0';
const colName: string = 'users';


async function main()
{
    const db = await new Database(url, colName);

    let docs = db.listDocuments().then((data: any) => console.log(data));
}

main();
