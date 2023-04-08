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
import { HeroCommands } from "./command-listeners/hero-commands";

import { MediaCommands } from "./command-listeners/medias-commands";
import { TtsCommands } from "./command-listeners/tts-commands";
import { HeroReward } from "./reward-listeners/hero-reward";
import OBSWebSocket from "obs-websocket-js";
import { CarroueReward } from "./reward-listeners/carroue-reward";
import { CarroueCommands } from "./command-listeners/carroue-commands";
import { SpotifyInstance } from "./spotify/spotify-types";
import { SpotifyCommands } from "./command-listeners/spotify-commands";
import { HelpCommands } from "./command-listeners/help-commands";
import { BattleRoyalCommand } from "./command-listeners/battle-royal-command";
import { MinecraftCommand } from "./command-listeners/minecraft-command";

export const commandListeners: CommandListener[] = [
  HelpCommands,
  HeroCommands,
  MinecraftCommand,
  TtsCommands,
  MediaCommands,
  CarroueCommands,
  SpotifyCommands,
  BattleRoyalCommand,
];
export const rewardListeners: RewardListener[] = [HeroReward, CarroueReward];

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
  spotify: SpotifyInstance;
  messageCount: number;
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
  spotify: SpotifyInstance;
}) => Promise<void | boolean>;
