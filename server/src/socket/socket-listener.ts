import { ClientSocket } from "../listeners";
import { HeroGame } from "../game/hero-game";

export function socketListener({
  socket,
  gameInstance,
}: {
  socket: ClientSocket;
  gameInstance: HeroGame;
}) {
  console.log("a socket client is connected");

  socket.emit("gameState", gameInstance.state);
  socket.on("disconnect", () => {
    console.log("a socket client is disconnected");
  });
  socket.on("playerKill", (data) => {
    gameInstance.playerKill(data.attacker, data.target);
    /* chatClient.say(
                TWITCH_CHANNEL,
                `${data.attacker.name} a mis ko  ${data.target.name} et gagne 1 point de ${rand}`
              );*/
  });
}
