import { data } from './Helpers/exports';
import paypal from 'paypal-rest-sdk';
import express from 'express';

// Use both Stripe and Paypal payment handlers

paypal.configure({
	mode: 'sandbox',
	client_id: data.paypal.client_id,
	client_secret: data.paypal.client_secret,
});

let create_payment_json = {
	intent: 'sale',
	payer: {
		payment_method: 'paypal',
	},
	redirect_urls: {
		return_url: 'http://localhost:8080',
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

paypal.payment.create(create_payment_json, function (error, payment) {
	if (error) {
		throw error;
	} else {
		console.log('Create Payment Response');
		console.log(payment);
	}
});

const app = express();

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.send('hi');
});

app.listen(8080, () => {
	console.log('http://localhost:8080');
});
