import { ChatClient, PrivateMessage } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/src/shared-socket";
import { HighLightTTS } from "./messages/highlight-tts/highlight-tts";
import { Game } from "./game/game";
import { JoinGame } from "./messages/join-game/join-game";
import { TTSCommand } from "./commands/tts";

export const messageListeners: MessageListener[] = [HighLightTTS, JoinGame];
export const commandListeners: CommandListener[] = [TTSCommand];
export const rewardListeners: RewardListener[] = [];

export type ClientSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type MessageListener = (data: {
  user: string;
  rawText: string;
  meta: PrivateMessage;
  userId: string;
  parsedText: string;
  chatClient: ChatClient;
  apiClient: ApiClient;
  clientSockets: ClientSocket[];
  gameInstance: Game;
}) => void;

export type CommandListener = (data: {
  user: string;
  command: string;
  userId: string;
  meta: PrivateMessage;
  args: string[];
  chatClient: ChatClient;
  apiClient: ApiClient;
  clientSockets: ClientSocket[];
  gameInstance: Game;
}) => void;

export type RewardListener = (data: {
  title: string;
  user: string;
  userId: string;
  message: string | undefined;
  gameInstance: Game;
}) => void;
