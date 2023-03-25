import { GameData, PlayerWithHeroStats } from "./shared-game";
type mediaOption = {
  fileName: string;
  times: number;
};
export type MediasType = "sounds" | "videos";
export type MediasChoice = { type: MediasType; fileName: string };
export type JumpDirection = "right" | "left";
type ClipInfo = { id: string; duration };
export interface ServerToClientEvents {
  gameState: (data: GameData<PlayerWithHeroStats>) => void;
  playSound: (data: mediaOption) => void;
  playMultipleSound: (data: MediasChoice[]) => void;
  playVideo: (data: mediaOption) => void;
  showCarroue: (data: boolean) => void;
  launchCarroue: (data: boolean) => void;
  chatMessage: (data: { message: string; userId: string }) => void;
  heroJump: (data: {
    direction: JumpDirection | undefined;
    userId: string;
  }) => void;
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
