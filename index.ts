/*
 Use bun
 Use React for frontend
 api maybe?
 maybe next js
 Put all the configurations into index.js
 */

import express from "express";
import { callbackFunc, PORT, postSpotify, reqUrl, URL } from "./Helpers/Spotify";
import { googleCallback } from "./Helpers/Google";
import { Logger } from "tslog";

const logger = new Logger({ name: "Index" }); 
const app = express();
 
app.use(express.static("public"));
 
app.get("/", (req: any, res: any) => { res.sendFile(__dirname + "/views/index.html"); });
 
app.get("/postSpotify", postSpotify);
 
app.get("/callback", callbackFunc);
 
app.get("/googleCallback", googleCallback);
 
app.get("/redirectToGoogle", (req: any, res: any) => {
	return res.redirect("/googleCallback");
}); // add callback func
 
app.listen(PORT, () => {
	logger.silly(URL); // Store link in variable and export it for DatabaseCalls.ts
});
 