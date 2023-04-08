import { CommandListener } from "../listeners";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;

export const HelpCommands: CommandListener = async ({
  command,
  channel,
  chatClient,
  args,
  messageCount,
}) => {
  if (messageCount % 50 === 0) {
    const rand = pickRandomOne([
      "N'hésite pas à faire !help pour connaitre les commandes",
      "Ajoute à la playlist des sons ! exemple !sr la reine des neige",
      "Tu peux parler avec une voix de syntheses, ex: !say bonjour (!voice pour voir les Différentes voix ex: !voice paul)",
      "Liste des médias : !medias",
      "Essaye !random",
      "Change la couleur de ton avatar !color 300 (entre 0 et 600)",
      "Fait sauter ton avatar !jump",
      "Je commence à être intelligent, je serais peut être un jour humain !",
      "Miam le miel j'adore ça , dans 10 - 20 ans il y en n'aura plus",
    ]);
    await chatClient.say(channel, rand);
  }
  if (command === "discord") {
    await chatClient.say(
      channel,
      "Voici mon ancien discord : https://discord.gg/qx4AVfF"
    );
  }
  /**
   * Todo
   *
   * faire une commmand pour ajouter des stats via le chat
   */
  if (command === "github") {
    await chatClient.say(
      channel,
      "Voila voilou mon github : https://github.com/Vol4n3"
    );
  }
  if (command === "help") {
    switch (args[0]) {
      default:
        return await chatClient.say(
          channel,
          "!help command , pour plus de détail sur la commande. Liste des commandes:!color !sr !skip !song !random !tts !voice !medias !hero !jump !discord !chain"
        );
      case "sr":
        return await chatClient.say(
          channel,
          "Ajoute à la playlist un son ,exemple !sr reine des neige"
        );
      case "color":
        return await chatClient.say(
          channel,
          "met ton hero coloré !color  ou  !color 50  pour une couleur fixe"
        );
      case "jump":
        return await chatClient.say(
          channel,
          "Fait sauter ton héro !jump (right | left) optionnel"
        );
      case "command":
        return await chatClient.say(
          channel,
          "C'était juste un exemple LUL met une autre commande pour avoir plus de détails"
        );
      case "skip":
        return await chatClient.say(channel, "Passe la musique à la suivante");
      case "song":
        return await chatClient.say(channel, "Indique la nom de la musique");
      case "random":
        return await chatClient.say(channel, "Joue un media aléatoire");
      case "tts":
        return await chatClient.say(
          channel,
          "Dis quelque chose avec une voix de synthèse, example !tts bonjour"
        );
      case "voice":
        return await chatClient.say(
          channel,
          "Change la voix de syntheses, pour la liste !voice sinon par example !voice paul"
        );
      case "medias":
        return await chatClient.say(
          channel,
          "(Profite c'est temporaire) Liste des médias"
        );
      case "hero":
        return await chatClient.say(
          channel,
          "Stats de ton hero , ajoute un pseudo pour savoir ses stats"
        );
      case "chain":
        return await chatClient.say(
          channel,
          "Chaine les medias : example !chain uwu hello bonjour"
        );
    }
  }
};
