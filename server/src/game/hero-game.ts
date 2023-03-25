import { promises as fs } from "fs";
import {
  GameData,
  HeroStats,
  Player,
  PlayerWithHeroStats,
  Stat,
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
    critic: NumberUtils.round(scaleHyperTangent(critic, 1000, 70, 1), 100),
    dodge: NumberUtils.round(scaleHyperTangent(dodge, 1000, 70, 1), 100),
    power: NumberUtils.round(scaleHyperTangent(power, 1000, 100, 2), 1),
    pv: NumberUtils.round(scaleHyperTangent(pv, 1000, 200, 10), 1),
    regen: NumberUtils.round(scaleHyperTangent(regen, 1000, 20, 1), 1),
    speed: NumberUtils.round(scaleHyperTangent(speed, 1000, 200, 0), 1),
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

  getState(
    filter: (player: Player) => boolean = () => true,
    whitNoPoint: boolean = false
  ): GameData<PlayerWithHeroStats> {
    return {
      players: this.players.filter(filter).map((p) => ({
        ...p,
        heroStats: pointToStat(
          whitNoPoint
            ? {
                pv: 100,
                power: 20,
                speed: 400,
                dodge: 200,
                regen: 10,
                critic: 200,
              }
            : p.points
        ),
        level: calcLvl(p.points),
      })),
    };
  }

  async getStored(): Promise<GameData<Player>> {
    const state = await loadData().catch(() => console.log("create game file"));
    return state || { players: [] };
  }
  async addPointByName(playerName: string, which: Stat, amount: number) {
    this.players = this.players.map((player) => {
      if (player.name !== playerName) return player;
      console.log(`add ${amount} to ${which} of ${playerName} heroes`);
      return {
        ...player,
        points: { ...player.points, [which]: player.points[which] + amount },
      };
    });
    return this.saveGame();
  }
  async addPointById(playerId: string, which: Stat, amount: number) {
    this.players = this.players.map((player) => {
      if (player.id !== playerId) return player;
      console.log(`add ${amount} to ${which} of ${playerId} heroes`);
      return {
        ...player,
        points: { ...player.points, [which]: player.points[which] + amount },
      };
    });
    return this.saveGame();
  }

  getPlayerStateByName(playerName: string): PlayerWithHeroStats | undefined {
    return this.getState().players.find((p) => p.name === playerName);
  }
  getPlayerStateById(playerId: string): PlayerWithHeroStats | undefined {
    return this.getState().players.find((p) => p.id === playerId);
  }

  playerStateToString(playerName: string): string {
    const player: PlayerWithHeroStats | undefined =
      this.getPlayerStateByName(playerName);
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

  async playerKill(
    attacker: PlayerWithHeroStats,
    target: PlayerWithHeroStats
  ): Promise<undefined | { point: number; stat: keyof HeroStats }> {
    const attackerState = this.getPlayerStateById(attacker.id);
    const targetState = this.getPlayerStateById(target.id);
    if (!attackerState || !targetState) {
      return;
    }
    const levelDiff = attackerState.level - targetState.level;
    let winPoint = 1;
    if (levelDiff > 10) {
      return;
    } else if (levelDiff > 0) {
      winPoint = 1;
    } else if (levelDiff > -10 && levelDiff <= 0) {
      winPoint = 2;
    } else if (levelDiff > -20 && levelDiff <= -10) {
      winPoint = 3;
    } else if (levelDiff > -30 && levelDiff <= -20) {
      winPoint = 4;
    } else if (levelDiff > -40 && levelDiff <= -30) {
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
    await this.addPointById(attacker.id, rand, winPoint);
    return { point: winPoint, stat: rand };
  }
}
