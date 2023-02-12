import { CommandListener } from "../listeners";
import { promises as fs } from "fs";
import { SOUNDS_PATH } from "../configs";

interface SoundDef {
  fileName: string;
  id: string;
}

let sounds: SoundDef[] = [];

export async function initSounds() {
  console.log("scan audio");
  const files = await fs.readdir(SOUNDS_PATH);
  console.log("audio found files", files.length);
  sounds = files.map((fileName, i) => ({
    id: fileName.split("-").at(0) || i.toString(),
    fileName,
  }));
}

export const SoundListener: CommandListener = async ({
  command,
  args,
  clientSockets,
}) => {
  if (command === "sound") {
    const fileNames: string[] = args
      .slice(0, 5)
      .map((arg) => sounds.find((s) => s.id === arg)?.fileName)
      .filter((f) => !!f) as string[];
    clientSockets.forEach((socket) => {
      socket.emit("playMultipleSound", fileNames);
    });
    return;
  }
  sounds.forEach(({ fileName, id }) => {
    if (id !== command.toLowerCase()) {
      return;
    }
    let times = parseInt(args[0]);
    times = isNaN(times) ? 1 : times;
    times = times > 5 ? 5 : times;
    clientSockets.forEach((socket) => {
      socket.emit("playSound", {
        fileName,
        times,
      });
    });
  });
};
