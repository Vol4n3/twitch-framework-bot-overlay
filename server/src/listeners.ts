import { ChatClient, PrivateMessage } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/src/shared-socket";
import { HeroGame } from "./game/hero-game";
import { ChatMessage } from "./commands/chat-message";
import { HeroStat } from "./commands/hero-stat";
import { SoundListener } from "./commands/sound";
import { TTSCommand } from "./commands/highlight-tts/tts-command";
import { HeroReward } from "./rewards/heroes/hero-reward";

export const commandListeners: CommandListener[] = [
  TTSCommand,
  HeroStat,
  SoundListener,
  ChatMessage,
];
export const rewardListeners: RewardListener[] = [HeroReward];

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
  clientSockets: ClientSocket[];
  gameInstance: HeroGame;
}) => void;

export type RewardListener = (data: {
  channel: string;
  rewardTitle: string;
  user: string;
  userId: string;
  message: string | undefined;
  gameInstance: HeroGame;
  chatClient: ChatClient;
  apiClient: ApiClient;
  clientSockets: ClientSocket[];
}) => void;
