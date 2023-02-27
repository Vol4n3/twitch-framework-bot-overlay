import { CommandListener } from "../listeners";

export const HeroStat: CommandListener = ({
  channel,
  command,
  user,
  args,
  chatClient,
  gameInstance,
}) => {
  if (command === "hero") {
    const name = args[0] || user;
    const message: string = gameInstance.playerStateToString(name);
    if (!message) return;
    chatClient.say(channel, message);
  }
};
