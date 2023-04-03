import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import { SOUNDS_PATH, VIDEOS_PATH } from "../configs";
import { ArrayUtils } from "jcv-ts-utils";
import pickRandomOne = ArrayUtils.pickRandomOne;
import { MediasChoice, MediasType } from "../../../shared/src/shared-socket";

interface MediaDef {
  fileName: string;
  id: string;
}
type GroupedMedia = {
  choices: MediasChoice[];
  id: string;
};
const groupedMedias: GroupedMedia[] = [];

export async function initMedias() {
  const scan = async (type: MediasType) => {
    console.log(`scan ${type}`);
    const paths: {
      [key in MediasType]: string;
    } = {
      sounds: SOUNDS_PATH,
      videos: VIDEOS_PATH,
    };
    const files = await fs.readdir(paths[type]);
    console.log(`${type} found files`, files.length);

    files.forEach((fileName, i) => {
      const match = fileName.match(/([a-z]+)[0-9]+\./i);
      if (match) {
        const id = match[1].toLowerCase();
        const findIndex = groupedMedias.findIndex((r) => r.id === id);
        if (findIndex >= 0) {
          const find = groupedMedias[findIndex];
          groupedMedias[findIndex] = {
            ...find,
            choices: [...find.choices, { fileName, type }],
          };
        } else {
          groupedMedias.push({ id, choices: [{ fileName, type }] });
        }
      } else {
        groupedMedias.push({
          id: fileName.split(".").at(0)?.trim().toLowerCase() || i.toString(),
          choices: [{ fileName, type }],
        });
      }
    });
  };
  await scan("sounds").catch((e) => console.log(e));
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
  const emitVideo = (filename: string, times: number) => {
    times = isNaN(times) ? 1 : times;
    times = times > 3 ? 3 : times;
    socket.emit("playVideo", {
      fileName: `${filename}`,
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

  if (command === "random") {
    const random = pickRandomOne(groupedMedias);
    const randomMedia = pickRandomOne(random.choices);
    if (randomMedia.type === "videos") {
      await emitVideo(randomMedia.fileName, 1);
    } else {
      socket.emit("playSound", {
        fileName: randomMedia.fileName,
        times: 1,
      });
    }
    return;
  }

  if (command === "medias") {
    await chatClient.say(
      channel,
      `list des videos: ${groupedMedias.map((m) => "!" + m.id).join(" ")}`
    );
    return;
  }
  if (command === "chain") {
    const choices: GroupedMedia[] = args
      .slice(0, 5)
      .map((arg) => groupedMedias.find((s) => s.id === arg))
      .filter((f: GroupedMedia | undefined) => !!f) as GroupedMedia[];
    socket.emit(
      "playMultipleSound",
      choices.map((m) => pickRandomOne(m.choices))
    );

    return;
  }
  const playSound = (fileName: string, times: number) => {
    times = isNaN(times) ? 1 : times;
    times = times > 3 ? 3 : times;

    socket.emit("playSound", {
      fileName,
      times,
    });
  };
  let times = parseInt(args[0]);
  const findRand = groupedMedias.find(({ id }) => id === command);
  if (findRand) {
    const randMedia = pickRandomOne(findRand.choices);
    if (randMedia.type === "sounds") {
      playSound(randMedia.fileName, times);
    } else {
      emitVideo(randMedia.fileName, times);
    }
  }
};
