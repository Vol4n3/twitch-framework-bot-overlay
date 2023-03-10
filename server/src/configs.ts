import { config as DotEnvConfig } from "dotenv";

DotEnvConfig();

const {
  TWITCH_SECRET = "config it in .env",
  TWITCH_CLIENT = "config it in .env",
  TWITCH_BOT_ID = "config it in .env",
  TWITCH_CHANNEL = "config it in .env",
  OBS_SOCKET_PORT = "config it in .env",
  OBS_SOCKET_PASSWORD = "config it in .env",
  BROADCASTER_ID = "config it in .env",
  SERVER_ADDRESS = "config it in .env",
  SERVER_PORT = "config it in .env",
  SOUNDS_PATH = "config it in .env",
  VIDEOS_PATH = "config it in .env",
  GREEN_VIDEOS_FOLDER = "config it in .env",
  STANDARD_VIDEOS_FOLDER = "config it in .env",
  STORAGE_FOLDER = "config it in .env",
  SPOTIFY_CLIENT = "config it in .env",
  SPOTIFY_SECRET = "config it in .env",
} = process.env;

export {
  TWITCH_SECRET,
  TWITCH_CLIENT,
  TWITCH_CHANNEL,
  TWITCH_BOT_ID,
  BROADCASTER_ID,
  OBS_SOCKET_PORT,
  OBS_SOCKET_PASSWORD,
  SERVER_ADDRESS,
  SERVER_PORT,
  SOUNDS_PATH,
  VIDEOS_PATH,
  GREEN_VIDEOS_FOLDER,
  STANDARD_VIDEOS_FOLDER,
  STORAGE_FOLDER,
  SPOTIFY_CLIENT,
  SPOTIFY_SECRET,
};
