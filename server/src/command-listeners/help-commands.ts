import { CommandListener } from "../listeners";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;

export const HelpCommands: CommandListener = async ({
  command,
  channel,
  chatBotClient,

  args,
  messageCount,
}) => {
  if (messageCount % 50 === 0) {
    const rand = pickRandomOne(["Hello je suis un bot", "J'aime le code"]);
    await chatBotClient.say(channel, rand);
  }
  if (command === "discord") {
  }
  if (command === "github") {
  }
};
