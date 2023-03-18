import { CommandListener } from "../listeners";
import { TWITCH_CHANNEL } from "../configs";
import { carroueHolder, setCarroueHolder } from "../carroue-holder";

export const CarroueCommands: CommandListener = async ({
  command,
  socket,
  user,
  rawText,
}) => {
  if (command === "hideroue") {
    if (user === TWITCH_CHANNEL.toLowerCase()) {
      socket.emit("showCarroue", false);
    }
  }
  if (carroueHolder && user === carroueHolder.name) {
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
