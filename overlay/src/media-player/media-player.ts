import "../style.scss";
import "./media-player.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ClipInfo,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";

const { VITE_SERVER_ADDRESS } = import.meta.env;

declare global {
  interface Window {
    Twitch: any;
  }
}
async function playSound(fileName: string): Promise<number> {
  const audio = new Audio(`/sounds/${fileName}`);
  await audio.play();
  return new Promise((resolve) =>
    setTimeout(() => resolve(audio.duration), audio.duration * 1000 * 0.8)
  );
}

const mediaContainer = document.getElementById(
  "mediaContainer"
) as HTMLDivElement;

async function playVideo(fileName: string, flip: boolean): Promise<number> {
  if (!mediaContainer) return 0;
  const video = document.createElement("video");
  const source = document.createElement("source");
  if (flip) video.style.transform = "rotateY(180deg)";
  video.controls = false;
  video.autoplay = true;

  source.src = `/videos/${fileName}`;
  video.appendChild(source);
  return new Promise(async (resolve) => {
    video.addEventListener(
      "ended",
      () => {
        mediaContainer.removeChild(video);
        resolve(video.duration);
      },
      { once: true }
    );
    mediaContainer.appendChild(video);
    await video.play();
  });
}

async function playTwitchClip(clip: ClipInfo) {
  const parent = document.getElementById("twitchClip");
  if (!parent) return;
  const iframe = document.createElement("iframe");
  iframe.src = `https://clips.twitch.tv/embed?clip=${clip.id}&autoplay=true&parent=localhost`;
  iframe.width = "1280px";
  iframe.height = "720px";
  parent.appendChild(iframe);
  iframe.addEventListener("load", () => {
    setTimeout(() => {
      parent.removeChild(iframe);
    }, clip.duration * 1000);
  });
}

function init() {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  socket.on("playMultipleSound", async (data) => {
    for (let i = 0; i < data.length; i++) {
      const media = data[i];
      if (media.type === "sounds") {
        const duration = await playSound(media.fileName);
        if (duration > 7) break;
      } else {
        const duration = await playVideo(media.fileName, false);
        if (duration > 7) break;
      }
    }
  });
  socket.on("playSound", async (data) => {
    for (let i = 0; i < data.times; i++) {
      const duration = await playSound(data.fileName);
      if (duration > 7) break;
    }
  });
  socket.on("playVideo", async (data) => {
    for (let i = 0; i < data.times; i++) {
      const duration = await playVideo(data.fileName, i % 2 === 1);
      if (duration > 7) break;
    }
  });
  socket.on("playClip", playTwitchClip);
}

init();
