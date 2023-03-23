import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import {
  GREEN_VIDEOS_FOLDER,
  SOUNDS_PATH,
  STANDARD_VIDEOS_FOLDER,
  VIDEOS_PATH,
} from "../configs";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;

interface MediaDef {
  fileName: string;
  id: string;
}

type mediasType = "sounds" | "videos" | "greenVideo";
const mediasCommands: { [key in mediasType]: MediaDef[] } = {
  sounds: [],
  videos: [],
  greenVideo: [],
};
const commonSounds: { choices: string[]; id: string; type: mediasType }[] = [];

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
    if (type === "sounds") {
      files.forEach((fileName, i) => {
        const match = fileName.match(/(.+)\d\./);
        if (match) {
          const id = match[1].toLowerCase();
          const findIndex = commonSounds.findIndex((r) => r.id === id);
          if (findIndex >= 0) {
            const find = commonSounds[findIndex];
            commonSounds[findIndex] = {
              ...find,
              choices: [...find.choices, fileName],
            };
          } else {
            commonSounds.push({ id, choices: [fileName], type });
          }
        }
      });
    }

    mediasCommands[type] = files.map((fileName, i) => ({
      id: fileName.split(".").at(0)?.trim().toLowerCase() || i.toString(),
      fileName,
    }));
  };
  await scan("sounds").catch((e) => console.log(e));
  await scan("greenVideo").catch((e) => console.log(e));
  await scan("videos").catch((e) => console.log(e));
}

export const MediaCommands: CommandListener = async ({
  command,
  args,
  socket,
  chatClient,
  channel,
  obs,
  apiClient,
  meta,
}) => {
  const emitVideo = async (
    filename: string,
    isGreen: boolean,
    times: number
  ) => {
    times = isNaN(times) ? 1 : times;
    times = times > 3 ? 3 : times;
    await obs.call("SetSourceFilterEnabled", {
      sourceName: "mediaPlayer",
      filterName: "fondVert",
      filterEnabled: isGreen,
    });
    socket.emit("playVideo", {
      fileName: `/${
        isGreen ? GREEN_VIDEOS_FOLDER : STANDARD_VIDEOS_FOLDER
      }/${filename}`,
      times,
    });
  };
  if (!command) return;
  if (command === "so") {
    if (meta.userInfo.isMod || meta.userInfo.isBroadcaster) {
      if (!args[0]) return;
      const getId = await apiClient.users.getUserByName(args[0]);
      if (!getId) return;
      const clips = await apiClient.clips.getClipsForBroadcaster(getId);
      const rand = pickRandomOne(clips.data);
      await obs.call("SetInputVolume", {
        inputName: "music",
        inputVolumeMul: 0,
      });
      setTimeout(async () => {
        await obs.call("SetInputVolume", {
          inputName: "music",
          inputVolumeMul: 0.45,
        });
      }, rand.duration * 1000);
      socket.emit("playClip", { id: rand.id, duration: rand.duration });
      const broadcaster = await rand.getBroadcaster();
      await chatClient.say(
        channel,
        `Ce clip provient de ${broadcaster.displayName}, allez voir sa chaine : https://www.twitch.tv/${broadcaster.name}`
      );
    }
  }

  if (command === "randomsound") {
    const isVideo = Math.random() > 0.5;
    if (isVideo) {
      const isGreen = Math.random() > 0.5;
      if (isGreen) {
        const random = pickRandomOne(mediasCommands.greenVideo);
        await emitVideo(random.fileName, true, 1);
      } else {
        const random = pickRandomOne(mediasCommands.videos);
        await emitVideo(random.fileName, false, 1);
      }
    } else {
      const random = pickRandomOne(mediasCommands.sounds);
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

  if (command === "sounds") {
    await chatClient.say(
      channel,
      `list des sounds: ${mediasCommands.sounds
        .map((m) => "!" + m.id)
        .join(" ")}`
    );
    return;
  }
  if (command === "videos") {
    await chatClient.say(
      channel,
      `list des videos: ${mediasCommands.videos
        .map((m) => "!" + m.id)
        .join(" ")} ${mediasCommands.greenVideo
        .map((m) => "!" + m.id)
        .join(" ")}`
    );
    return;
  }
  if (command === "sound") {
    const fileNames: string[] = args
      .slice(0, 5)
      .map((arg) => mediasCommands.sounds.find((s) => s.id === arg)?.fileName)
      .filter((f) => !!f) as string[];

    socket.emit("playMultipleSound", fileNames);

    return;
  }
  const playSound = (fileName: string, times: number) => {
    times = isNaN(times) ? 1 : times;
    times = times > 5 ? 5 : times;

    socket.emit("playSound", {
      fileName,
      times,
    });
  };
  let times = parseInt(args[0]);
  const findRand = commonSounds.find(({ id }) => id === command);
  if (findRand) {
    playSound(pickRandomOne(findRand.choices), times);
  }
  const findSound = mediasCommands.sounds.find(({ id }) => id === command);
  if (findSound) {
    playSound(findSound.fileName, times);
  }
  const findVideo = mediasCommands.videos.find(({ id }) => id === command);
  if (findVideo) {
    await emitVideo(findVideo.fileName, false, times);
  }
  const findGreenVideo = mediasCommands.greenVideo.find(
    ({ id }) => id === command
  );
  if (findGreenVideo) {
    await emitVideo(findGreenVideo.fileName, true, times);
  }
};
