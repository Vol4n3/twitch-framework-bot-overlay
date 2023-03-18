import {
  SERVER_PORT,
  TWITCH_BOT_CLIENT,
  TWITCH_BOT_ID,
  TWITCH_BOT_SECRET,
  TWITCH_BROADCASTER_CLIENT,
  TWITCH_BROADCASTER_ID,
  TWITCH_BROADCASTER_SECRET,
} from "./configs";
import { httpServer } from "./server";
import { TwurpleInit } from "./twurple/twurple-init";
httpServer.listen(SERVER_PORT);

TwurpleInit(TWITCH_BOT_CLIENT, TWITCH_BOT_SECRET, TWITCH_BOT_ID).then(() => {
  console.log("broadcaster token created !");
  process.exit(0);
});
