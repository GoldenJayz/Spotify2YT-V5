import { google } from "googleapis";
import { userSongs } from "./DatabaseCalls";
import { data } from "./Spotify";

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
  
}
