import express from 'express';
import { Request, Response } from 'express';
import { Logger } from 'tslog';
import { PORT, URL } from './Helpers/exports';
import { callbackFunc, postSpotify } from './Helpers/Spotify';
import { googleCallback } from './Helpers/Google';
import { createPayment, successPayment, validatePayment } from './Helpers/PayPal';
import bodyParser from 'body-parser';

const logger = new Logger({ name: 'Index' }); 
const app = express();
 
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => { res.sendFile(__dirname + '/views/index.html'); });
app.get('/postSpotify', postSpotify);
app.get('/callback', callbackFunc);
app.get('/googleCallback', googleCallback);
app.get('/paypal', createPayment);
app.get('/paypal/success', (req: Request, res: Response) => { res.sendFile(__dirname + '/views/success.html'); });
app.post('/validatePayment', validatePayment);

app.listen(PORT, () => {
	logger.silly(URL); // Store link in variable and export it for DatabaseCalls.ts
});
 