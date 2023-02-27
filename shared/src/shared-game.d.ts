export interface HeroStats {
  pv: number;
  power: number;
  speed: number;
  dodge: number;
  critic: number;
  regen: number;
}
export interface Player {
  id: string;
  name: string;
  points: HeroStats;
}
export interface PlayerWithHeroStats extends Player {
  heroStats: HeroStats;
  level: number;
}
export interface GameData<P extends Player> {
  players: P[];
}
