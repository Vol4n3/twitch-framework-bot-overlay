import "../style.scss";
import "./carroue.scss";
import { Scene2d } from "jcv-ts-utils";
import { Carroue } from "./object/carroue-item";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";
const { VITE_SERVER_ADDRESS } = import.meta.env;
const container = document.getElementById("scene");
const carroueResult = document.createElement("div");
carroueResult.className = "carroueResult";
if (container) {
  const scene = new Scene2d(container);
  const roue = new Carroue(0, scene.height / 2);
  scene.addItem(roue);
  container.appendChild(carroueResult);

  window.onclick = () => {
    roue.show = true;
    carroueResult.classList.remove("active");
    roue.launch();
  };
  roue.onIndexChange = async () => {
    const audio = new Audio(`/assets/audio/click.mp3`);
    audio.playbackRate = 2;
    audio.volume = 0.1;
    await audio.play();
  };
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  socket.on("connect", () => {
    roue.onStop = (choice) => {
      carroueResult.classList.add("active");
      carroueResult.textContent = choice.name;
      carroueResult.style.background = choice.color;
    };
    socket.on("showCarroue", (value) => {
      carroueResult.classList.remove("active");
      roue.show = value;
    });
    socket.on("launchCarroue", () => {
      roue.show = true;
      roue.launch();
    });
  });
}
