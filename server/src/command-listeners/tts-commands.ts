import { CommandListener } from "../listeners";
import { TTS } from "../tts/tts";

const voices = {
  julie: "Microsoft Julie",
  paul: "Microsoft Paul",
  haruka: "Microsoft Haruka Desktop",
  claude: "Microsoft Claude",
  caroline: "Microsoft Caroline",
};
const voice = "Microsoft Julie";
const choices: { [key: string]: string } = {};
export const TtsCommands: CommandListener = async ({
  channel,
  chatClient,
  command,
  user,
  args,
}) => {
  if (command === "voice") {
    const first = args[0];
    if (!first) return;
    switch (first) {
      case "list":
        await chatClient.say(channel, Object.keys(voices).join(" "));
        break;
      case "julie":
      case "paul":
      case "haruka":
      case "claude":
      case "caroline":
        choices[user] = voices[first];
        break;
    }
  }
  if (command === "tts") {
    const preferredVoice = choices[user];
    TTS(
      args.join(" ").slice(0, 50),
      preferredVoice ? preferredVoice : voice,
      0
    ).then(() => {
      console.log("tts finish");
    });
  }
};
