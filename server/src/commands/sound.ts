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
  sounds.forEach(({ fileName, id }) => {
    if (id !== command.toLowerCase()) {
      return;
    }
    const times = parseInt(args[0]);
    clientSockets.forEach((socket) =>
      socket.emit("playSound", {
        fileName,
        times: isNaN(times) ? 1 : times,
      })
    );
  });
};
