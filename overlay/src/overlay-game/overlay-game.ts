import "../style.scss";
import "./overlay-game.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";
import { Scene2d } from "jcv-ts-utils";
import { Hero } from "./objects/hero";

const { VITE_SERVER_ADDRESS, VITE_BROADCAST_ID } = import.meta.env;
const init = () => {
  const container = document.getElementById("scene");
  if (!container) return;
  const scene = new Scene2d(container);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  const heroes: Hero[] = [];
  const connectionToHeat = () => {
    let heat = new WebSocket(
      `wss://heat-api.j38.net/channel/${VITE_BROADCAST_ID}`
    );
    const onHeatMessage = (heatMessage: any) => {
      if (heatMessage.type !== "message") return;
      const data = JSON.parse(heatMessage.data);
      if (data.type !== "click") return;
      const findHero = heroes.find((hero) => hero.player.id === data.id);
      if (!findHero) return;
      findHero.jump(data.x * scene.width, data.y * scene.height);
    };
    heat.addEventListener("message", onHeatMessage);
    heat.addEventListener(
      "close",
      () => {
        setTimeout(connectionToHeat, 10000);
        heat.removeEventListener("message", onHeatMessage);
      },
      { once: true }
    );
  };
  connectionToHeat();
  socket.on("connect", () => {
    socket.on("gameState", async (data) => {
      const newPlayers = data.players.filter(
        (f) => !heroes.some((s) => s.player.id === f.id)
      );

      heroes.push(
        ...newPlayers.map((newPlayer) => {
          const hero = new Hero(
            newPlayer,
            {
              x: (Math.random() * scene.width) / 2,
              y: 0,
            },
            container
          );
          scene.addItem(hero);
          return hero;
        })
      );
    });
    socket.on("chatMessage", ({ message, user }) => {
      const findHero = heroes.find((hero) => hero.player.name === user);
      if (!findHero) return;
      findHero.say(message);
    });
  });
};
init();
