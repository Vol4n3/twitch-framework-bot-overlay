import { Server } from "socket.io";
import { PrivateMessage } from "@twurple/chat";
import { promises as fs } from "fs";
import { commandListeners, rewardListeners, ServerSocket } from "./listeners";
import { createServer } from "http";
import { HeroGame } from "./game/hero-game";
import {
  BROADCASTER_ID,
  SERVER_ADDRESS,
  SERVER_PORT,
  SOUNDS_PATH,
  STORAGE_FOLDER,
  TWITCH_CHANNEL,
} from "./configs";
import { initMedias } from "./command-listeners/medias-commands";
import { setTwitchCode, TwurpleInit } from "./twurple/twurple-init";
import { ObsInit } from "./obs/obs-init";
import { socketClients } from "./socket/socket-clients";
import { setSpotifyCode, SpotifyInit } from "./spotify/spotify-init";

fs.mkdir(`./${STORAGE_FOLDER}`).catch(() => {});
fs.mkdir(SOUNDS_PATH).catch(() => {});
initMedias().catch((reason) => {
  console.log(reason);
});

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const httpServer = createServer((req, res) => {
  const url = new URL(`${SERVER_ADDRESS}${req.url || "/"}`);
  const searchCode = url.searchParams.get("code");
  if (req.url && req.url.startsWith("/twurple")) {
    if (searchCode) setTwitchCode(searchCode);
  }
  if (req.url && req.url.startsWith("/spotify")) {
    if (searchCode) setSpotifyCode(searchCode);
  }

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
const gameInstance = new HeroGame();

const usersBlacklist = ["moobot", "b34rbot"].map((m) => m.toLowerCase());
Promise.all([TwurpleInit(), ObsInit(), SpotifyInit()]).then(
  async ([{ apiClient, chatClient, pubSubClient }, obs, spotify]) => {
    await gameInstance.addPlayer("boss", "Boss");
    socket.on("connection", (socket) => {
      socketClients({ socket, gameInstance });
    });

    pubSubClient.onRedemption(BROADCASTER_ID, async (message) => {
      console.log(message.channelId);
      rewardListeners.forEach((cb) => {
        cb({
          channel: TWITCH_CHANNEL,
          user: message.userName,
          rewardTitle: message.rewardTitle,
          userId: message.userId,
          message: message.message,
          gameInstance,
          chatClient,
          apiClient,
          socket,
          obs,
          spotify,
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
            obs,
            spotify,
          });
          if (cancelNext) break;
        }
      }
    );
  }
);

[
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
  "SIGSEGV",
  "SIGUSR2",
  "SIGTERM",
].forEach((sig: string) => {
  process.on(sig, async () => {
    await gameInstance.saveGame();
    process.exit(1);
  });
});
