import {
  SERVER_ADDRESS,
  SPOTIFY_CLIENT,
  SPOTIFY_SECRET,
  STORAGE_FOLDER,
} from "../configs";
import { promises as fs } from "fs";
import {
  SpotifyCurrentPlay,
  SpotifyInstance,
  SpotifySearch,
  SpotifyToken,
  SpotifyTrack,
} from "./spotify-types";

const crypto = require("node:crypto");
const open = require("open");
let _spotifyCode: string;
const spotifyAccountUri = "https://accounts.spotify.com";
const spotifyApiUri = "https://api.spotify.com/v1";
export const setSpotifyCode = (code: string) => {
  _spotifyCode = code;
};

async function getToken(): Promise<SpotifyToken> {
  return JSON.parse(
    await fs.readFile(`./${STORAGE_FOLDER}/spotify_token.json`, {
      encoding: "utf-8",
    })
  );
}

async function saveToken(token: SpotifyToken) {
  return await fs.writeFile(
    `./${STORAGE_FOLDER}/spotify_token.json`,
    JSON.stringify(token, null, 4),
    "utf-8"
  );
}

const getSpotifyCode = () =>
  new Promise<string>((resolve) => {
    const intervalRef = setInterval(() => {
      if (_spotifyCode) {
        clearInterval(intervalRef);
        resolve(_spotifyCode);
      }
    }, 1000);
  });
const makeFormBody = (obj: { [key: string]: string }) => {
  const formBody = Object.keys(obj).map((key: string) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(obj[key]);
    return encodedKey + "=" + encodedValue;
  });
  return formBody.join("&");
};
export async function refreshToken(token: SpotifyToken): Promise<SpotifyToken> {
  return fetch(`${spotifyAccountUri}/api/token`, {
    method: "POST",
    body: makeFormBody({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization:
        "Basic " +
        Buffer.from(SPOTIFY_CLIENT + ":" + SPOTIFY_SECRET).toString("base64"),
    },
  })
    .then((blob) => blob.json())
    .catch((err) => console.log(err));
}
export async function spotifyInit(): Promise<SpotifyInstance> {
  let token: SpotifyToken;
  try {
    token = await getToken();
    token = await refreshToken(token);
  } catch (e) {
    const state = crypto.randomUUID();
    const scopes =
      "user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private";
    await open(
      `${spotifyAccountUri}/authorize?` +
        "response_type=code&" +
        `client_id=${SPOTIFY_CLIENT}&` +
        `scope=${scopes}&` +
        `redirect_uri=${SERVER_ADDRESS}/spotify&` +
        `state=${state}`
    );
    console.log("waiting for spotify authentification");
    const code = await getSpotifyCode();
    token = await fetch(`${spotifyAccountUri}/api/token`, {
      method: "POST",
      body: makeFormBody({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${SERVER_ADDRESS}/spotify`,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization:
          "Basic " +
          Buffer.from(SPOTIFY_CLIENT + ":" + SPOTIFY_SECRET).toString("base64"),
      },
    })
      .then((blob) => blob.json())
      .catch((err) => console.log(err));
    await saveToken(token);
  }
  console.log("Spotify success authentification");
  setInterval(async () => {
    console.log("Spotify refresh token");
    token = await refreshToken(token);
  }, 3600 * 1000);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token.access_token}`,
  };
  const getCurrentPlay = async (): Promise<SpotifyCurrentPlay> => {
    return fetch(`${spotifyApiUri}/me/player/currently-playing`, {
      headers,
    }).then((blob) => blob.json());
  };

  const skipPlayer = async (): Promise<void> => {
    return fetch(`${spotifyApiUri}/me/player/next`, {
      headers,
      method: "POST",
    })
      .then((blob) => blob.json())
      .catch(() => {});
  };
  const searchTrack = async (search: string): Promise<SpotifySearch> => {
    return fetch(
      `${spotifyApiUri}/search?` + `q=${search}&` + `type=track&` + `limit=1`,
      { headers }
    ).then((blob) => blob.json());
  };

  const addQueue = async (search: string): Promise<SpotifyTrack> => {
    const track = await searchTrack(search);
    if (!(track.tracks && track.tracks.items.length)) {
      throw new Error("Not found");
    }
    const find = track.tracks.items[0];
    if (!find) {
      throw new Error("Not found");
    }
    await fetch(`${spotifyApiUri}/me/player/queue?` + `uri=${find.uri}`, {
      headers,
      method: "POST",
    });
    return find;
  };
  return { getCurrentPlay, skipPlayer, addQueue };
}
