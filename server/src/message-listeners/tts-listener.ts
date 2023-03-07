import { CommandListener } from "../listeners";
import { TTS } from "../tts/tts";
const Julie = "Microsoft Julie";
const Paul = "Microsoft Paul";
const Haruka = "Microsoft Haruka Desktop";
export const TtsListener: CommandListener = async ({ command, user, args }) => {
  if (command === "tts") {
    TTS(`${user} :`, Julie, 0).then(() => {
      TTS(args.join(" "), Paul, 0).then(() => {
        console.log("tts finish");
      });
    });
  }
};
