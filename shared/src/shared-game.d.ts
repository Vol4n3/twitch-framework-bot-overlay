export interface PlayerPoints {
  pv: number;
  power: number;
  speed: number;
  dodge: number;
  critic: number;
}
export interface Player {
  id: string;
  name: string;
  points: PlayerPoints;
}
export interface GameData {
  players: Player[];
}
