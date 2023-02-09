import "./style.scss";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../shared/src/shared-socket";
import { Player } from "../../shared/src/shared-game";
import { Item2Scene, Point2, Scene2d } from "jcv-ts-utils";
const SERVER_PORT = 8085;
const SERVER_ADDRESS = `http://localhost:${SERVER_PORT}`;

class Hero implements Item2Scene {
  isUpdated: boolean = true;
  scenePriority: number = 0;

  constructor(public player: Player, public position: Point2 = [0, 0]) {}

  // @ts-ignore
  draw2d(scene: Scene2d): void {
    const { ctx } = scene;
    const [x, y] = this.position;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, 100, 100);
    ctx.closePath();
    ctx.fill();
    scene.writeText({
      x,
      y,
      text: this.player.name,
      fillStyle: "red",
    });
  }

  onResize(): void {}

  update(): void {}

  destroy(): void {}
}

const init = async () => {
  const container = document.getElementById("scene");
  if (!container) return;
  const scene = new Scene2d(container);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(SERVER_ADDRESS);
  let players: Player[] = [];
  const connectionToHeat = () => {
    let heat = new WebSocket(`wss://heat-api.j38.net/channel/58271362`);
    const onMessage = (data: any) => {
      console.log("heat", data);
    };
    heat.addEventListener("message", onMessage);
    heat.addEventListener(
      "close",
      () => {
        setTimeout(connectionToHeat, 1000);
        heat.removeEventListener("message", onMessage);
      },
      { once: true }
    );
  };
  connectionToHeat();
  socket.on("connect", () => {
    socket.on("gameState", async (data) => {
      const newPlayers = data.players.filter(
        (f) => !players.some((s) => s.id === f.id)
      );
      newPlayers.forEach((newPlayer) => {
        const hero = new Hero(newPlayer, [0, 0]);
        scene.addItem(hero);
      });
      players = data.players;
    });
  });
};
init()
  .then(() => {})
  .catch(() => {});
