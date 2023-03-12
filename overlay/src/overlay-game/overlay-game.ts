import "../style.scss";
import "./overlay-game.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/src/shared-socket";
import { Intersection, Scene2d } from "jcv-ts-utils";
import { Hero } from "./objects/hero";
import { buildSpriteSheet } from "./animation/sprite-builder";

const { VITE_SERVER_ADDRESS, VITE_BROADCAST_ID } = import.meta.env;

const init = async () => {
  const container = document.getElementById("scene");
  if (!container) return;
  const scene = new Scene2d(container);

  const spriteSheets = await buildSpriteSheet();

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  const heroes: Hero[] = [];

  container.addEventListener("click", (e) => {
    heroes[0].jump(e.x, e.y);
  });

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
    scene.addUpdateListener(() => {
      heroes.forEach((a) => {
        heroes.forEach((b) => {
          if (a === b) return;
          if (Intersection.rectInRect(a.getRect(), b.getRect())) {
            a.attack(b);
          }
        });
      });
    });

    socket.on("gameState", async (data) => {
      heroes.forEach((hero) => {
        const find = data.players.find((f) => f.id === hero.player.id);
        if (!find) return;
        hero.player = find;
      });
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
            container,
            spriteSheets[newPlayer.skin]
          );
          hero.onDie = (killer) => {
            socket.emit("playerKill", {
              target: hero.player,
              attacker: killer.player,
            });
          };
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
