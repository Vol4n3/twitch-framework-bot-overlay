import { RewardListener } from "../listeners";
import { HeroStats } from "../../../shared/src/shared-game";

export const HeroReward: RewardListener = async ({
  rewardId,
  user,
  userId,
  gameInstance,
  chatClient,
  channel,
  socket,
}) => {
  await gameInstance.addPlayer(userId, user);
  let message = "";
  const getPoint = (key: keyof HeroStats): { point: number; stat: number } => {
    const p = gameInstance.getPlayerStateById(userId);
    if (!p) {
      return { stat: 0, point: 0 };
    }
    return { point: p.points[key], stat: p.heroStats[key] };
  };
  switch (rewardId) {
    case "1537f340-9eeb-4908-aa7c-7ac9505ed1f7": {
      await gameInstance.addPointById(userId, "pv", 5);
      const { stat, point } = getPoint("pv");
      message = `@${user} à mis 5 point de vie. total: ${point} soit ${stat}❤️‍🔥`;
      break;
    }
    case "644c82f5-f80f-479a-a97d-2224a6004201": {
      await gameInstance.addPointById(userId, "dodge", 5);
      const { stat, point } = getPoint("dodge");
      message = `@${user} à mis 5 point en esquive. total: ${point} soit ${stat}%😶‍🌫️`;
      break;
    }
    case "a103b9bc-daeb-4435-9019-6e4582a02746": {
      await gameInstance.addPointById(userId, "regen", 5);
      const { stat, point } = getPoint("regen");
      message = `@${user} à mis 5 point en régénération. total: ${point} soit ${stat}🍯`;
      break;
    }
    case "c18f3455-bfeb-4944-ac9a-4bcba0893c8c": {
      const { stat, point } = getPoint("speed");
      await gameInstance.addPointById(userId, "speed", 5);
      message = `@${user} à mis 5 point en vitesse. total: ${point} soit ${stat}%⚡`;
      break;
    }
    case "c7cec6bc-2760-4c96-8a96-d6d9cf96143e": {
      await gameInstance.addPointById(userId, "critic", 5);
      const { stat, point } = getPoint("critic");
      message = `@${user} à mis 5 point en coup critique. total: ${point} soit ${stat}%✨️`;
      break;
    }
    case "f07cc62b-1f52-4066-96de-94170ef09889": {
      await gameInstance.addPointById(userId, "power", 5);
      const { stat, point } = getPoint("power");
      message = `@${user} à mis 5 point en puissance. total: ${point} soit ${stat}⚔️`;
      break;
    }
  }

  if (message) {
    socket.emit("gameState", gameInstance.getState());
    socket.emit("playSound", { fileName: "level.mp3", times: 1 });
    await chatClient.say(channel, message);
  }
};
