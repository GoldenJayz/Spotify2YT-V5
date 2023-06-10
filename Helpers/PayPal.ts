import paypal from 'paypal-rest-sdk';
import { Request, Response } from 'express';
import { create_payment_json, data, db } from './exports';

const config: any = {
	mode: 'sandbox',
	client_id: data.paypal.client_id,
	client_secret: data.paypal.client_secret,
};

paypal.configure(config);

export const createPayment = (req: Request, res: Response) => {
	paypal.payment.create(create_payment_json, (err, data) => {
		if (err) {
			return err;
		} else {
			if (data.links != undefined) {
				return res.redirect(data.links[1].href);
			}
		}
	});
};

export const successPayment = (req: Request, res: Response) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	const token = req.query.token;

	// Still need to figure this out
	db.updateData('testID', { paymentId: paymentId, payerId: payerId } ).then(res => console.log(res));

	return res.redirect(data.base_url);
};
