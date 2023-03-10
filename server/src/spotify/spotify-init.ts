import { SPOTIFY_CLIENT, SPOTIFY_SECRET } from "../configs";
type SpotifyToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};
export async function SpotifyInit(): Promise<SpotifyToken> {
  const spotifyToken: SpotifyToken = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization:
          "Basic " +
          new Buffer(SPOTIFY_CLIENT + ":" + SPOTIFY_SECRET).toString("base64"),
      },
    }
  )
    .then((blob) => blob.json())
    .catch((err) => console.log(err));
  const spotifyResponse = await fetch("https://api.spotify.com/v1/me/player", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: spotifyToken.access_token,
    },
  })
    .then((blob) => blob.json())
    .catch((err) => console.log(err));
  console.log(spotifyResponse);
  return spotifyToken;
}
