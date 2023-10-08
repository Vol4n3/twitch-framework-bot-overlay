import { RewardListener } from "../listeners";

const resolveAfter = async (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
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
const blackListBlocks = ["lava", "flowing_lava"];
// changement de main d'item
// desactivé la régén passif
// mettre un délai sur doom
export const MinecraftReward: RewardListener = async ({
  rewardId,
  rewardTitle,
  message,
  socket,
}) => {
  const args = (message || "").toLowerCase().split(" ");
  console.log(rewardTitle, rewardId, args);
  const firstArg = args[0]?.toLowerCase() || "";
  switch (rewardId) {
    case "4c7c9696-ad9a-4ddb-a3e5-0d6262f5f358": {
      socket.emit("playSound", {
        fileName: "teleport.mp3",
        times: 1,
      });
      return sendCommand(
        `execute as ${player} at @s run spreadplayers ~ ~ 60 60 under 255 false @s`
      );
    }
    case "9282c40b-9b16-4187-8e2c-fa46b9459058": {
      [
        "#minecraft:iron_ores",
        "#minecraft:gold_ores",
        "#minecraft:diamond_ores",
        "#minecraft:emerald_ores",
        "#minecraft:copper_ores",
        "#minecraft:lapis_ores",
        "#minecraft:coal_ores",
      ].forEach((item) => {
        sendCommand(
          `execute at ${player} run fill ~-6 ~-6 ~-6 ~6 ~6 ~6 minecraft:gravel replace ${item}`
        );
      });
      break;
    }
    case "5ab7dafb-e72d-4cb1-841f-485a1736c7cf": {
      return sendCommand(`weather clear`);
    }
    case "44fd2149-ebb6-44d2-b963-d22636997687": {
      await sendCommand(
        `execute at ${player} run fill ~ ~ ~ ~ ~5 ~ minecraft:air replace`
      );
      return sendCommand(
        `execute at ${player} run setblock ~ ~5 ~ anvil replace`
      );
    }
    case "705ec40e-4aea-4a07-9a78-88ed876a9ede":
      setTimeout(async () => {
        await sendCommand(`tag ${player} remove vampire`);
      }, 2 * 60 * 1000);
      return sendCommand(`tag ${player} add vampire`);
    case "b716dbc6-9c5a-4b40-a523-8f07138f815a":
    case "c92df5a9-034f-46b7-9c2a-064628d7a4da":
      const nTnt = 100;
      for (let i = 0; i < nTnt; i++) {
        const angle = (i * Math.PI * 2) / nTnt;
        const length = 10;
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;
        await resolveAfter(100);
        await sendCommand(
          rewardId === "c92df5a9-034f-46b7-9c2a-064628d7a4da"
            ? `execute at ${player} run summon minecraft:tnt ^${x} ^5 ^${y} {Fuse:70}`
            : `execute at ${player} run summon minecraft:fireball ^${x} ^10 ^${y} {Motion:[0.0,-5.0,0.0],ExplosionPower:8}`
        );
      }
      break;
    case "7b5eb3ff-19a9-4f5f-8893-9fb0a4ac8d06":
      await sendCommand(
        `effect give @a[name=${player},tag=!vampire] minecraft:instant_health 1 1`
      );
      await sendCommand(
        `effect give @a[name=${player},tag=vampire] minecraft:instant_damage 1 1`
      );
      break;
    case "cf616a69-be54-4059-b115-e93ae942709b": {
      const block = firstArg?.replace("minecraft:", "");
      if (!block || blackListBlocks.indexOf(block) >= 0)
        return sendCommand(
          `execute at ${player} run summon minecraft:creeper ^ ^ ^-5`
        );
      return sendCommand(
        `execute at ${player} positioned ~ ~ ~ run setblock ~ ~ ~ minecraft:${args[0]}`
      );
    }
    case "060ce958-8bf9-455d-87f0-abd518967c0e":
      let pitch = parseFloat(args[1]) || 1;
      pitch = pitch > 2 ? 2 : pitch < 0 ? 0 : pitch;
      const sound = firstArg || "entity.creeper.primed";
      return sendCommand(
        `execute at ${player} run playsound minecraft:${sound.replace(
          "minecraft:",
          ""
        )} player ${player} ~ ~ ~ 10 ${pitch}`
      );
    case "0bf53a05-2c84-43d9-819a-eb2b4f555d00":
      let pow = parseInt(args[2], 10) || 1;
      pow -= 1;
      pow = pow > 2 ? 2 : pow < 0 ? 0 : pow;
      let sec = parseInt(args[1], 10) || 30;
      sec = sec > 30 ? 30 : sec < 5 ? 5 : sec;
      const effect = firstArg?.replace("minecraft:", "") || "nausea";
      return sendCommand(
        `effect give ${player} minecraft:${effect} ${sec} ${pow}`
      );
    case "688f98f4-1318-44e9-8fa4-7295733c1ce8":
      return sendCommand(
        `execute at ${player} run summon minecraft:fireball ^ ^2 ^2 {ExplosionPower:3}`
      );
    case "1e377185-0f36-4eb7-91f9-1f09914eec4b":
      return sendCommand(
        `execute at ${player} run summon minecraft:lightning_bolt`
      );
    case "634a1d8b-4cd4-4714-b792-0c61ed4d1dce": {
      const block = firstArg.replace("minecraft:", "") || "stone";
      let count = parseInt(args[1], 10) || 1;
      count = count > 64 ? 64 : count < 1 ? 1 : count;
      return sendCommand(`give ${player} minecraft:${block} ${count}`);
    }
    case "b97dad75-8826-410f-a88e-6d9b3d8a89a4":
      socket.emit("playSound", {
        fileName: "jour.mp3",
        times: 1,
      });
      return sendCommand(`time set day`);
    case "f2a3edad-05c7-4b0c-9c7f-232eb5fef2ed":
      socket.emit("playSound", {
        fileName: "nuit.mp3",
        times: 1,
      });
      return sendCommand(`time set night`);
    case "481378b4-2fc6-41e8-b534-5028f4a3f8a0":
      return sendCommand(`execute as ${player} run clear`);
    case "6e474cd1-64b3-48d4-8c3b-328730c8b83c":
      const summon = firstArg.replace("minecraft:", "");
      if (!summon || blackListSummons.indexOf(summon) >= 0)
        return sendCommand(
          `execute at ${player} run summon minecraft:creeper ^ ^ ^-5`
        );
      return sendCommand(
        `execute at ${player} run summon minecraft:${summon} ^ ^ ^-5`
      );
  }
};
