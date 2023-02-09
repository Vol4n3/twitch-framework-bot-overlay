import { GameData } from "./shared-game";
export interface ServerToClientEvents {
    gameState: (data: GameData) => void;
}
export interface ClientToServerEvents {
}
export interface InterServerEvents {
}
export interface SocketData {
}
