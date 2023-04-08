import { CommandListener } from "../listeners";
const makeFormBody = (obj: { [key: string]: string }) => {
  const formBody = Object.keys(obj).map((key: string) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(obj[key]);
    return encodedKey + "=" + encodedValue;
  });
  return formBody.join("&");
};
async function sendCommand(cmd: string) {
  return fetch("http://localhost:55555", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: makeFormBody({ cmd }),
  });
}
const player = "Vol4n3";
const blackListSummons = ["ender_dragon", "wither", "elder_guardian", "warden"];
const delay: { [key in string]: Date } = {};
function getSummons(find: string) {}
export const MinecraftCommand: CommandListener = async ({
  command,
  args,
  user,
  channel,
  chatClient,
}) => {
  const oneMinute = new Date();
  oneMinute.setMinutes(oneMinute.getMinutes() + 1);
  switch (command) {
    case "vampire":
      await sendCommand(`tag ${player} add vampire`);
      break;
    case "steeve":
      await sendCommand(`tag ${player} remove vampire`);
      break;
    case "doom":
    case "nuke":
      let nTnt = parseInt(args[0], 10) || 20;
      nTnt = nTnt > 60 ? 60 : nTnt < 1 ? 1 : nTnt;
      for (let i = 0; i < nTnt; i++) {
        const angle = (i * Math.PI * 2) / nTnt;
        const length = 10;
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;
        await sendCommand(
          command === "nuke"
            ? `execute at ${player} run summon minecraft:tnt ^${x} ^5 ^${y} {Fuse:100}`
            : `execute at ${player} run summon minecraft:fireball ^${x} ^10 ^${y} {Motion:[0.0,-5.0,0.0],ExplosionPower:5}`
        );
      }
      break;
    case "heal":
      await sendCommand(`effect give ${player} minecraft:instant_health 0 30`);
      break;
    case "block":
      await sendCommand(
        `execute at ${player} positioned ~ ~ ~ run setblock ~ ~ ~ minecraft:${args[0]}`
      );
      break;
    case "effect":
      let pow = parseInt(args[2], 10) || 0;
      pow = pow > 5 ? 5 : pow < 0 ? 0 : pow;
      let sec = parseInt(args[1], 10) || 30;
      sec = sec > 30 ? 30 : sec < 5 ? 5 : sec;
      await sendCommand(
        `effect give ${player} minecraft:${args[0]} ${sec} ${pow}`
      );
      break;
    case "fireball":
      await sendCommand(
        `execute at ${player} run summon minecraft:fireball ^ ^1 ^2 {ExplosionPower:3}`
      );
      break;
    case "thunder":
      await sendCommand(
        `execute at ${player} run summon minecraft:lightning_bolt`
      );
      break;
    case "jour":
    case "day":
      await sendCommand(`time set day`);
      break;
    case "nuit":
    case "night":
      await sendCommand(`time set night`);
      break;
    case "clear":
      await sendCommand(`execute as ${player} run clear`);
      break;
    case "summon":
      if (!args[0]) return;
      if (blackListSummons.indexOf(args[0]) > 0)
        return chatClient.say(channel, "cette créature n'est pas autorisé");
      await sendCommand(
        `execute at ${player} run summon minecraft:${args[0]} ^ ^ ^-5`
      );

      break;
  }
  delay[command] = new Date();
};
