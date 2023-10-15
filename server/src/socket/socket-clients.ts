import { ClientSocket } from "../listeners";
import { ChatClient } from "@twurple/chat";

export function socketClients({
  socket,
}: {
  socket: ClientSocket;
  chatBotClient: ChatClient;
  chatBroadcasterClient: ChatClient;
}) {
  console.log("a socket client is connected");

  socket.on("disconnect", () => {
    console.log("a socket client is disconnected");
  });
}
