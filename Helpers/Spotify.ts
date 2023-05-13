/* eslint-disable @typescript-eslint/no-explicit-any */
import 'fs';
import request from 'request';
import '../classes/Database';
import { google } from 'googleapis';
import { Logger } from 'tslog';
import { Request, Response } from 'express';
import { data, queue, db, URL } from './exports';
import Song from '../classes/Song';

const logger = new Logger({ name: 'Spotify' });

/*
	Either remove all the exports from this file and put them in index.ts or global.d.ts
*/

let userPlaylistName: any = '';
let userDoc: IUserDoc;
let profileFuncBody: any;
export const userSongs: userSongs = {};
let accessToken: string;
let bod: any;


// Global Constants
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


// ------------------------------------------------------------
//-----------------SPOTIFY AUTH CODE SECTION ------------------
// ------------------------------------------------------------

export const postSpotify = (req: Request, res: Response) => {
	userPlaylistName = req.query.url;
	logger.info(req.query.url);
	const clientId = data.spotify.client_id; // grabs client id from config
	const scopes =
    'user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative';

	return res.redirect(
		`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
			scopes ? '&scope=' + encodeURIComponent(scopes) : ''
		}&redirect_uri=${encodeURIComponent(URL + 'callback')}`
	);
};


// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const callbackFunc = (req: Request, res: Response) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const code = req.query.code!;
	const clientId = data.spotify.client_id;
	const clientSec = data.spotify.client_secret;

	if (req.query.code == null) return res.sendStatus(401);

	const authReq = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code,
			redirect_uri: URL + 'callback',
			grant_type: 'authorization_code',
		},
		headers: {
			Authorization:
        'Basic ' + Buffer.from(clientId + ':' + clientSec).toString('base64'),
		},
		json: true,
	};

	request.post(authReq, authReqPost);

	// Replace this line with a variable with the auth link
	return res.redirect(reqUrl); // Change to the google OAuth2 redirect
};

const authReqPost = (err: string, res: object, body: ISpotifyAccessToken) => {
	if (err) return console.error(err);

	bod = body;

	const getProfile = {
		url: 'https://api.spotify.com/v1/me',
		headers: {
			Authorization: `Bearer ${body.access_token}`,
		},
		json: true,
	};

	request.get(getProfile, getProfileFunc);
};

const getProfileFunc = (err: string, res: object, body: ISpotifyProfile) => {
	profileFuncBody = body;
	if (err) return console.warn(err);

	userDoc = {
		// constructs user doc to be compared to existing data in db
		id: body.id,
		name: body.display_name,
		spotify_refresh_token: bod.refresh_token,
	};

	// console.log(userDoc);
	queue.push(userDoc.id);
	db.listDocuments(userDoc.id).then(compareDBs);
};


// ---------------------------------------------
// --------------SPOTIFY DB CALLS---------------
// ---------------------------------------------

const compareDBs = (f: Array<listDocRes>) => {
	const comparator = f[0];

	// maybe check earlier so it doesn't do all this processing?
	// if first searched entry is not blank then check if it is same so it doesn't add a dupe into the db
	try {
		if (comparator.id != null && userDoc.id != null) {
			if (comparator.id === userDoc.id) {
				logger.info('user already in db');
			} else {
				db.insertData([userDoc]);
			}
		}
	} catch {
		if (userDoc.id != null) db.insertData([userDoc]);
	}
	
	db.listDocuments(profileFuncBody.id).then(getUserCall);
};

const getUserCall = (res: Array<listDocRes>) => {
	const user = res[0];

	const accessTokenReq = {
		uri: 'https://accounts.spotify.com/api/token',
		form: {
			refresh_token: user.spotify_refresh_token,
			grant_type: 'refresh_token',
		},
		headers: {
			Authorization:
        'Basic ' +
        Buffer.from(data.spotify.client_id + ':' + data.spotify.client_secret).toString('base64'),
		},
		json: true,
	};

	request.post(accessTokenReq, getAccessToken);
}; // gets refresh token in order to renew access token

const getAccessToken = (err: string, res: object, body: spotifyToken) => {
	// use access token in order to get playlist and songs with it
	// then construct a song object and dump it into an array
	accessToken = body.access_token;

	const playlistReq = {
		uri: 'https://api.spotify.com/v1/me/playlists',
		headers: {
			Authorization: `Bearer ${body.access_token}`,
		},
		json: true,
	};

	// console.log(res);
	request.get(playlistReq, playListReqCallback);
};

const playListReqCallback = (err: string, res: object, body: playlistResBody) => {
	// let testPlaylistName = "metal bangers"; // test playlist name
	const testPlaylistName = userPlaylistName;
	const playlists: playlist[] = body.items;

	const playlist = playlists.find(
		(playlist) => playlist.name === testPlaylistName
	); // finds playlist object with given name
	if (playlist === undefined) return logger.warn('playlist not found');

	const playlistTrack = {
		uri: playlist.tracks.href,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		json: true,
	};

	request.get(playlistTrack, playlistTrackReq);
};

const playlistTrackReq = (err: string, res: object, body: tracksResBody) => {
	const userId = userDoc.id;
	const obj: userSongs = {};
	obj[userId as keyof typeof obj] = [];

	Object.assign(userSongs, obj);

	for (let i = 0; i < body.items.length; i++) {
		const track: songData = body.items[i].track;
		const song: Song = new Song(
			track.name,
			track.artists[0].name,
			track.album.name
		);
		userSongs[userId].push(song.getSearchName());
	}

	// logger.info(userSongs);
  
	request.get(URL + 'redirectToGoogle');
	// Store the express res param in a global let
};
