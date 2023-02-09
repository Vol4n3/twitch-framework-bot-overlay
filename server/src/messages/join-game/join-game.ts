import { MessageListener } from "../../listeners";

export const JoinGame: MessageListener = ({
  user,
  gameInstance,
  userId,
  clientSockets,
}) => {
  // on speak in chat , player join the game
  gameInstance.addPlayer(userId, user);
  clientSockets.forEach((socket) =>
    socket.emit("gameState", gameInstance.state)
  );
};
