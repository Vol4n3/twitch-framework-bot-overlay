import { RewardListener } from "../listeners";

export const SpotifyRewardCommands: RewardListener = async ({
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
    if(rewardId !== "6ccd6826-ebbf-4813-8076-0370c0115d88"){
        return false;
    }

    try {
        const response = await spotify.addQueue(message!);
        chatBotClient.say(
            channel,
            `Je vais jouer la troubadour :  ${response.artists[0].name} - ${response.name}`
        );
    }catch(e){
        chatBotClient.say(
            channel,
            "La troubadour que je suis ne a cassée une corde a son lute"
        );
        console.warn(e);
    } finally{
        return true;
    }
};
