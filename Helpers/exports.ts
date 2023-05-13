import { readFileSync } from 'fs';
import Database from '../classes/Database';

export const config = readFileSync('./config.json');
export const data = JSON.parse(config.toString());
export const url = data.url;
export const colName = data.collections[0];
export const databaseName = data.db_name;
export const db = new Database(url, colName, databaseName); // Init Database
export const PORT = data.port;
export const URL = data.base_url;
export const queue: string[] = [];

