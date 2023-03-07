import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import { SOUNDS_PATH, VIDEOS_PATH } from "../configs";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;

interface MediaDef {
  fileName: string;
  id: string;
}
type mediasType = "sounds" | "videos";
const medias: { [key in mediasType]: MediaDef[] } = {
  sounds: [],
  videos: [],
};

export async function initMedias() {
  const scan = async (type: mediasType) => {
    console.log(`scan ${type}`);
    const files = await fs.readdir(
      type === "sounds" ? SOUNDS_PATH : VIDEOS_PATH
    );
    console.log(`${type} found files`, files.length);
    medias[type] = files.map((fileName, i) => ({
      id: fileName.split(".").at(0)?.trim().toLowerCase() || i.toString(),
      fileName,
    }));
  };
  await scan("sounds").catch((e) => console.log(e));
  await scan("videos").catch((e) => console.log(e));
}
export const MediaListener: CommandListener = async ({
  command,
  args,
  socket,
  chatClient,
  channel,
}) => {
  if (!command) return;
  if (command === "random") {
    const isVideo = Math.random() > 0.5;
    if (!isVideo) {
      const random = pickRandomOne(medias.sounds);
      socket.emit("playSound", {
        fileName: random.fileName,
        times: 1,
      });
    } else {
      const random = pickRandomOne(medias.videos);
      socket.emit("playVideo", random.fileName);
    }
    return;
  }
  if (command === "randomvideo") {
    return;
  }
  if (command === "help") {
    chatClient.say(
      channel,
      "list des commandes: !tts !videos !sounds !hero !discord !sound(chaine avec un espace les sons sans !)"
    );
    return;
  }
  if (command === "sounds") {
    chatClient.say(
      channel,
      `list des sounds: ${medias.sounds.map((m) => "!" + m.id).join(" ")}`
    );
    return;
  }
  if (command === "videos") {
    chatClient.say(
      channel,
      `list des videos: ${medias.videos.map((m) => "!" + m.id).join(" ")}`
    );
    return;
  }
  if (command === "sound") {
    const fileNames: string[] = args
      .slice(0, 5)
      .map((arg) => medias.sounds.find((s) => s.id === arg)?.fileName)
      .filter((f) => !!f) as string[];

    socket.emit("playMultipleSound", fileNames);

    return;
  }
  const findSound = medias.sounds.find(({ id }) =>
    id.startsWith(command.toLowerCase())
  );
  if (findSound) {
    let times = parseInt(args[0]);
    times = isNaN(times) ? 1 : times;
    times = times > 5 ? 5 : times;

    socket.emit("playSound", {
      fileName: findSound.fileName,
      times,
    });
  }
  const findVideo = medias.videos.find(({ id }) =>
    id.startsWith(command.toLowerCase())
  );
  if (findVideo) {
    socket.emit("playVideo", findVideo.fileName);
  }
};
