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

app.get("/", (req: any, res: any) => { res.send("Hello World"); });

app.get("/postSpotify", postSpotify);

app.get("/callback", callbackFunc);

app.get("/googleCallback", googleCallback)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/postSpotify`);
  console.log(reqUrl);
});
