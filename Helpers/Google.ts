import { google } from "googleapis";
import { userSongs } from "./DatabaseCalls";
import { data, db, queue, userDoc } from "./Spotify";

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
  curUser = queue[0]
  console.log(queue)

  // check if user is in the database and then if not create new doc in database if yes add to their user doc
  db.listDocuments(curUser).then((res: any) => console.log(`Database: ${res[0]}`));
  console.log(`Current User: ${curUser}`);
  console.log(`Saved Copy: ${userDoc}`);
  console.log(userDoc);



  // yt.playlists.insert({
  //   part: ["snippet"],
  //   requestBody: {
  //     snippet: {
  //       title: "test",
  //       description: "test",
  //     },
  //   },
  //   })
  //   .then((res: any) => console.log(res.data));

  // get token then use it to create playlist and dump songs into it.
  // console.log(tokens);
};
