import { CommandListener } from "../listeners";
import { PlayerWithHeroStats } from "../../../shared/src/shared-game";
import { NumberUtils } from "jcv-ts-utils";

export const HeroStat: CommandListener = ({
  channel,
  command,
  user,
  args,
  chatClient,
  gameInstance,
}) => {
  if (command === "hero") {
    const name = args[0] || user;
    const player: PlayerWithHeroStats | undefined =
      gameInstance.state.players.find((p) => p.name === name);
    if (!player) return;
    chatClient.say(
      channel,
      `@${name}: lvl(${player.level})
      ❤️‍🔥${player.heroStats.pv}❤️‍🔥
      ⚔️${player.heroStats.power}⚔️
      ✨${NumberUtils.round(player.heroStats.critic * 100, 100)}%✨
      ⚡${NumberUtils.round(player.heroStats.speed * 100, 100)}%⚡
      😶‍🌫️${NumberUtils.round(player.heroStats.dodge * 100, 100)}%😶‍🌫️
`
    );
  }
};
