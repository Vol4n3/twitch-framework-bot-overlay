import { GameData, PlayerWithHeroStats } from "./shared-game";
type soundOption = {
  fileName: string;
  times: number;
};
export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
  playSound: (data: soundOption) => void;
  playMultipleSound: (data: string[]) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
