import { AccessToken, RefreshingAuthProvider } from "@twurple/auth";
const open = require("open");
import {
  SERVER_ADDRESS,
  STORAGE_FOLDER,
  TWITCH_BOT_ID,
  TWITCH_CHANNEL,
  TWITCH_CLIENT,
  TWITCH_SECRET,
} from "../configs";
import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { PubSubClient } from "@twurple/pubsub";
let _twitchCode: string;
export const setTwitchCode = (code: string) => {
  _twitchCode = code;
};
const getTwitchCode = () =>
  new Promise<string>((resolve) => {
    const intervalRef = setInterval(() => {
      if (_twitchCode) {
        clearInterval(intervalRef);
        resolve(_twitchCode);
      }
    }, 1000);
  });
async function getToken(): Promise<AccessToken> {
  return JSON.parse(
    await fs.readFile(`./${STORAGE_FOLDER}/twurple_token.json`, {
      encoding: "utf-8",
    })
  );
}

async function saveToken(token: AccessToken) {
  return await fs.writeFile(
    `./${STORAGE_FOLDER}/twurple_token.json`,
    JSON.stringify(token, null, 4),
    "utf-8"
  );
}

async function refresh() {
  return new RefreshingAuthProvider({
    clientId: TWITCH_CLIENT,
    clientSecret: TWITCH_SECRET,
    onRefresh: (userId, token) => saveToken(token),
  });
}

export async function TwurpleInit(): Promise<{
  eventSub: EventSubWsListener;
  chatClient: ChatClient;
  apiClient: ApiClient;
  pubSubClient: PubSubClient;
}> {
  let token: AccessToken;
  try {
    token = await getToken();
  } catch (e) {
    await open(
      "https://id.twitch.tv/oauth2/authorize?" +
        `client_id=${TWITCH_CLIENT}&` +
        `redirect_uri=${SERVER_ADDRESS}/twurple&` +
        "response_type=code&" +
        "scope=" +
        "chat:read+" +
        "chat:edit+" +
        "channel:moderate+" +
        "channel:manage:broadcast+" +
        "channel:manage:predictions+" +
        "channel:read:predictions+" +
        "channel:manage:polls+" +
        "channel:manage:redemptions+" +
        "channel:read:redemptions+" +
        "channel:manage:vips+" +
        "channel:read:redemptions"
    );
    console.log("waiting for twitch authentification");
    const code = await getTwitchCode();
    const response = await fetch(
      "https://id.twitch.tv/oauth2/token?" +
        `client_id=${TWITCH_CLIENT}&` +
        `client_secret=${TWITCH_SECRET}&` +
        `code=${code}&` +
        "grant_type=authorization_code&" +
        `redirect_uri=${SERVER_ADDRESS}/twurple`,
      { method: "POST" }
    );
    const responseToken = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string[];
      token_type: string;
    };
    token = {
      scope: responseToken.scope,
      expiresIn: responseToken.expires_in,
      accessToken: responseToken.access_token,
      refreshToken: responseToken.refresh_token,
      obtainmentTimestamp: new Date().getDate(),
    };
    await saveToken(token);
  }
  const authProvider = await refresh();
  console.log("auth SuccessFull");
  authProvider.addUser(TWITCH_BOT_ID, token, ["chat"]);
  const apiClient = new ApiClient({ authProvider });
  const chatClient = new ChatClient({
    authProvider,
    channels: [TWITCH_CHANNEL],
  });
  await chatClient.connect();

  const eventSub = new EventSubWsListener({ apiClient });

  const pubSubClient = new PubSubClient({ authProvider });
  console.log("connected to twitch");
  return {
    eventSub,
    chatClient,
    apiClient,
    pubSubClient,
  };
}
