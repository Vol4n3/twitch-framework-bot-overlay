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
import { HeroChat } from "./message-listeners/hero-chat";
import { HeroStat } from "./message-listeners/hero-stat";
import { MediaListener } from "./message-listeners/medias";
import { TtsListener } from "./message-listeners/tts-listener";
import { HeroReward } from "./reward-listeners/heroes/hero-reward";

export const commandListeners: CommandListener[] = [
  HeroChat,
  TtsListener,
  HeroStat,
  MediaListener,
];
export const rewardListeners: RewardListener[] = [HeroReward];

export type ServerSocket = Server<
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
}) => void;
