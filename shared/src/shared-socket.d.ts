import { GameData, PlayerWithHeroStats } from "./shared-game";

export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
