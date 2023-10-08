import {
  SERVER_PORT,
  TWITCH_BROADCASTER_CLIENT,
  TWITCH_BROADCASTER_ID,
  TWITCH_BROADCASTER_SECRET,
} from "./configs";
import { httpServer } from "./server";
import { TwurpleInit } from "./twurple/twurple-init";

httpServer.listen(SERVER_PORT);

TwurpleInit(
  TWITCH_BROADCASTER_CLIENT,
  TWITCH_BROADCASTER_SECRET,
  TWITCH_BROADCASTER_ID
).then(() => {
  console.log("broadcaster token  created !");
  process.exit(0);
});
