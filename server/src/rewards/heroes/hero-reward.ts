import { RewardListener } from "../../listeners";
import { HeroStats } from "../../../../shared/src/shared-game";

export const HeroReward: RewardListener = async ({
  rewardTitle,
  user,
  userId,
  gameInstance,
  chatClient,
  channel,
  clientSockets,
}) => {
  await gameInstance.addPlayer(userId, user);
  console.log(rewardTitle);
  let message = "";

  const getPoint = (key: keyof HeroStats): { point: number; stat: number } => {
    const p = gameInstance.getPlayerState(user);
    if (!p) {
      return { stat: 0, point: 0 };
    }
    return { point: p.points[key], stat: p.heroStats[key] };
  };
  switch (rewardTitle) {
    case "Héro santé": {
      await gameInstance.addPoint(user, "pv", 1);
      const { stat, point } = getPoint("pv");
      message = `@${user} à mis un point de vie. total: ${point} soit ${stat}❤️‍🔥`;
      break;
    }
    case "Héro esquive": {
      await gameInstance.addPoint(user, "dodge", 1);
      const { stat, point } = getPoint("dodge");
      message = `@${user} à mis un point en esquive. total: ${point} soit ${stat}%😶‍🌫️`;
      break;
    }
    case "Héro régen": {
      await gameInstance.addPoint(user, "regen", 1);
      const { stat, point } = getPoint("regen");
      message = `@${user} à mis un point en régénération. total: ${point} soit ${stat}🍯`;
      break;
    }
    case "Héro vitesse": {
      const { stat, point } = getPoint("speed");
      await gameInstance.addPoint(user, "speed", 1);
      message = `@${user} à mis un point en vitesse. total: ${point} soit ${stat}%⚡`;
      break;
    }
    case "Héro critic": {
      await gameInstance.addPoint(user, "critic", 1);
      const { stat, point } = getPoint("critic");
      message = `@${user} à mis un point en coup critique. total: ${point} soit ${stat}%✨️`;
      break;
    }
    case "Héro puissance": {
      await gameInstance.addPoint(user, "power", 1);
      const { stat, point } = getPoint("power");
      message = `@${user} à mis un point en puissance. total: ${point} soit ${stat}⚔️`;
      break;
    }
  }
  clientSockets.forEach((socket) =>
    socket.emit("gameState", gameInstance.state)
  );
  if (message) {
    chatClient.say("#vol4n3", message);
  }
};
