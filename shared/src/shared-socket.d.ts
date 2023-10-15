import { PlayerWithHeroStats } from "./shared-game";
type mediaOption = {
  fileName: string;
  times: number;
};
export type MediasType = "sounds" | "videos";
export type MediasChoice = { type: MediasType; fileName: string };
type ClipInfo = { id: string; duration };
export interface ServerToClientEvents {
  playSound: (data: mediaOption) => void;
  playMultipleSound: (data: MediasChoice[]) => void;
  playVideo: (data: mediaOption) => void;
  playSecret: (data: mediaOption) => void;
  playClip: (data: ClipInfo) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
