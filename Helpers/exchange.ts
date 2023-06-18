import { Request, Response } from 'express';
import genHash from 'generatehash';
import { db } from './exports';


export const exchangeTokens = (req: Request, res: Response) => {

	// There's a better way to code this

	if (req.body.googleToken == undefined || req.body.spotifyToken == undefined) {
		return res.status(400).send('Invalid request');
	}
	else {
		// Check if both are in database
		db.listDocuments('google_refresh_token', req.body.googleToken).then(res1 => {
			// if res is ok then check spotify then return hash
			if (res1.length != 0) {
				db.listDocuments('spotify_refresh_token', req.body.spotifyToken).then(res2 => {
					// if res is ok then check spotify then return hash
					if (res2.length != 0) {
						const hash = genHash('md5');
						db.updateData(res2[0].id, { hash: hash });
						return res.send(hash);
					}
					else return res.status(400).send('Invalid request');
				});
			}
			else return res.status(400).send('Invalid request');
		});
	}
};
