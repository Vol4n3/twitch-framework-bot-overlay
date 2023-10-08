import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import {
  SOUNDS_PATH,
  STORAGE_FOLDER,
  TWITCH_BOT_ID,
  VIDEOS_PATH,
} from "../configs";
import { ArrayUtils } from "jcv-ts-utils";
import { MediasChoice, MediasType } from "../../../shared/src/shared-socket";
import pickRandomOne = ArrayUtils.pickRandomOne;

type GroupedMedia = {
  choices: MediasChoice[];
  id: string;
};
const groupedMedias: GroupedMedia[] = [];
const saveConnectedUsers = async (users: string[]) => {
  return fs.writeFile(
    `./${STORAGE_FOLDER}/connected-users.json`,
    JSON.stringify(users, null, 4),
    "utf-8"
  );
};
const getConnectedUsers = async (): Promise<string[]> => {
  try {
    return JSON.parse(
      await fs.readFile(`./${STORAGE_FOLDER}/connected-users.json`, {
        encoding: "utf-8",
      })
    );
  } catch (e) {
    return [];
  }
};

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
      const pushGroupedMedia = (id: string) => {
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
      };
      const match = fileName.match(/([a-z]+)[0-9]+\./i);
      pushGroupedMedia(
        match
          ? match[1].toLowerCase()
          : fileName.split(".").at(0)?.trim().toLowerCase() || i.toString()
      );
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
  apiBotClient,
  meta,
  user,
  userId,
}) => {
  const emitVideo = (filename: string, times: number) => {
    times = isNaN(times) ? 1 : times;
    times = times > 3 ? 3 : times;
    socket.emit("playVideo", {
      fileName: `${filename}`,
      times,
    });
  };
  const playSound = (fileName: string, times: number) => {
    times = isNaN(times) ? 1 : times;
    times = times > 3 ? 3 : times;
    socket.emit("playSound", {
      fileName,
      times,
    });
  };
  const connectedUser = await getConnectedUsers();
  if (!connectedUser.includes(user)) {
    playSound("tuturu.mp3", 1);
    await saveConnectedUsers([...connectedUser, user]);
  }
  if (!command) return;
  if (command === "so") {
    if (meta.userInfo.isMod || meta.userInfo.isBroadcaster) {
      if (!args[0]) return;
      const getId = await apiClient.users.getUserByName(args[0]);
      if (!getId) return;
      const clips = await apiClient.clips.getClipsForBroadcaster(getId);
      const rand = pickRandomOne(clips.data);
      const volume = await obs.call("GetInputVolume", {
        inputName: "music",
      });
      await obs.call("SetInputVolume", {
        inputName: "music",
        inputVolumeMul: 0,
      });
      setTimeout(async () => {
        await obs.call("SetInputVolume", {
          inputName: "music",
          inputVolumeMul: volume.inputVolumeMul,
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
    await apiBotClient.whispers.sendWhisper(
      TWITCH_BOT_ID,
      userId,
      `liste des videos: ${groupedMedias.map((m) => "!" + m.id).join(" ")}`
    );
    await chatClient.say(channel, `@${user} , je t'envoie la liste en mp.`);
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
