import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const tarteyfletteSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 10,
    sprites: ArrayUtils.range(24, 30),
  },
  attack1: {
    delay: 12,
    sprites: ArrayUtils.range(31, 39),
  },
  attack2: {
    delay: 12,
    sprites: ArrayUtils.range(31, 39),
  },
  attack3: {
    delay: 12,
    sprites: ArrayUtils.range(31, 39),
  },
  run: {
    delay: 7,
    sprites: ArrayUtils.range(24, 30),
  },
  idle: {
    delay: 15,
    sprites: ArrayUtils.range(0, 23),
  },
  slideAndUp: {
    delay: 40,
    sprites: ArrayUtils.range(74, 76),
  },
  jump: {
    delay: 8,
    sprites: ArrayUtils.range(66, 72),
  },
  fall: {
    delay: 5,
    sprites: [73],
  },
  knockDown: {
    delay: 5,
    sprites: ArrayUtils.range(44, 61),
  },
  down: {
    delay: 6,
    sprites: ArrayUtils.range(62, 65),
  },
  hurt: {
    delay: 6,
    sprites: ArrayUtils.range(40, 43),
  },
  getUp: {
    delay: 4,
    sprites: ArrayUtils.range(61, 45),
  },
};
