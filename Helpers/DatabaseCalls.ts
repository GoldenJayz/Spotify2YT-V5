import request from "request";
import Song from "../classes/Song";
import { userDoc, db, profileFuncBody, data, userPlaylistName, URL } from "./Spotify";
import { Logger } from "tslog";

const logger = new Logger({ name: "DatabaseCalls" });

// Global Data
export const userSongs: userSongs = {};
let accessToken: string;
// let userSongs2 = { 'id': [] } 


// ---------------------------------------------
// --------------SPOTIFY DB CALLS---------------
// ---------------------------------------------

export const compareDBs = (f: Array<listDocRes>) => {
	const comparator = f[0];

	// maybe check earlier so it doesn't do all this processing?
	// if first searched entry is not blank then check if it is same so it doesn't add a dupe into the db
	try {
		if (comparator.id != null && userDoc.id != null) {
			if (comparator.id === userDoc.id) {
				logger.info("user already in db");
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
		uri: "https://accounts.spotify.com/api/token",
		form: {
			refresh_token: user.spotify_refresh_token,
			grant_type: "refresh_token",
		},
		headers: {
			Authorization:
        "Basic " +
        Buffer.from(data.spotify.client_id + ":" + data.spotify.client_secret).toString("base64"),
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
		uri: "https://api.spotify.com/v1/me/playlists",
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
	if (playlist === undefined) return logger.warn("playlist not found");

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
	console.log(body);
	const userId = userDoc.id;
	const obj: any = {};
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
  
	// Convert to letiable link instead of string
	logger.info(URL + " From database calls");
	request.get(URL + "redirectToGoogle");
	// Store the express res param in a global let
};
