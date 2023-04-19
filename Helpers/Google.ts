import { google } from "googleapis";
import { userSongs } from "./DatabaseCalls";
import { data, db, queue } from "./Spotify";


// Global Constants
const client = new google.auth.OAuth2(
	data.google.client_id,
	data.google.client_secret,
	data.google.redirect_uri
);

const yt = google.youtube({
	version: "v3",
	auth: client,
});

const scopes = ["https://www.googleapis.com/auth/youtube"];

export const reqUrl = client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
	include_granted_scopes: true,
});

let curUser: string; // get cur user off queue when done
let playlistId: string;
let response: any;


// ------------------------------------------------------------
// --------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

// Check if data is in db then wait until it is in there

export const googleCallback = (req: any, res: any) => {
	const code = req.query.code!;
	if (code == undefined) {
		return res.status(400).send("No code provided");
	}
	response = res;

	client.getToken(code).then(getTokenRes);
	// return res.redirect("/"); // Not redirecting for now
};

const getTokenRes = (res: any) => {
	const tokens: googleToken = res.tokens! != null ? res.tokens : null;
	curUser = queue[0];

	while (curUser == undefined || userSongs == undefined) {
		curUser = queue[0];
		if (curUser != undefined) {
			console.log(curUser + " curuser logged");
			break;
		}
    
	}

	db.listDocuments(curUser).then((res: any) =>
		console.log(`Database: ${res[0]}`)
	);

	db.updateData(curUser, { google_refresh_token: tokens.refresh_token }).then(
		(res: any) => console.log(res)
	);

	client.setCredentials(tokens);

	// then use youtube search api to search for the songs and get the links

	console.log(curUser);
	console.log(userSongs[curUser][0]); // Gets the first song name

	yt.playlists
		.insert({
			part: ["snippet"],
			requestBody: {
				snippet: {
					title: "test",
					description: "Playlist generated by Spotify2YT-V5",
				},
			},
		})
		.then(playlistCreationRes);
};

const playlistCreationRes = (res: any) => {
	playlistId = res.data.id; // Users playlist id that was just created

	for (let i = 0; i < 5; i++) { // userSongs[curUser].length 5 is for testing it so it doesn't burn all my quota
		setTimeout(() => {
			// console.log(userSongs[curUser][i])
			yt.search.list({
				part: ["snippet"],
				maxResults: 1,
				order: "relevance",
				q: `${userSongs[curUser][i]}`,
			}).then(dumpIntoPlaylist);
		}, 1500*i);
	}

	return response.redirect("/");
};

const dumpIntoPlaylist = (res: any) => {
	const id = res.data.items[0].id.videoId;
	console.log(id);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	yt.playlistItems.insert({
		"part": [
			"snippet"
		],
		"resource": {
			"snippet": {
				"playlistId": playlistId,
				"resourceId": {
					"videoId": id,
					"kind": "youtube#video"
				}
			}
		}
	});
};
