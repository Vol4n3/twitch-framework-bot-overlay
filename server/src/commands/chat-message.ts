import { CommandListener } from "../listeners";

export const ChatMessage: CommandListener = async ({
  user,
  gameInstance,
  userId,
  clientSockets,
  rawText,
}) => {
  // on speak in chat , player join the game
  await gameInstance.addPlayer(userId, user);
  clientSockets.forEach((socket) => {
    // sent socket when game State change
    socket.emit("gameState", gameInstance.state);
    // send socket when message wrote
    socket.emit("chatMessage", { user, message: rawText });
  });
};
