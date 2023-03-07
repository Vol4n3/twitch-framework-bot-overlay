import { CommandListener } from "../listeners";

export const HeroStat: CommandListener = async ({
  channel,
  command,
  user,
  userId,
  args,
  chatClient,
  gameInstance,
}) => {
  if (command === "hero") {
    // await gameInstance.addPlayer(userId, user);
    const name = args[0] || user;
    const message: string = gameInstance.playerStateToString(name);
    if (!message) return;
    console.log(channel);
    await chatClient.say(channel, message);
  }
};
