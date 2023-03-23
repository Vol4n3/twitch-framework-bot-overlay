import { CommandListener } from "../listeners";

export const HelpCommands: CommandListener = async ({
  command,
  channel,
  chatClient,
}) => {
  if (command === "help") {
    await chatClient.say(
      channel,
      "list des commandes:!sr !skip !song !randomvideo !randomsound !tts !videos !sounds !hero !discord !sound(chaine avec un espace les sons sans !)"
    );
    return;
  }
};
