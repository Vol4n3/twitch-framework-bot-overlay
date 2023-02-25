import { config as DotEnvConfig } from "dotenv";

DotEnvConfig();

const {
  TWITCH_SECRET = "config it in .env",
  TWITCH_CLIENT = "config it in .env",
  TWITCH_BOT_ID = "config it in .env",
  BROADCASTER_ID = "config it in .env",
  SERVER_ADDRESS = "config it in .env",
  SERVER_PORT = "config it in .env",
  SOUNDS_PATH = "config it in .env",
  STORAGE_FOLDER = "config it in .env",
} = process.env;

export {
  TWITCH_SECRET,
  TWITCH_CLIENT,
  TWITCH_BOT_ID,
  BROADCASTER_ID,
  SERVER_ADDRESS,
  SERVER_PORT,
  SOUNDS_PATH,
  STORAGE_FOLDER,
};
