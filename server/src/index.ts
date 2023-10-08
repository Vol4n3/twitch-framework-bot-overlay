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
import { spotifyInit } from "./spotify/spotify-init";
import { httpServer } from "./server";
import { alias } from "./alias";
import { ArrayUtils } from "jcv-ts-utils";

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
let messageCount = 0;
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
  .then(
    async ([
      { apiClient, pubSubClient },
      { chatClient, apiClient: apiBotClient },
      obs,
      spotify,
    ]) => {
      await chatClient.say(
        TWITCH_CHANNEL,
        ArrayUtils.pickRandomOne([
          "Me re?voilà !",
          "Re !",
          "Je suis prêt",
          "c’était rapide",
          "Hello world!",
        ])
      );
      await gameInstance.addPlayer("boss", "Boss");
      socket.on("connection", (socket) => {
        socketClients({ socket, gameInstance, chatClient });
      });

      chatClient.onMessage(
        async (
          channel: string,
          user: string,
          text: string,
          meta: PrivateMessage
        ) => {
          if (meta.isRedemption) return;
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
          command = alias(command);
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
              apiBotClient,
              userId: meta.userInfo.userId,
              gameInstance,
              socket,
              obs,
              spotify,
              messageCount: ++messageCount,
            }).catch((e) => console.error(e));
            if (typeof cancelNext === "boolean" && cancelNext) break;
          }
        }
      );

      pubSubClient.onRedemption(TWITCH_BROADCASTER_ID, async (message) => {
        const userLower = message.userName.toLowerCase();
        for (let i = 0; i < rewardListeners.length; i++) {
          const cancelNext = await rewardListeners[i]({
            channel: TWITCH_CHANNEL,
            user: userLower,
            rewardTitle: message.rewardTitle,
            rewardId: message.rewardId,
            userId: message.userId,
            message: message.message,
            gameInstance,
            chatClient,
            apiClient,
            apiBotClient,
            socket,
            obs,
            spotify,
          }).catch((e) => console.error(e));
          if (typeof cancelNext === "boolean" && cancelNext) break;
        }
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
          await chatClient.say(
            TWITCH_CHANNEL,
            ArrayUtils.pickRandomOne([
              "Je reviens peut être !",
              "À tantôt",
              "I brb",
              "Au revoir!",
              "C’est bon je me casse",
              "Pause bio!",
              "Je dois couler un navire de guerre, je reviens !",
            ])
          );
          process.exit(0);
        });
      });
    }
  )
  .catch((reason) => console.log(reason));
