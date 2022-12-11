import request from "request";
import { userDoc, db, profileFuncBody, data } from "./Spotify";

// ---------------------------------------------
// --------------SPOTIFY DB CALLS---------------
// ---------------------------------------------

export const compareDBs = (f: any) => {
  let comparator = f[0];
  if (comparator == undefined) comparator = {};

  // maybe check earlier so it doesnt do all this processing?

  // if first searched entry is not blank then check if it is same so it doesnt add a dupe into the db
  if (comparator.id != null && userDoc.id != null) {
    if (comparator.id === userDoc.id) {
    } else {
      db.insertData([userDoc]);
    }
  } else {
    if (userDoc.id != null) db.insertData([userDoc]);
  }

  // let playlistReq = {
  //   uri: 'https://api.spotify.com/v1/me/playlists',
  //   headers: {
  //     Authorization: `Bearer ${}`
  //   },
  //   json: true
  // }

  db.listDocuments(profileFuncBody.id).then(getUserCall);
};

const getUserCall = (res: any) => {
  let user = res[0];

  let accessTokenReq = {
    uri: "https://accounts.spotify.com/api/token",
    form: {
        refresh_token: user.refresh_token,
        grant_type: "refresh_token"
    },
    headers: {
        Authorization: "Basic " + Buffer.from(data.spotify.client_id + ":" + data.spotify.client_secret).toString("base64")
    },
    json: true,
  };

  request.post(accessTokenReq, getAccessToken);
}; // gets refresh token in order to renew access token

const getAccessToken = (err: any, res: any, body: any) => {
    console.log(body);
}
