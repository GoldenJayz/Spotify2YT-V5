import { readFileSync } from "fs";
import request from "request";
import Database from "../classes/Database";
import { compareDBs } from "./DatabaseCalls";
import { reqUrl } from "./Google";

// Global Constants
const config = readFileSync("./config.json"); // Change to ./build/config.json for build version debugging
export const data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const databaseName = data.db_name;
export const db = new Database(url, colName, databaseName); // Init Database
export const PORT = data.port;
export var userPlaylistName = "";

// Global Variables
var bod: any;
export var userDoc: any;
export var profileFuncBody: any;
export var queue: any[] = [];

// ------------------------------------------------------------
//-----------------SPOTIFY AUTH CODE SECTION ------------------
// ------------------------------------------------------------

export const postSpotify = (req: any, res: any) => {
  userPlaylistName = req.query.url;
  console.log(req.query.url);
  const clientId = data.spotify.client_id; // grabs client id from config
  const scopes =
    "user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative";

  return res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
      scopes ? "&scope=" + encodeURIComponent(scopes) : ""
    }&redirect_uri=${encodeURIComponent("http://localhost:6969/callback")}`
  );
};


const getUserPlaylists = () => {};

// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const callbackFunc = (req: any, res: any) => {
  const code = req.query.code!;
  const clientId = data.spotify.client_id;
  const clientSec = data.spotify.client_secret;

  if (req.query.code == null) return res.sendStatus(401);

  const authReq = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code,
      redirect_uri: "http://localhost:6969/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " + Buffer.from(clientId + ":" + clientSec).toString("base64"),
    },
    json: true,
  };

  request.post(authReq, authReqPost);

  return res.redirect("https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube&include_granted_scopes=true&response_type=code&client_id=589007273256-pdn64satif9b86up211v76atfahcnn77.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A6969%2FgoogleCallback"); // Change to the google OAuth2 redirect
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
