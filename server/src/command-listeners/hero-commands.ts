import { CommandListener } from "../listeners";
import { Stat } from "../../../shared/src/shared-game";

export const HeroCommands: CommandListener = async ({
  user,
  gameInstance,
  userId,
  socket,
  rawText,
  command,
  chatClient,
  channel,
  args,
  meta,
}) => {
  // on speak in chat , player join the game
  await gameInstance.addPlayer(userId, user);
  // sent socket when game State change
  socket.emit("gameState", gameInstance.getState());
  // send socket when message wrote
  socket.emit("chatMessage", { userId, message: rawText });
  if (meta.userInfo.isBroadcaster) {
    const [pseudo, stat, amount] = args;
    if (stat && pseudo) {
      if (command === "addstat") {
        if (
          !["pv", "power", "speed", "dodge", "critic", "regen"].includes(stat)
        ) {
          return;
        }
        await gameInstance.addPointByName(
          pseudo,
          stat as Stat,
          parseInt(amount, 10)
        );
      }
    }
  }

  if (command === "hero") {
    // await gameInstance.addPlayer(userId, user);
    const name = args[0] || user;
    const message: string = gameInstance.playerStateToString(name);
    if (!message) return;
    console.log(channel);
    await chatClient.say(channel, message);
  }
  if (command === "jump") {
    let direction = args[0];
    if (direction === "droite") direction = "right";
    if (direction === "gauche") direction = "left";
    socket.emit("heroJump", {
      userId,
      direction:
        direction === "left"
          ? "left"
          : direction === "right"
          ? "right"
          : undefined,
    });
  }
};
