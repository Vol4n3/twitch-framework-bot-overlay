import { createServer } from "http";
import { SERVER_ADDRESS } from "./configs";
import { setTwitchCode } from "./twurple/twurple-init";
import { setSpotifyCode } from "./spotify/spotify-init";

export const httpServer = createServer((req, res) => {
  const url = new URL(`${SERVER_ADDRESS}${req.url || "/"}`);
  console.log(req.url)
  const searchCode = url.searchParams.get("code");
  if (req.url && req.url.startsWith("/twurple")) {
    if (searchCode) setTwitchCode(searchCode);
  }
  if (req.url && req.url.startsWith("/spotify")) {
    if (searchCode) setSpotifyCode(searchCode);
  }

  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message": "ok"}`);
});
