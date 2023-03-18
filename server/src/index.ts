import { Server } from "socket.io";
import { PrivateMessage } from "@twurple/chat";
import { promises as fs } from "fs";
import { commandListeners, rewardListeners, ServerSocket } from "./listeners";
import { HeroGame } from "./game/hero-game";
import {
  SERVER_PORT,
  SOUNDS_PATH,
  STORAGE_FOLDER,
  TWITCH_BOT_CLIENT,
  TWITCH_BOT_ID,
  TWITCH_BOT_SECRET,
  TWITCH_BROADCASTER_CLIENT,
  TWITCH_BROADCASTER_ID,
  TWITCH_BROADCASTER_SECRET,
  TWITCH_CHANNEL,
} from "./configs";
import { initMedias } from "./command-listeners/medias-commands";
import { TwurpleInit } from "./twurple/twurple-init";
import { ObsInit } from "./obs/obs-init";
import { socketClients } from "./socket/socket-clients";
import { SpotifyInit } from "./spotify/spotify-init";
import { httpServer } from "./server";

fs.mkdir(`./${STORAGE_FOLDER}`).catch(() => {});
fs.mkdir(SOUNDS_PATH).catch(() => {});
initMedias().catch((reason) => {
  console.log(reason);
});

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const socket: ServerSocket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
httpServer.listen(SERVER_PORT);
const gameInstance = new HeroGame();

const usersBlacklist = ["moobot", "b34rbot"].map((m) => m.toLowerCase());
Promise.all([
  TwurpleInit(
    TWITCH_BROADCASTER_CLIENT,
    TWITCH_BROADCASTER_SECRET,
    TWITCH_BROADCASTER_ID
  ),
  TwurpleInit(TWITCH_BOT_CLIENT, TWITCH_BOT_SECRET, TWITCH_BOT_ID),
  ObsInit(),
  SpotifyInit(),
]).then(async ([{ apiClient, pubSubClient }, { chatClient }, obs, spotify]) => {
  await gameInstance.addPlayer("boss", "Boss");
  socket.on("connection", (socket) => {
    socketClients({ socket, gameInstance });
  });

  chatClient.onMessage(
    async (
      channel: string,
      user: string,
      text: string,
      meta: PrivateMessage
    ) => {
      const userLower = user.toLowerCase();
      if (usersBlacklist.includes(userLower)) return;
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
          user: userLower,
          rawText: text,
          command,
          meta,
          parsedText,
          args: args.map((arg) => arg.toLowerCase()),
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

  pubSubClient.onRedemption(TWITCH_BROADCASTER_ID, async (message) => {
    const userLower = message.userName.toLowerCase();
    console.log(message.channelId);
    rewardListeners.forEach((cb) => {
      cb({
        channel: TWITCH_CHANNEL,
        user: userLower,
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
});

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
    process.exit(0);
  });
});
