import { RewardListener } from "../listeners";

export const SkipRewardCommands: RewardListener = async ({
    channel,
    rewardTitle,
    rewardId,
    user,
    userId,
    message,
    chatBotClient, 
    chatBroadcasterClient, 
    apiClient,
    apiBotClient,
    socket,
    obs,
    spotify,
  }) => {
    if(rewardId !== "778a5a3a-1003-4036-90a1-3e8ad42febb4"){
        return false;
    }
    await spotify.skipPlayer().catch(() => {
      chatBotClient.say(channel, "La troubadour que je suis a cassée une corde a son lute");
    });

    return true;
};
