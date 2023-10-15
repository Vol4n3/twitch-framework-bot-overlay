import { promises as fs } from "fs";
import {
  SOUNDS_PATH,
  STORAGE_FOLDER,
  TWITCH_BOT_CLIENT,
  TWITCH_BOT_ID,
  TWITCH_BOT_SECRET,
  TWITCH_BROADCASTER_CLIENT,
  TWITCH_BROADCASTER_ID,
  TWITCH_BROADCASTER_SECRET,
} from "./configs";
import { initMedias } from "./command-listeners/medias-commands";
import { TwurpleInit } from "./twurple/twurple-init";
import { ObsInit } from "./obs/obs-init";
import { spotifyInit } from "./spotify/spotify-init";
import { appInit } from "./app-init";

fs.mkdir(`./${STORAGE_FOLDER}`).catch(() => {});
fs.mkdir(SOUNDS_PATH).catch(() => {});
initMedias().catch((reason) => {
  console.log(reason);
});

Promise.all([
  TwurpleInit(
    TWITCH_BROADCASTER_CLIENT,
    TWITCH_BROADCASTER_SECRET,
    TWITCH_BROADCASTER_ID
  ),
  TwurpleInit(TWITCH_BOT_CLIENT, TWITCH_BOT_SECRET, TWITCH_BOT_ID),
  ObsInit(),
  spotifyInit(),
])
  .then(appInit)
  .catch((reason) => console.log(reason));
