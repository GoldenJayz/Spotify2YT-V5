/*
 * Maybe use Bun?
 */

import express from "express";
import { callbackFunc, PORT, postSpotify } from "./Helpers/Spotify";
import { reqUrl } from "./Helpers/Google";

const app = express();

app.get("/", (req: any, res: any) => { res.send("Hello World"); });

app.get("/postSpotify", postSpotify);

app.get("/callback", callbackFunc);

app.get("/googleCallback")

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/postSpotify`);
});
