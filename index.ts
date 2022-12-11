/*
 * Maybe use Bun?
 */

import express from "express";
import { callbackFunc, PORT, postSpotify } from "./Helpers/Spotify";

const app = express();

app.get("/", (req: any, res: any) => { res.send("Hello World"); });

app.get("/postSpotify", postSpotify);

app.get("/callback", callbackFunc);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/postSpotify`);
});
