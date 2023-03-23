import { CommandListener } from "../listeners";
import { carroueHolder, setCarroueHolder } from "../carroue-holder";

export const CarroueCommands: CommandListener = async ({
  command,
  socket,
  user,
  rawText,
  meta,
}) => {
  if (command === "hideroue") {
    if (meta.userInfo.isBroadcaster) {
      socket.emit("showCarroue", false);
    }
  }
  if (carroueHolder && user === carroueHolder.name && !carroueHolder.haveTurn) {
    const lower = rawText.toLowerCase();
    if (
      lower.includes("t") &&
      lower.includes("o") &&
      lower.includes("u") &&
      lower.includes("r") &&
      lower.includes("n") &&
      lower.includes("e")
    ) {
      socket.emit("launchCarroue");
      setCarroueHolder(user, true);
    }
  }
};
