import { CommandListener } from "../listeners";

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
}) => {
  // on speak in chat , player join the game
  await gameInstance.addPlayer(userId, user);
  // sent socket when game State change
  socket.emit("gameState", gameInstance.getState());
  // send socket when message wrote
  socket.emit("chatMessage", { user, message: rawText });
  if (command === "hero") {
    // await gameInstance.addPlayer(userId, user);
    const name = args[0] || user;
    const message: string = gameInstance.playerStateToString(name);
    if (!message) return;
    console.log(channel);
    await chatClient.say(channel, message);
  }
};
