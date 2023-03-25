import { CommandListener } from "../listeners";
import { TTS } from "../tts/tts";

type Voice =
  | "julie"
  | "paul"
  | "haruka"
  | "claude"
  | "caroline"
  | "ayumi"
  | "david"
  | "heami"
  | "hedda"
  | "helena"
  | "helia"
  | "hortense"
  | "huihui"
  | "ichiro"
  | "irina"
  | "kangkang"
  | "karsten"
  | "katja"
  | "laura"
  | "mark"
  | "nathalie"
  | "pablo"
  | "pavel"
  | "sayaka"
  | "stefan"
  | "yaoyao"
  | "zira";
const voices: { [key in Voice]: { name: string; lang: string } } = {
  julie: { name: "Microsoft Julie", lang: "frFR" },
  paul: { name: "Microsoft Paul", lang: "frFR" },
  haruka: { name: "Microsoft Haruka Desktop", lang: "jaJP" },
  claude: { name: "Microsoft Claude", lang: "frCA" },
  caroline: { name: "Microsoft Caroline", lang: "frCA" },

  ayumi: { name: "Microsoft Ayumi", lang: "jaJP" },
  david: { name: "Microsoft David", lang: "enUS" },
  heami: { name: "Microsoft Heami", lang: "koKR" },
  hedda: { name: "Microsoft Hedda", lang: "deDE" },
  helena: { name: "Microsoft Helena", lang: "esES" },
  helia: { name: "Microsoft Helia", lang: "ptPT" },
  hortense: { name: "Microsoft Hortense", lang: "frFR" },
  huihui: { name: "Microsoft Huihui", lang: "zhCN" },
  ichiro: { name: "Microsoft Ichiro", lang: "jaJP" },
  irina: { name: "Microsoft Irina", lang: "ruRU" },
  kangkang: { name: "Microsoft Kangkang", lang: "zhCN" },
  karsten: { name: "Microsoft Karsten", lang: "deCH" },
  katja: { name: "Microsoft Katja", lang: "deDE" },
  laura: { name: "Microsoft Laura", lang: "esES" },
  mark: { name: "Microsoft Mark", lang: "enUS" },
  nathalie: { name: "Microsoft Nathalie(Canada)", lang: "frCA" },
  pablo: { name: "Microsoft Pablo", lang: "esES" },
  pavel: { name: "Microsoft Pavel", lang: "ruRU" },
  sayaka: { name: "Microsoft Sayaka", lang: "jaJP" },
  stefan: { name: "Microsoft Stefan", lang: "deDE" },
  yaoyao: { name: "Microsoft Yaoyao", lang: "zhCN" },
  zira: { name: "Microsoft Zira", lang: "enUS" },
};
const defaultVoice = "Microsoft Julie";
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
    if (!first) {
      await chatClient.say(
        channel,
        Object.keys(voices)
          .map((m) => `${m}(${voices[m as Voice].lang})`)
          .join(" ")
      );
      return;
    }
    switch (first as Voice) {
      default:
        if (Object.keys(voices).indexOf(first) >= 0) {
          choices[user] = voices[first as Voice].name;
        }
        break;
    }
  }
  if (command === "tts") {
    const preferredVoice = choices[user];
    await TTS(
      args.join(" ").slice(0, 200),
      preferredVoice ? preferredVoice : defaultVoice,
      0
    );
  }
};
