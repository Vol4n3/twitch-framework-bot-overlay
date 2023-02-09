import { promises as fs } from "fs";
import {
  GameData,
  Player,
  PlayerPoints,
} from "../../../shared/src/shared-game";

const dataPath = "./storage/game.json";

async function loadData(): Promise<GameData> {
  return JSON.parse(await fs.readFile(dataPath, { encoding: "utf-8" }));
}

async function saveData(data: GameData) {
  return await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}
const defaultPoints: PlayerPoints = {
  pv: 0,
  power: 0,
  speed: 0,
  dodge: 0,
  critic: 0,
};

export class Game {
  players: Player[] = [];
  private storedPlayers: Player[] = [];

  constructor() {
    loadData()
      .then(({ players }) => {
        this.storedPlayers = players;
      })
      .catch(() => {
        this.saveGame();
      });
  }

  saveGame() {
    saveData({ players: this.storedPlayers })
      .then(() => {
        console.log("success save data");
      })
      .catch(() => {});
  }

  get state(): GameData {
    return {
      players: this.players,
    };
  }

  addPlayer(id: string, name: string) {
    if (this.players.some((p) => p.id === id)) return;
    const findStored = this.storedPlayers.find((p) => p.id === id);
    const newPlayer: Player = { id, name, points: defaultPoints };
    if (!findStored) this.storedPlayers.push(newPlayer);
    this.players.push(findStored || newPlayer);
    this.saveGame();
  }
}
