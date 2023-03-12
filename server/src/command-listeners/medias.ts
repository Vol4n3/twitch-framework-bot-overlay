import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import {
  SOUNDS_PATH,
  GREEN_VIDEOS_FOLDER,
  STANDARD_VIDEOS_FOLDER,
  VIDEOS_PATH,
  TWITCH_CHANNEL,
} from "../configs";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;

interface MediaDef {
  fileName: string;
  id: string;
}
type mediasType = "sounds" | "videos" | "greenVideo";
const medias: { [key in mediasType]: MediaDef[] } = {
  sounds: [],
  videos: [],
  greenVideo: [],
};

export async function initMedias() {
  const scan = async (type: mediasType) => {
    console.log(`scan ${type}`);
    const paths: {
      [key in mediasType]: string;
    } = {
      greenVideo: VIDEOS_PATH + "/" + GREEN_VIDEOS_FOLDER,
      sounds: SOUNDS_PATH,
      videos: VIDEOS_PATH + "/" + STANDARD_VIDEOS_FOLDER,
    };
    const files = await fs.readdir(paths[type]);
    console.log(`${type} found files`, files.length);
    medias[type] = files.map((fileName, i) => ({
      id: fileName.split(".").at(0)?.trim().toLowerCase() || i.toString(),
      fileName,
    }));
  };
  await scan("sounds").catch((e) => console.log(e));
  await scan("greenVideo").catch((e) => console.log(e));
  await scan("videos").catch((e) => console.log(e));
}
export const MediaListener: CommandListener = async ({
  command,
  args,
  socket,
  chatClient,
  channel,
  obs,
  user,
}) => {
  const emitVideo = async (filename: string, isGreen: boolean) => {
    await obs.call("SetSourceFilterEnabled", {
      sourceName: "mediaPlayer",
      filterName: "fondVert",
      filterEnabled: isGreen,
    });
    socket.emit(
      "playVideo",
      `/${isGreen ? GREEN_VIDEOS_FOLDER : STANDARD_VIDEOS_FOLDER}/${filename}`
    );
  };
  if (!command) return;

  if (command === "randomsound") {
    const isVideo = Math.random() > 0.5;
    if (isVideo) {
      const isGreen = Math.random() > 0.5;
      if (isGreen) {
        const random = pickRandomOne(medias.greenVideo);
        await emitVideo(random.fileName, true);
      } else {
        const random = pickRandomOne(medias.videos);
        await emitVideo(random.fileName, false);
      }
    } else {
      const random = pickRandomOne(medias.sounds);
      socket.emit("playSound", {
        fileName: random.fileName,
        times: 1,
      });
    }
    return;
  }
  if (command === "randomvideo") {
    return;
  }
  if (command === "help" || command === "commands") {
    await chatClient.say(
      channel,
      "list des commandes:!randomvideo !randomsound !tts !videos !sounds !hero !discord !sound(chaine avec un espace les sons sans !)"
    );
    return;
  }
  if (command === "sounds") {
    await chatClient.say(
      channel,
      `list des sounds: ${medias.sounds.map((m) => "!" + m.id).join(" ")}`
    );
    return;
  }
  if (command === "videos") {
    await chatClient.say(
      channel,
      `list des videos: ${medias.videos
        .map((m) => "!" + m.id)
        .join(" ")} ${medias.greenVideo.map((m) => "!" + m.id).join(" ")}`
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
  const findSound = medias.sounds.find(({ id }) => id === command);
  if (findSound) {
    let times = parseInt(args[0]);
    times = isNaN(times) ? 1 : times;
    times = times > 5 ? 5 : times;

    socket.emit("playSound", {
      fileName: findSound.fileName,
      times,
    });
  }
  const findVideo = medias.videos.find(({ id }) => id === command);
  if (findVideo) {
    await emitVideo(findVideo.fileName, false);
  }
  const findGreenVideo = medias.greenVideo.find(({ id }) => id === command);
  if (findGreenVideo) {
    await emitVideo(findGreenVideo.fileName, true);
  }
};
