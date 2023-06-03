import request from 'request';

export function recieveAccessToken(data: any) {
	const options = {
		uri: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Accept-Language': 'en_US',
			'Authorization': `Basic: ${data.paypal.client_id + ':' + data.paypal.client_secret}`,
		},
		body: {
			grant_type: 'client_credentials',
		},
		json: true,
	};
	request.post(options, (dat) => { console.log(dat); });
}

