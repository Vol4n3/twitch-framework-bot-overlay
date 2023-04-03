export function alias(command: string) {
  switch (command) {
    case "saut":
      return "jump";
    case "chaine":
    case "list":
    case "suite":
    case "sounds":
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
    case "command":
    case "commandes":
    case "aide":
      return "help";
    case "musique":
    case "soung":
    case "play":
      return "song";
    default:
      return command;
  }
}
