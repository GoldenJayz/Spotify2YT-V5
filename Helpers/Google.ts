import { userSongs } from './Spotify';
import { Request, Response } from 'express';
import { Logger } from 'tslog';
import { client, db, queue, yt } from './exports';

// Globals
const logger = new Logger({ name: 'Google' });

let curUser: string; // get cur user off queue when done
let playlistId: string;
let response: Response;


// ------------------------------------------------------------
// --------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

// Check if data is in db then wait until it is in there

export const googleCallback = (req: Request, res: Response) => {
	return res.sendFile('/views/googleRedirect.html', { root: '../' });
};


export const startGoogleAuth = (req: Request, res: Response) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const code: any = req.body.code;
	if (code == undefined) {
		return res.sendStatus(401);

	}
	response = res;

	client.getToken(code).then(getTokenRes);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTokenRes: any = (res: tokenResponse) => {
	const tokens: googleToken = res.tokens;
	curUser = queue[0];

	while (curUser == undefined || userSongs == undefined) {
		curUser = queue[0];
		if (curUser != undefined) {
			logger.info(curUser + ' curuser logged');
			break;
		}
	}

	db.listDocuments('id', curUser);
	db.updateData(curUser, { google_refresh_token: tokens.refresh_token });
	client.setCredentials(tokens);

	// then use youtube search api to search for the songs and get the links

	logger.info(curUser);
	logger.info(userSongs[curUser][0]); // Gets the first song name

	yt.playlists
		.insert({
			part: ['snippet'],
			requestBody: {
				snippet: {
					title: 'test',
					description: 'Playlist generated by Spotify2YT-V5',
				},
			},
		})
		.then(playlistCreationRes);

	return response.send({ auth: tokens.refresh_token });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const playlistCreationRes: any = (res: creationResponse) => {
	playlistId = res.data.id; // Users playlist id that was just created

	// Try inserting all the songs into the playlist at once
	for (let i = 0; i < 5; i++) { // userSongs[curUser].length 5 is for testing it so it doesn't burn all my quota
		setTimeout(() => {
			// console.log(userSongs[curUser][i])
			yt.search.list({
				part: ['snippet'],
				maxResults: 1,
				order: 'relevance',
				q: `${userSongs[curUser][i]}`,
			})
				.then(dumpIntoPlaylist)
				.catch(() => {
					const warnMsg = 'Error searching song: ' + userSongs[curUser][i];
					logger.warn(warnMsg);
				});
		}, 1500*i);
	}

	queue.shift();

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dumpIntoPlaylist: any = (res: insertResponse) => {
	const id = res.data.items[0].id.videoId;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	yt.playlistItems.insert({
		'part': [
			'snippet'
		],
		'resource': {
			'snippet': {
				'playlistId': playlistId,
				'resourceId': {
					'videoId': id,
					'kind': 'youtube#video'
				}
			}
		}
	})
		.then(() => logger.info(id)) // Create status messages that show up on the page
		.catch(() => {
			const warnMsg = 'Error inserting song with id: ' + id;
			logger.warn(warnMsg);
		});
};
