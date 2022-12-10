/*
 * Maybe use Bun?
 */

import Database from "./classes/Database";
import { readFileSync } from "fs";
import express from "express";
import request from "request";

// Get Configuration from Configuration file

const config = readFileSync("./config.json");
const data = JSON.parse(config.toString());
const url = data.url;
const colName = data.collections[0];
const PORT = data.port;
const app = express();
const db = new Database(url, colName); // Init Database

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.get("/postSpotify", (req: any, res: any) => {
  const clientId = data.spotify.client_id; // grabs client id from config
  const scopes =
    "user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative";

  return res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
      scopes ? "&scope=" + encodeURIComponent(scopes) : ""
    }&redirect_uri=${encodeURIComponent("http://localhost:6969/callback")}`
  );
});

app.get("/callback", (req, res) => {
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

  request.post(authReq, (err, res, bod) => {
    if (err) return console.warn(err);

    const getProfile = {
      url: "https://api.spotify.com/v1/me",
      headers: {
        Authorization: `Bearer ${bod.access_token}`,
      },
      json: true,
    };

    request.get(getProfile, (err, res, body) => {
      if (err) return console.warn(err);

      let userDoc = { // constructs user doc to be compared to existing data in db
        id: body.id,
        name: body.display_name,
        refresh_token: bod.refresh_token,
      }

      console.log(userDoc)

      db.listDocuments(userDoc.id).then((f: any) => {
        console.log(f);
        let comparator = f[0];
        let userDocMod = delete userDoc['refresh_token'];
        delete comparator['_id'];
        delete comparator['refresh_token'];


        // comparing 2 sets of data checks aren't working

        if(comparator == userDocMod) {
          return;
        }
        else {
          db.insertData([userDoc])
        }
      });
    });
  });

  res.send(code);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/postSpotify`);
});

// Main

// function main()
// {
//     const db = new Database(url, colName);
//     db.listDocuments().then((data: any) => { console.log (data); db.close(); });
// }

// main();
