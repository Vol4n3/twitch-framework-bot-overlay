export function alias(command: string) {
  switch (command) {
    case "saut":
      return "jump";
    case "say":
      return "tts";
    case "sounds":
    case "videos":
      return "medias";
    case "chaine":
    case "list":
    case "suite":
      return "chain";
    case "mdr":
    case "lol":
    case "laugh":
      return "rire";
    case "pet":
      return "prout";
    case "sp":
      return "sr";
    case "commands":
    case "comand":
    case "comands":
    case "command":
    case "commandes":
    case "aide":
    case "aides":
    case "helps":
      return "help";
    case "musique":
    case "soung":
    case "spotify":
    case "play":
      return "song";
    default:
      return command;
  }
}
