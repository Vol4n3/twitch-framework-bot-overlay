import { RewardListener } from "../listeners";
import { setCarroueHolder } from "../carroue-holder";

export const CarroueRewardListener: RewardListener = async function ({
  rewardTitle,
  socket,
  user,
}) {
  if (rewardTitle === "Lance la carroue") {
    socket.emit("showCarroue", true);
    setCarroueHolder(user, false);
  }
};
