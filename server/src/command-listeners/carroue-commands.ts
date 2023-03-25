import { CommandListener } from "../listeners";
import { carroueHolder, setCarroueHolder } from "../carroue-holder";

export const CarroueCommands: CommandListener = async ({
  command,
  socket,
  user,
  rawText,
  meta,
  args,
}) => {
  if (meta.userInfo.isBroadcaster) {
    if (command === "roue") {
      socket.emit("showCarroue", true);
      setCarroueHolder(args[0] || user, false);
    }
    if (command === "hideroue") {
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
      let sens =
        lower.includes("3") && lower.includes("4") && lower.includes("1");

      socket.emit("launchCarroue", sens);
      setCarroueHolder(user, true);
    }
  }
};
