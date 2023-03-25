export function alias(command: string) {
  switch (command) {
    case "saut":
      return "jump";
    case "mdr":
    case "lol":
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
      return "song";
    default:
      return command;
  }
}
