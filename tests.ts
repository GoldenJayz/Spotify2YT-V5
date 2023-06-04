/* eslint-disable */

import { data } from './Helpers/exports';
import paypal from 'paypal-rest-sdk';
import express from 'express';
import Database from './classes/Database';

// Use both Stripe and Paypal payment handlers

const config: any = {
	mode: 'sandbox',
	client_id: data.paypal.client_id,
	client_secret: data.paypal.client_secret,
};

paypal.configure(config);

let create_payment_json = {
	intent: 'sale',
	payer: {
		payment_method: 'paypal',
	},
	redirect_urls: {
		return_url: 'http://localhost:8080/paypal/success',
		cancel_url: 'http://localhost:8080',
	},
	transactions: [
		{
			item_list: {
				items: [
					{
						name: 'fart',
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



const app = express();

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.send('hi');
});


app.get('/paypal', (req: any, res: any) => {
	paypal.payment.create(create_payment_json, (err, data) => {
		if (err) {
			return err;
		} else {
			if (data.links != undefined) {
				return res.redirect(data.links[1].href);
			}
		}
	});
});

app.get('/paypal/success', (req: any, res: any) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	const token = req.query.token;

	const db = new Database(data.url, data.collections[0], data.dbName);
	db.updateData("test", { paymentId: paymentId, payerId } ).then(res => console.log(res));
	// Go into database and add payment to user
	
});

app.listen(8080, () => {
	console.log('http://localhost:8080');
});
