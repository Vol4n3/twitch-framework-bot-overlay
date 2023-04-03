export type Stat = "pv" | "power" | "speed" | "dodge" | "critic" | "regen";
export type HeroStats = { [key in Stat]: number };
export type HeroSkin =
  | "adventurer"
  | "blueAdventurer"
  | "chevalier"
  | "pimouki"
  | "kikiks"
  | "tarte_y_flette"
  | "icecoptered";
export interface Player {
  id: string;
  name: string;
  points: HeroStats;
  skin: HeroSkin;
}
export interface PlayerWithHeroStats extends Player {
  heroStats: HeroStats;
  level: number;
}
export interface GameData<P extends Player> {
  players: P[];
}
