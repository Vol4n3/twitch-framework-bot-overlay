import { RewardListener } from "../listeners";
import { setCarroueHolder } from "../carroue-holder";

export const CarroueReward: RewardListener = async function ({
  rewardId,
  socket,
  user,
}) {
  if (rewardId === "e45f6a0b-1feb-4d86-9064-6e695ee8e1c8") {
    socket.emit("playVideo", {
      fileName: `tourne.mp4`,
      times: 1,
    });
    socket.emit("showCarroue", true);
    setCarroueHolder(user, false);
  }
};
