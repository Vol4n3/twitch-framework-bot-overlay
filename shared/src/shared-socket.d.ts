import { GameData, PlayerWithHeroStats } from "./shared-game";
type mediaOption = {
  fileName: string;
  times: number;
};
type ClipInfo = { id: string; duration };
export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
  playSound: (data: mediaOption) => void;
  playMultipleSound: (data: string[]) => void;
  playVideo: (data: mediaOption) => void;
  showCarroue: (data: boolean) => void;
  launchCarroue: () => void;
  chatMessage: (data: { message: string; user: string }) => void;
  playClip: (data: ClipInfo) => void;
  battleRoyal: (data: GameData<PlayerWithHeroStats>) => void;
}

export interface ClientToServerEvents {
  playerKill: (data: {
    attacker: PlayerWithHeroStats;
    target: PlayerWithHeroStats;
  }) => void;
  brEnd: (data: { winner: PlayerWithHeroStats | undefined }) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
