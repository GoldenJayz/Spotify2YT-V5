/*
 Use bun
 Use React for frontend
 api maybe?
 maybe next js
 Put all the configurations into index.js
 */

import express from 'express';
import { Request, Response } from 'express';
import { callbackFunc, PORT, postSpotify, URL } from './Helpers/Spotify';
import { googleCallback } from './Helpers/Google';
import { Logger } from 'tslog';

const logger = new Logger({ name: 'Index' }); 
const app = express();
 
app.use(express.static('public'));
 
app.get('/', (req: Request, res: Response) => { res.sendFile(__dirname + '/views/index.html'); });
app.get('/postSpotify', postSpotify);
app.get('/callback', callbackFunc);
app.get('/googleCallback', googleCallback);
app.get('/redirectToGoogle', (req: Request, res: Response) => {
	return res.redirect('/googleCallback');
}); 
 
app.listen(PORT, () => {
	logger.silly(URL); // Store link in variable and export it for DatabaseCalls.ts
});
 