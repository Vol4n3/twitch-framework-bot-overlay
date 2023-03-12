import { CommandListener } from "../listeners";

export const HeroChat: CommandListener = async ({
  user,
  gameInstance,
  userId,
  socket,
  rawText,
}) => {
  // on speak in chat , player join the game
  await gameInstance.addPlayer(userId, user);
  // sent socket when game State change
  socket.emit("gameState", gameInstance.state);
  // send socket when message wrote
  socket.emit("chatMessage", { user, message: rawText });
};
