import OBSWebSocket from "obs-websocket-js";
import { OBS_SOCKET_PASSWORD, OBS_SOCKET_PORT } from "../configs";

export async function ObsInit(): Promise<OBSWebSocket> {
  const obs = new OBSWebSocket();
  await obs
    .connect(`ws://127.0.0.1:${OBS_SOCKET_PORT}`, OBS_SOCKET_PASSWORD)
    .catch((err) => console.log("obs not connected", err));
  return obs;
}
