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

const curUser: string = queue[0]; // get cur user off queue when done

console.log(reqUrl);

// ------------------------------------------------------------
//---------------------CALLBACK SECTION -----------------------
// ------------------------------------------------------------

export const googleCallback = (req: any, res: any) => {
  const code = req.query.code!;
  client.getToken(code).then(getTokenRes);
  return res.redirect("/");
};

const getTokenRes = (res: any) => {
  let tokens: googleToken | null = res.tokens! != null ? res.tokens : null;
  console.log(tokens)

  // check if user is in the database and then if not create new doc in database if yes add to their user doc
  db.listDocuments(curUser).then((res: any) => console.log(res[0]));

  yt.playlists.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        title: "test",
        description: "test",
      },
    },
    })
    .then((res: any) => console.log(res.data));

  // get token then use it to create playlist and dump songs into it.
  // console.log(tokens);
};
