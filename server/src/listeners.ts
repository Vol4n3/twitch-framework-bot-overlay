import { ChatClient, PrivateMessage } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/src/shared-socket";

import { MediaCommands } from "./command-listeners/medias-commands";
import { TtsCommands } from "./command-listeners/tts-commands";
import OBSWebSocket from "obs-websocket-js";
import { SpotifyInstance } from "./spotify/spotify-types";
import { SpotifyCommands } from "./command-listeners/spotify-commands";
import { HelpCommands } from "./command-listeners/help-commands";

export const commandListeners: CommandListener[] = [
  HelpCommands,
  TtsCommands,
  MediaCommands,
  SpotifyCommands,
];
export const rewardListeners: RewardListener[] = [];

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
  chatBotClient: ChatClient;
  chatBroadcasterClient: ChatClient;
  apiClient: ApiClient;
  apiBotClient: ApiClient;
  socket: ServerSocket;
  obs: OBSWebSocket;
  spotify: SpotifyInstance;
  messageCount: number;
}) => Promise<void | any | boolean>;

export type RewardListener = (data: {
  channel: string;
  rewardTitle: string;
  rewardId: string;
  user: string;
  userId: string;
  message: string | undefined;
  chatBotClient: ChatClient;
  chatBroadcasterClient: ChatClient;
  apiClient: ApiClient;
  apiBotClient: ApiClient;
  socket: ServerSocket;
  obs: OBSWebSocket;
  spotify: SpotifyInstance;
}) => Promise<void | any | boolean>;
