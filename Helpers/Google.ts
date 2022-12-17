import { google } from "googleapis";
import { userSongs } from "./DatabaseCalls";
import { data, db } from "./Spotify";

// Global Constants
const client = new google.auth.OAuth2(
  data.google.client_id,
  data.google.client_secret,
  data.google.redirect_uri
);

const scopes = [
    'https://www.googleapis.com/auth/youtube'
];

export const reqUrl = client.generateAuthUrl({ access_type: 'offline', scope: scopes, include_granted_scopes: true});

console.log(reqUrl);


// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const googleCallback = (req: any, res: any) => {
  const code = req.query.code!;
  client.getToken(code).then(getTokenRes);
  return res.redirect('/');
}

const getTokenRes = (res: any) => {
  let tokens: googleToken | null = res.tokens! != null ? res.tokens : null;
  // check if user is in the database and then if not create new doc in database if yes add to their user doc
  let usersInDb = db.listDocuments('do things');

  console.log(tokens);
}

