import "../style.scss";
import "./media-player.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";
const { VITE_SERVER_ADDRESS } = import.meta.env;

const playSound = async (fileName: string) => {
  const audio = new Audio(`/sounds/${fileName}`);
  await audio.play();
  await new Promise((resolve) =>
    setTimeout(resolve, audio.duration * 1000 * 0.5)
  );
};
const mediaContainer = document.getElementById(
  "mediaContainer"
) as HTMLDivElement;
const playVideo = async (fileName: string) => {
  if (!mediaContainer) return;
  const video = document.createElement("video");
  const source = document.createElement("source");
  video.controls = false;
  video.autoplay = true;

  source.src = `/videos/${fileName}`;
  video.appendChild(source);
  video.addEventListener(
    "ended",
    () => {
      mediaContainer.removeChild(video);
    },
    { once: true }
  );
  mediaContainer.appendChild(video);
  await video.play();
};
const init = () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  socket.on("connect", () => {
    socket.on("playMultipleSound", async (data) => {
      for (let i = 0; i < data.length; i++) {
        await playSound(data[i]);
      }
    });
    socket.on("playSound", async (data) => {
      for (let i = 0; i < data.times; i++) {
        await playSound(data.fileName);
      }
    });
    socket.on("playVideo", async (fileName) => {
      await playVideo(fileName);
    });
  });
};
init();
