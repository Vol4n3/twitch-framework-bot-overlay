import { ClientSocket } from "../listeners";
import { HeroGame } from "../game/hero-game";
import { ChatClient } from "@twurple/chat";

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
        userId: data.attacker.id,
      });
      return;
    }
    socket.emit("chatMessage", {
      message: `☠️${data.target.name}☠️ +${win.point} ${win.stat}`,
      userId: data.attacker.id,
    });
  });
}
