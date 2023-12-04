import { CommandListener } from "../listeners";

export const SpotifyCommands: CommandListener = async ({
  spotify,
  command,
  args,
  chatBotClient: chatClient,
  channel,
}) => {
   /*if (command === "sr") {
    const response = await spotify.addQueue(args.join(" ")).catch(() => {
      chatClient.say(
        channel,
        "Impossible d’ajouter le son à la playlist , désolé :/"
      );
    });
    if (response) {
      await chatClient.say(
        channel,
        `Ajout à la playlist Spotify: ${response.name} ${response.external_urls.spotify}`
      );
    }
  }
  if (command === "skip") {
    await spotify.skipPlayer().catch(() => {
      chatClient.say(channel, "Impossible de skip , désolé :/");
    });
  }

  if (command === "song") {
    const response = await spotify.getCurrentPlay().catch(() => {
      chatClient.say(
        channel,
        "Impossible de savoir le son en cours, désolé :/"
      );
    });
    if (response) {
      await chatClient.say(
        channel,
        `${response.item.name} ${response.item.external_urls.spotify}`
      );
      }
  }*/
};
