import { GameData, PlayerWithHeroStats } from "./shared-game";
type soundOption = {
  fileName: string;
  times: number;
};
export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
  playSound: (data: soundOption) => void;
  playMultipleSound: (data: string[]) => void;

  chatMessage: (data: { message: string; user: string }) => void;
}

export interface ClientToServerEvents {
  playerAttack: (data: {
    attacker: PlayerWithHeroStats;
    target: PlayerWithHeroStats;
  }) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
