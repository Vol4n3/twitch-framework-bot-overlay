import { promises as fs } from "fs";
import {
  GameData,
  HeroStats,
  Player,
  PlayerWithHeroStats,
} from "../../../shared/src/shared-game";
import { NumberUtils } from "jcv-ts-utils";
import { STORAGE_FOLDER } from "../configs";

const dataPath = `./${STORAGE_FOLDER}/game.json`;
const { scaleHyperTangent } = NumberUtils;

async function loadData(): Promise<GameData<Player>> {
  return JSON.parse(await fs.readFile(dataPath, { encoding: "utf-8" }));
}

async function saveData(data: GameData<Player>) {
  return await fs.writeFile(dataPath, JSON.stringify(data, null, 4), "utf-8");
}

const defaultPoints: HeroStats = {
  pv: 0,
  power: 0,
  speed: 0,
  dodge: 0,
  critic: 0,
  regen: 0,
};
const pointToStat = ({
  critic,
  speed,
  pv,
  power,
  dodge,
  regen,
}: HeroStats): HeroStats => {
  return {
    critic: NumberUtils.round(scaleHyperTangent(critic, 200, 50, 5), 100),
    dodge: NumberUtils.round(scaleHyperTangent(dodge, 200, 50, 5), 100),
    power: NumberUtils.round(scaleHyperTangent(power, 200, 60, 2), 1),
    pv: NumberUtils.round(scaleHyperTangent(pv, 200, 200, 10), 1),
    regen: NumberUtils.round(scaleHyperTangent(regen, 200, 30, 1), 1),
    speed: NumberUtils.round(scaleHyperTangent(speed, 200, 100, 0), 1),
  };
};

function calcLvl(points: HeroStats): number {
  return (
    Math.ceil(
      (Object.keys(points) as (keyof HeroStats)[]).reduce(
        (prev, curr) => prev + points[curr],
        0
      ) / 10
    ) + 1
  );
}

export class HeroGame {
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

  get state(): GameData<PlayerWithHeroStats> {
    return {
      players: this.players.map((p) => ({
        ...p,
        heroStats: pointToStat(p.points),
        level: calcLvl(p.points),
      })),
    };
  }

  async addPoint(playerName: string, which: keyof HeroStats, amount: number) {
    this.players = this.players.map((player) => {
      if (player.name !== playerName) return player;
      return {
        ...player,
        points: { ...player.points, [which]: player.points[which] + amount },
      };
    });
    return this.saveGame();
  }
  getPlayerState(playerName: string): PlayerWithHeroStats | undefined {
    return this.state.players.find((p) => p.name === playerName);
  }
  playerStateToString(playerName: string): string {
    const player: PlayerWithHeroStats | undefined =
      this.getPlayerState(playerName);
    if (!player) return "";
    return `@${playerName}: lvl(${player.level})
      ${player.heroStats.pv}❤️‍🔥
      ${player.heroStats.regen}🍯
      ${player.heroStats.power}⚔️
      ${player.heroStats.critic}%✨
      ${player.heroStats.speed}%⚡
      ${player.heroStats.dodge}%😶‍🌫️
`;
  }

  async saveGame() {
    return saveData({ players: this.players }).catch(() => {});
  }

  async addPlayer(id: string, name: string) {
    if (this.players.some((p) => p.id === id)) return;
    const findStored = this.storedPlayers.find((p) => p.id === id);
    const newPlayer: Player = {
      id,
      name,
      points: defaultPoints,
    };
    if (!findStored) this.storedPlayers.push(newPlayer);
    this.players.push(findStored || newPlayer);
    return this.saveGame();
  }
}
