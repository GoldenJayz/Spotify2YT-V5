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
export const link = `http://localhost:${PORT}/`;

app.use(express.static("public"));

app.get("/", (req: any, res: any) => { res.sendFile(__dirname + "/views/index.html"); });

app.get("/postSpotify", postSpotify);

app.get("/callback", callbackFunc);

app.get("/googleCallback", googleCallback);

app.get("/redirectToGoogle"); // add callback func

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`); // Store link in variable and export it for DatabaseCalls.ts
  console.log(reqUrl);
});
