import { SERVER_PORT, TWITCH_BROADCASTER_ID, TWITCH_CHANNEL } from "./configs";
import { ArrayUtils } from "jcv-ts-utils";
import { OnExitMessage, OnOnlineMessage } from "./welcome-messages";
import { socketClients } from "./socket/socket-clients";
import { PrivateMessage } from "@twurple/chat";
import { alias } from "./alias";
import { commandListeners, rewardListeners, ServerSocket } from "./listeners";
import { Server } from "socket.io";
import { httpServer } from "./server";
import { TwurpleInitProps } from "./twurple/twurple-init";
import OBSWebSocket from "obs-websocket-js";
import { SpotifyInstance } from "./spotify/spotify-types";
const socket: ServerSocket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
httpServer.listen(SERVER_PORT);

const usersBlacklist = ["moobot"].map((m) => m.toLowerCase());

let messageCount = 0;
export async function appInit([
  { chatClient: chatBroadcasterClient, apiClient, pubSubClient },
  { chatClient: chatBotClient, apiClient: apiBotClient },
  obs,
  spotify,
]: [TwurpleInitProps, TwurpleInitProps, OBSWebSocket, SpotifyInstance]) {
  // quand la config est prête alors ca execute ca

  await chatBotClient.say(
    TWITCH_CHANNEL,
    ArrayUtils.pickRandomOne(OnOnlineMessage)
  );
  socket.on("connection", (socket) => {
    socketClients({ socket, chatBroadcasterClient, chatBotClient });
  });

  chatBotClient.onMessage(
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
          chatBotClient,
          chatBroadcasterClient,
          apiClient,
          apiBotClient,
          userId: meta.userInfo.userId,
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
        chatBotClient,
        chatBroadcasterClient,
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
      await chatBotClient.say(
        TWITCH_CHANNEL,
        ArrayUtils.pickRandomOne(OnExitMessage)
      );
      process.exit(0);
    });
  });
}
