import request from "request";
import Song from "../classes/Song";
import { userDoc, db, profileFuncBody, data } from "./Spotify";

// Global Data
export var userSongs: any[] = [];
var accessToken: any;
var userSongs2: any = {  }
// var userSongs2 = { 'id': [] } 


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

  db.listDocuments(profileFuncBody.id).then(getUserCall);
};

const getUserCall = (res: any, userId: string) => {
  let user = res[0];

  let accessTokenReq = {
    uri: "https://accounts.spotify.com/api/token",
    form: {
      refresh_token: user.refresh_token,
      grant_type: "refresh_token",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          data.spotify.client_id + ":" + data.spotify.client_secret
        ).toString("base64"),
    },
    json: true,
  };

  request.post(accessTokenReq, getAccessToken);
}; // gets refresh token in order to renew access token

const getAccessToken = (err: any, res: any, body: any) => {
  // console.log(body);
  // use access token in order to get playlist and songs with it
  // then construct a song object and dump it into an array

  accessToken = body.access_token;

  let playlistReq = {
    uri: "https://api.spotify.com/v1/me/playlists",
    headers: {
      Authorization: `Bearer ${body.access_token}`,
    },
    json: true,
  };

  request.get(playlistReq, playListReqCallback);
};

const playListReqCallback = (err: any, res: any, body: any) => {
  let testPlaylistName = "metal bangers"; // test playlist name

  let playlists: playlist[] = body.items;

  let playlist = playlists.find(
    (playlist) => playlist.name === testPlaylistName
  ); // finds playlist object with given name
  if (playlist === undefined) return console.log("playlist not found");

  let playlistTrack = {
    uri: playlist.tracks.href,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
  };

  request.get(playlistTrack, playlistTrackReq);
};

const playlistTrackReq = (err: any, res: any, body: any) => {
  let userId = userDoc.id;
  let obj: any = {};
  obj[userId as keyof typeof obj] = [];

  Object.assign(userSongs2, obj);

  for (let i = 0; i < body.items.length; i++) {
    let track: songData = body.items[i].track;
    let song: Song = new Song(
      track.name,
      track.artists[0].name,
      track.album.name
    );
    userSongs2[userId].push(song.getSearchName());
  }

  // console.log(userSongs);

  console.log(userSongs2)
};
