import { ChatClient, PrivateMessage } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/src/shared-socket";
import { HeroGame } from "./game/hero-game";
import { HeroChat } from "./command-listeners/hero-chat";
import { HeroStat } from "./command-listeners/hero-stat";
import { MediaListener } from "./command-listeners/medias";
import { TtsListener } from "./command-listeners/tts-listener";
import { HeroReward } from "./reward-listeners/heroes/hero-reward";
import OBSWebSocket from "obs-websocket-js";
import { CarroueRewardListener } from "./reward-listeners/carroue-reward-listener";
import { CarroueListener } from "./command-listeners/carroue-listener";

export const commandListeners: CommandListener[] = [
  HeroChat,
  TtsListener,
  HeroStat,
  MediaListener,
  CarroueListener,
];
export const rewardListeners: RewardListener[] = [
  HeroReward,
  CarroueRewardListener,
];

export type ServerSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type ClientSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type CommandListener = (data: {
  channel: string;
  rawText: string;
  parsedText: string;
  user: string;
  command: string;
  userId: string;
  meta: PrivateMessage;
  args: string[];
  chatClient: ChatClient;
  apiClient: ApiClient;
  gameInstance: HeroGame;
  socket: ServerSocket;
  obs: OBSWebSocket;
}) => Promise<void | boolean>;

export type RewardListener = (data: {
  channel: string;
  rewardTitle: string;
  user: string;
  userId: string;
  message: string | undefined;
  gameInstance: HeroGame;
  chatClient: ChatClient;
  apiClient: ApiClient;
  socket: ServerSocket;
  obs: OBSWebSocket;
}) => void;
