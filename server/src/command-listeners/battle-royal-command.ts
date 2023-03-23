import { CommandListener } from "../listeners";

export const BattleRoyalCommand: CommandListener = async ({
  command,
  meta,
  socket,
  gameInstance,
  args,
}) => {
  if (command === "br" && meta.userInfo.isBroadcaster) {
    if (args[0]) {
      if (args[0] === "full") {
        socket.emit(
          "battleRoyal",
          gameInstance.getState((p) => p.id !== "boss")
        );
        return;
      }
    }
    socket.emit(
      "battleRoyal",
      gameInstance.getState((p) => p.id !== "boss", true)
    );
  }
};
