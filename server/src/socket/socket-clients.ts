import { ClientSocket } from "../listeners";
import { HeroGame } from "../game/hero-game";
import { ChatClient } from "@twurple/chat";
import { TWITCH_CHANNEL } from "../configs";

export function socketClients({
  socket,
  gameInstance,
  chatClient,
}: {
  socket: ClientSocket;
  gameInstance: HeroGame;
  chatClient: ChatClient;
}) {
  console.log("a socket client is connected");

  socket.emit("gameState", gameInstance.getState());
  socket.on("disconnect", () => {
    console.log("a socket client is disconnected");
  });
  socket.on("playerKill", async (data) => {
    const win = await gameInstance.playerKill(data.attacker, data.target);
    if (!win) {
      socket.emit("chatMessage", {
        message: `☠️${data.target.name}☠️`,
        user: data.attacker.name,
      });
      return;
    }
    socket.emit("chatMessage", {
      message: `☠️${data.target.name}☠️ +${win.point} ${win.stat}`,
      user: data.attacker.name,
    });
  });
}
