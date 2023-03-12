import { GameData, PlayerWithHeroStats } from "./shared-game";
type soundOption = {
  fileName: string;
  times: number;
};
export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
  playSound: (data: soundOption) => void;
  playMultipleSound: (data: string[]) => void;
  playVideo: (data: string) => void;
  showCarroue: (data: boolean) => void;
  launchCarroue: () => void;
  chatMessage: (data: { message: string; user: string }) => void;
}

export interface ClientToServerEvents {
  playerKill: (data: {
    attacker: PlayerWithHeroStats;
    target: PlayerWithHeroStats;
  }) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
