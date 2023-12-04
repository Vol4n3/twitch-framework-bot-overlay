import { AccessToken, RefreshingAuthProvider } from "@twurple/auth";
const open = require("open");
import { SERVER_ADDRESS, STORAGE_FOLDER, TWITCH_CHANNEL } from "../configs";
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
async function getToken(userId: string): Promise<AccessToken> {
  return JSON.parse(
    await fs.readFile(`./${STORAGE_FOLDER}/twurple_token_${userId}.json`, {
      encoding: "utf-8",
    })
  );
}

async function saveToken(token: AccessToken, userId: string) {
  console.log(token)
  return await fs.writeFile(
    `./${STORAGE_FOLDER}/twurple_token_${userId}.json`,
    JSON.stringify(token, null, 4),
    "utf-8"
  );
}

async function refresh(clientId: string, clientSecret: string, userId: string) {
  return new RefreshingAuthProvider({
    clientId,
    clientSecret,
    onRefresh: (userId, token) => saveToken(token, userId),
  });
}
export type TwurpleInitProps = {
  eventSub: EventSubWsListener;
  chatClient: ChatClient;
  apiClient: ApiClient;
  pubSubClient: PubSubClient;
};
export async function TwurpleInit(
  clientId: string,
  clientSecret: string,
  userId: string
): Promise<TwurpleInitProps> {
  let token: AccessToken;
  try {
    token = await getToken(userId);
  } catch (e) {
    await open(
      "https://id.twitch.tv/oauth2/authorize?" +
        `client_id=${clientId}&` +
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
        "user:manage:whispers+" +
        "channel:read:redemptions"
    );
    console.log("waiting for twitch authentification");
    const code = await getTwitchCode();
    const response = await fetch(
      "https://id.twitch.tv/oauth2/token?" +
        `client_id=${clientId}&` +
        `client_secret=${clientSecret}&` +
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
    await saveToken(token, userId);
  }
  const authProvider = await refresh(clientId, clientSecret, userId);
  console.log("auth SuccessFull");
  authProvider.addUser(userId, token, ["chat"]);
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
