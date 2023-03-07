import { Server } from "socket.io";
import { AccessToken, RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient, PrivateMessage } from "@twurple/chat";
import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import { PubSubClient } from "@twurple/pubsub";
import { commandListeners, rewardListeners, ServerSocket } from "./listeners";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { createServer } from "http";
import { HeroGame } from "./game/hero-game";
import fetch from "node-fetch";
import {
  BROADCASTER_ID,
  SERVER_ADDRESS,
  SERVER_PORT,
  SOUNDS_PATH,
  STORAGE_FOLDER,
  TWITCH_BOT_ID,
  TWITCH_CLIENT,
  TWITCH_SECRET,
} from "./configs";
import { initMedias } from "./message-listeners/medias";
import { HeroStats } from "../../shared/src/shared-game";
import { ArrayUtils } from "jcv-ts-utils";

const open = require("open");

fs.mkdir(`./${STORAGE_FOLDER}`).catch(() => {});
fs.mkdir(SOUNDS_PATH).catch(() => {});
initMedias().catch((reason) => {
  console.log(reason);
});

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

let _twitchCode: string;
const getTwitchCode = () =>
  new Promise<string>((resolve) => {
    const intervalRef = setInterval(() => {
      if (_twitchCode) {
        clearInterval(intervalRef);
        resolve(_twitchCode);
      }
    }, 1000);
  });

const httpServer = createServer((req, res) => {
  const url = new URL(`${SERVER_ADDRESS}${req.url || "/"}`);
  const searchCode = url.searchParams.get("code");
  if (searchCode) _twitchCode = searchCode;
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message": "ok"}`);
});
const socket: ServerSocket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
httpServer.listen(SERVER_PORT);

async function getToken(): Promise<AccessToken> {
  return JSON.parse(
    await fs.readFile(`./${STORAGE_FOLDER}/tokens.json`, { encoding: "utf-8" })
  );
}

async function saveToken(token: AccessToken) {
  return await fs.writeFile(
    `./${STORAGE_FOLDER}/tokens.json`,
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

async function connection(): Promise<{
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
        `redirect_uri=${SERVER_ADDRESS}&` +
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
    console.log("waiting for authentification");
    const code = await getTwitchCode();

    const response = await fetch(
      "https://id.twitch.tv/oauth2/token?" +
        `client_id=${TWITCH_CLIENT}&` +
        `client_secret=${TWITCH_SECRET}&` +
        `code=${code}&` +
        "grant_type=authorization_code&" +
        `redirect_uri=${SERVER_ADDRESS}`,
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
  const chatClient = new ChatClient({ authProvider, channels: ["vol4n3"] });
  await chatClient.connect();
  const eventSub = new EventSubWsListener({ apiClient });

  const pubSubClient = new PubSubClient({ authProvider });

  return { chatClient, apiClient, eventSub, pubSubClient };
}

const clearReward = async ({ apiClient }: { apiClient: ApiClient }) => {
  const rewards = await apiClient.channelPoints.getCustomRewards(
    BROADCASTER_ID,
    true
  );
  console.log(`checking ${rewards.length} rewards`);
  for (let i = 0; i < rewards.length; i++) {
    const reward = rewards[i];
    const redemptions =
      await apiClient.channelPoints.getRedemptionsForBroadcaster(
        BROADCASTER_ID,
        reward.id,
        "UNFULFILLED",
        {}
      );
    const redIds = redemptions.data
      .filter((f) => f.redemptionDate < yesterday)
      .map((r) => r.id);
    console.log(`clean ${redIds.length} redemptions`);
    await apiClient.channelPoints.updateRedemptionStatusByIds(
      BROADCASTER_ID,
      reward.id,
      redIds,
      "FULFILLED"
    );
  }
};
const usersBlacklist = ["moobot"].map((m) => m.toLowerCase());
connection().then(async ({ pubSubClient, chatClient, apiClient }) => {
  const channelInfo = await apiClient.users.getUserById(BROADCASTER_ID);

  console.log("connected to twitch");
  const gameInstance = new HeroGame();
  clearReward({ apiClient })
    .then(() => {
      // comment this if you d'ont want clean redemptions after 24h
    })
    .catch((reason) => console.error(reason));
  socket.on("connection", (socket) => {
    console.log("a socket client is connected");
    socket.emit("gameState", gameInstance.state);
    socket.on("disconnect", () => {
      console.log("a socket client is disconnected");
    });
    socket.on("playerKill", (data) => {
      const rand = ArrayUtils.pickRandomOne<keyof HeroStats>([
        "dodge",
        "critic",
        "power",
        "pv",
        "regen",
        "speed",
      ]);
      gameInstance.addPoint(data.attacker.name, rand, 1);
    });
  });
  pubSubClient.onRedemption(BROADCASTER_ID, async (message) => {
    console.log(message.channelId);
    rewardListeners.forEach((cb) => {
      cb({
        channel: channelInfo?.name || message.channelId,
        user: message.userName,
        rewardTitle: message.rewardTitle,
        userId: message.userId,
        message: message.message,
        gameInstance,
        chatClient,
        apiClient,
        socket,
      });
    });
  });
  chatClient.onMessage(
    async (
      channel: string,
      user: string,
      text: string,
      meta: PrivateMessage
    ) => {
      if (usersBlacklist.includes(user.toLowerCase())) return;
      const extractEmotes = meta
        .parseEmotes()
        .map((p) => (p.type === "text" ? p.text : ""));
      const parsedText = extractEmotes.join(" ");
      const [first, ...args] = parsedText.split(" ");
      let command = first.startsWith("!")
        ? first.replace(/!/g, "").toLowerCase()
        : "";

      command = command.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      for (let i = 0; i < commandListeners.length; i++) {
        const cancelNext = await commandListeners[i]({
          channel,
          user,
          rawText: text,
          command,
          meta,
          parsedText,
          args,
          chatClient,
          apiClient,
          userId: meta.userInfo.userId,
          gameInstance,
          socket,
        });
        if (cancelNext) break;
      }
    }
  );
});
