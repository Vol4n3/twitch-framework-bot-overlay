import { promises as fs } from "fs";
import {
  GameData,
  HeroStats,
  Player,
  PlayerWithHeroStats,
} from "../../../shared/src/shared-game";
import { ArrayUtils, NumberUtils } from "jcv-ts-utils";
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
  // stats en fonction de la classe Choisi ( monk , guerrier, mage )
  return {
    critic: NumberUtils.round(scaleHyperTangent(critic, 500, 60, 1), 100),
    dodge: NumberUtils.round(scaleHyperTangent(dodge, 500, 60, 1), 100),
    power: NumberUtils.round(scaleHyperTangent(power, 500, 100, 2), 1),
    pv: NumberUtils.round(scaleHyperTangent(pv, 500, 400, 10), 1),
    regen: NumberUtils.round(scaleHyperTangent(regen, 500, 40, 1), 1),
    speed: NumberUtils.round(scaleHyperTangent(speed, 500, 200, 0), 1),
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
  constructor() {}

  get state(): GameData<PlayerWithHeroStats> {
    return {
      players: this.players.map((p) => ({
        ...p,
        heroStats: pointToStat(p.points),
        level: calcLvl(p.points),
      })),
    };
  }

  async getStored(): Promise<GameData<Player>> {
    const state = await loadData().catch(() => console.log("create game file"));
    return state || { players: [] };
  }

  /**
   * @todo Refact ce code pour utilise les id et non les playername
   */
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
    const stored = await this.getStored();

    const players = stored.players.map((player) => {
      const findStored = this.players.find((p) => p.id === player.id);
      return findStored ? findStored : player;
    });
    const notStored = this.players.filter((player) => {
      return !stored.players.find((p) => p.id === player.id);
    });
    return saveData({ players: [...players, ...notStored] }).catch(() => {
      console.log("error when save hero file");
    });
  }

  async addPlayer(id: string, name: string) {
    if (this.players.some((p) => p.id === id)) return;
    const stored = await this.getStored();
    const findStored = stored.players.find((p) => p.id === id);
    const newPlayer: Player = {
      id,
      name,
      points: defaultPoints,
      skin: "adventurer",
    };
    this.players.push(findStored || newPlayer);
    return this.saveGame();
  }

  async playerKill(attacker: PlayerWithHeroStats, target: PlayerWithHeroStats) {
    const attackerState = this.getPlayerState(attacker.name);
    const targetState = this.getPlayerState(target.name);
    if (!attackerState || !targetState) {
      return;
    }
    const levelDiff = attackerState.level - targetState.level;
    let winPoint = 1;
    if (levelDiff > 10) {
      return;
    }
    if (levelDiff < 0) {
      winPoint = 2;
    }
    if (levelDiff < 10) {
      winPoint = 3;
    }
    if (levelDiff < 20) {
      winPoint = 4;
    }
    if (levelDiff < 30) {
      winPoint = 5;
    }
    const rand = ArrayUtils.pickRandomOne<keyof HeroStats>([
      "dodge",
      "critic",
      "power",
      "pv",
      "regen",
      "speed",
    ]);
    await this.addPoint(attacker.name, rand, winPoint);
  }
}
