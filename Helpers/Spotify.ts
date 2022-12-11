import { readFileSync } from "fs";
import request from "request";
import Database from "../classes/Database";

// Global Constants
const config = readFileSync("./config.json");
const data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const db = new Database(url, colName); // Init Database
export const PORT = data.port;

// Global Variables
var bod: any;

// ------------------------------------------------------------
//-----------------SPOTIFY AUTH CODE SECTION ------------------
// ------------------------------------------------------------

export const postSpotify = (req: any, res: any) => {
  const clientId = data.spotify.client_id; // grabs client id fro   m config
  const scopes =
    "user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative";

  return res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
      scopes ? "&scope=" + encodeURIComponent(scopes) : ""
    }&redirect_uri=${encodeURIComponent("http://localhost:6969/callback")}`
  );
};

// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const callbackFunc = (req: any, res: any) => {
  const code = req.query.code!;
  const clientId = data.spotify.client_id;
  const clientSec = data.spotify.client_secret;

  // if (req.query.error) return res.send(req.query.error);
  // else if (req.query == null) return res.redirect(`http://localhost:${PORT}`); // mess with this later

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

  return res.send('monkey');
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
  if (err) return console.warn(err);

  const userDoc = {
    // constructs user doc to be compared to existing data in db
    id: body.id,
    name: body.display_name,
    refresh_token: bod.refresh_token,
  };

  console.log(userDoc);

  db.listDocuments(userDoc.id).then((f: any) => {
    const comparator = f[0];

    if (comparator != null && userDoc != null) {
      if (comparator.id === userDoc.id) {
      } else {
        db.insertData([userDoc]);
      }
    } else {
      db.insertData([userDoc]);
    }
  });
};
