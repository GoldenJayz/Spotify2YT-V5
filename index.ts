/*
 Use bun
 Use React for frontend
 api maybe?
 maybe next js
 */

import express from "express";
import { callbackFunc, PORT, postSpotify } from "./Helpers/Spotify";
import { reqUrl, googleCallback } from "./Helpers/Google";

const app = express();

app.use(express.static("public"));

app.get("/", (req: any, res: any) => { res.sendFile(__dirname + "/views/index.html"); });

app.get("/postSpotify", postSpotify);

app.get("/callback", callbackFunc);

app.get("/googleCallback", googleCallback)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/postSpotify`);
  console.log(reqUrl);
});
