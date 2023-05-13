import { readFileSync } from 'fs';
import Database from '../classes/Database';
import { google } from 'googleapis';

export const config = readFileSync('./config.json');
export const data = JSON.parse(config.toString());
export const url = data.url;
export const colName = data.collections[0];
export const databaseName = data.db_name;
export const db = new Database(url, colName, databaseName); // Init Database
export const PORT = data.port;
export const URL = data.base_url;
export const queue: string[] = [];


export const client = new google.auth.OAuth2(
	data.google.client_id,
	data.google.client_secret,
	data.google.redirect_uri
);

export const yt = google.youtube({
	version: 'v3',
	auth: client,
});

const scopes = ['https://www.googleapis.com/auth/youtube'];

export const reqUrl = client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
	include_granted_scopes: true,
});
