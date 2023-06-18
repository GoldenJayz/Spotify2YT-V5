import { readFileSync } from 'fs';
import Database from '../classes/Database';
import { google } from 'googleapis';

export const config = readFileSync('./config.json'); // ./build/config.json for debug
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

export const create_payment_json = {
	intent: 'sale',
	payer: {
		payment_method: 'paypal',
	},
	redirect_urls: {
		return_url: `${data.paypal.redirect_uri}/paypal/success`,
		cancel_url: data.paypal.redirect_uri,
	},
	transactions: [
		{
			item_list: {
				items: [
					{
						name: 'Donate to me :)',
						sku: 'item',
						price: '69.00',
						currency: 'USD',
						quantity: 1,
					},
				],
			},
			amount: {
				currency: 'USD',
				total: '69.00',
			},
			description: 'This is the payment description.',
		},
	],
};


