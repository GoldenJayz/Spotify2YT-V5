import { readFileSync } from "fs";
import request from "request";
import Database from "../classes/Database";
import { compareDBs } from "./DatabaseCalls";
import { google } from "googleapis";
import { Logger } from "tslog";
import { Request, Response } from "express";

const logger = new Logger({ name: "Spotify" });


// Global Constants
const config = readFileSync("./config.json"); // Change to ./build/config.json for build version debugging
export const data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const databaseName = data.db_name;
export const db = new Database(url, colName, databaseName); // Init Database
export const PORT = data.port;
export const URL = data.base_url;
export const queue: any[] = [];
export let userPlaylistName = "";
export let userDoc: any;
export let profileFuncBody: any;
let bod: any;


// Global Constants
export const client = new google.auth.OAuth2(
	data.google.client_id,
	data.google.client_secret,
	data.google.redirect_uri
);

export const yt = google.youtube({
	version: "v3",
	auth: client,
});

const scopes = ["https://www.googleapis.com/auth/youtube"];

export const reqUrl = client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
	include_granted_scopes: true,
});


// ------------------------------------------------------------
//-----------------SPOTIFY AUTH CODE SECTION ------------------
// ------------------------------------------------------------

export const postSpotify = (req: any, res: any) => {
	userPlaylistName = req.query.url;
	logger.info(req.query.url);
	const clientId = data.spotify.client_id; // grabs client id from config
	const scopes =
    "user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative";

	return res.redirect(
		`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
			scopes ? "&scope=" + encodeURIComponent(scopes) : ""
		}&redirect_uri=${encodeURIComponent(URL + "callback")}`
	);
};


// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const callbackFunc = (req: Request, res: Response) => {
	const code = req.query.code!;
	const clientId = data.spotify.client_id;
	const clientSec = data.spotify.client_secret;

	if (req.query.code == null) return res.sendStatus(401);

	const authReq = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			code,
			redirect_uri: URL + "callback",
			grant_type: "authorization_code",
		},
		headers: {
			Authorization:
        "Basic " + Buffer.from(clientId + ":" + clientSec).toString("base64"),
		},
		json: true,
	};

	request.post(authReq, authReqPost);

	// Replace this line with a variable with the auth link
	return res.redirect(reqUrl); // Change to the google OAuth2 redirect
};

const authReqPost = (err: any, res: any, body: any) => {
	if (err) return console.warn(err);

	bod = body;

	const getProfile = {
		url: "https://api.spotify.com/v1/me",
		headers: {
			Authorization: `Bearer ${body.access_token}`,
		},
		json: true,
	};

	request.get(getProfile, getProfileFunc);
};

const getProfileFunc = (err: any, res: any, body: any) => {
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

// const getCurrentUserPlaylist = 
