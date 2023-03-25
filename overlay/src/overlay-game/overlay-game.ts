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
import { PlayerWithHeroStats } from "../../../shared/src/shared-game";

const { VITE_SERVER_ADDRESS, VITE_BROADCAST_ID } = import.meta.env;

const init = async () => {
  const container = document.getElementById("scene");
  if (!container) return;
  const scene = new Scene2d(container);

  const spriteSheets = await buildSpriteSheet();

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(VITE_SERVER_ADDRESS);
  let tempPlayers: PlayerWithHeroStats[] = [];
  let heroes: Hero[] = [];
  let isBr: boolean = false;
  const findHeroById = (id: string): Hero | undefined => {
    return heroes.find((hero) => hero.player.id === id);
  };
  container.addEventListener("click", (e) => {
    heroes[0].jump(e.x, e.y);
  });
  const buildHeroes = (
    players: PlayerWithHeroStats[],
    isBattleRoyal: boolean = false
  ) => {
    heroes.push(
      ...players.map((player) => {
        const hero = new Hero(
          player,
          {
            x: (Math.random() * scene.width) / 2,
            y: 0,
          },
          container,
          spriteSheets[player.skin],
          isBattleRoyal
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
  };
  const connectionToHeat = () => {
    let heat = new WebSocket(
      `wss://heat-api.j38.net/channel/${VITE_BROADCAST_ID}`
    );
    const onHeatMessage = (heatMessage: any) => {
      if (heatMessage.type !== "message") return;
      const data = JSON.parse(heatMessage.data);
      if (data.type !== "click") return;
      const findHero = findHeroById(data.id);
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
  socket.on("battleRoyal", async (data) => {
    isBr = true;
    tempPlayers = heroes.map((h) => h.player);
    scene.items.forEach((item) => scene.removeItem(item));
    heroes = [];
    buildHeroes(data.players, true);
    const refInterval = window.setInterval(() => {
      const heroesAlives = heroes.reduce((prev, curr) => {
        return prev + (curr.isAlive() ? 1 : 0);
      }, 0);
      if (heroesAlives <= 1) {
        isBr = false;
        window.clearInterval(refInterval);
        const findWinner = heroes.find((f) => f.isAlive());
        socket.emit("brEnd", { winner: findWinner?.player });
        scene.items.forEach((item) => scene.removeItem(item));
        heroes = [];
        buildHeroes(tempPlayers);
      }
    }, 1000);
  });

  socket.on("gameState", async (data) => {
    if (isBr) return;
    heroes.forEach((hero) => {
      const find = data.players.find((f) => f.id === hero.player.id);
      if (!find) return;
      hero.player = find;
    });
    const newPlayers = data.players.filter(
      (f) => !heroes.some((s) => s.player.id === f.id)
    );
    buildHeroes(newPlayers);
  });
  socket.on("chatMessage", ({ message, userId }) => {
    const findHero = findHeroById(userId);
    if (!findHero) return;
    findHero.say(message);
  });
  socket.on("heroJump", ({ userId, direction }) => {
    const findHero = findHeroById(userId);
    if (!findHero) return;
    if (!direction) {
      findHero.jump(findHero.position.x, 0);
    } else {
      findHero.jump(direction === "left" ? 0 : scene.height, 0);
    }
  });
};
init();
