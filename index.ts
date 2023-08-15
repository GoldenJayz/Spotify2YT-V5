import express from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { Logger } from 'tslog';
import { PORT, URL } from './Helpers/exports';
import { callbackFunc, postSpotify, startAuth } from './Helpers/Spotify';
import { googleCallback, startGoogleAuth } from './Helpers/Google';
import { createPayment, successPayment, validatePayment } from './Helpers/PayPal';
import bodyParser from 'body-parser';
import { exchangeTokens } from './Helpers/exchange';
import cors from 'cors';

const logger = new Logger({ name: 'Index' }); 
const app = express();
 
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (req: Request, res: Response) => { res.sendFile(__dirname + '/views/index.html'); });
app.get('/postSpotify', postSpotify);
app.get('/callback', callbackFunc);
app.get('/googleCallback', googleCallback);
app.get('/privacyPolicy', (req: Request, res: Response) => res.sendFile(__dirname + '/views/privacyPolicy.html'));

// Protect these endpoints so they do not crash
app.post('/startAuth', startAuth);
app.post('/startGoogleAuth', startGoogleAuth);
// app.get('/paypal', createPayment);
// app.get('/paypal/success', (req: Request, res: Response) => { res.sendFile(__dirname + '/views/success.html'); });
// app.post('/validatePayment', validatePayment);
app.post('/exchangeTokens', exchangeTokens);


app.listen(PORT, () => {
	logger.silly(URL);
});
 