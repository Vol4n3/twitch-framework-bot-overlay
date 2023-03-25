import { RewardListener } from "../listeners";
import { HeroStats } from "../../../shared/src/shared-game";

export const HeroReward: RewardListener = async ({
  rewardTitle,
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
  switch (rewardTitle) {
    case "Héro santé": {
      await gameInstance.addPointById(userId, "pv", 5);
      const { stat, point } = getPoint("pv");
      message = `@${user} à mis 5 point de vie. total: ${point} soit ${stat}❤️‍🔥`;
      break;
    }
    case "Héro esquive": {
      await gameInstance.addPointById(userId, "dodge", 5);
      const { stat, point } = getPoint("dodge");
      message = `@${user} à mis 5 point en esquive. total: ${point} soit ${stat}%😶‍🌫️`;
      break;
    }
    case "Héro régen": {
      await gameInstance.addPointById(userId, "regen", 5);
      const { stat, point } = getPoint("regen");
      message = `@${user} à mis 5 point en régénération. total: ${point} soit ${stat}🍯`;
      break;
    }
    case "Héro vitesse": {
      const { stat, point } = getPoint("speed");
      await gameInstance.addPointById(userId, "speed", 5);
      message = `@${user} à mis 5 point en vitesse. total: ${point} soit ${stat}%⚡`;
      break;
    }
    case "Héro critic": {
      await gameInstance.addPointById(userId, "critic", 5);
      const { stat, point } = getPoint("critic");
      message = `@${user} à mis 5 point en coup critique. total: ${point} soit ${stat}%✨️`;
      break;
    }
    case "Héro puissance": {
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
