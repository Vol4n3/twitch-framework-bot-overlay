import "../style.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";
const { VITE_SERVER_ADDRESS } = import.meta.env;

const playSound = async (fileName: string) => {
  const audio = new Audio(`/sounds/${fileName}`);
  await audio.play();
  await new Promise((resolve) => setTimeout(resolve, audio.duration * 1000));
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
  });
};
init();
