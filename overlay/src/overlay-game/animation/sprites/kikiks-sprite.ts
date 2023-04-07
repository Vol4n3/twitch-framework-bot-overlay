import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const kikiksSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 20,
    sprites: ArrayUtils.range(6, 11),
  },
  attack1: {
    delay: 6,
    sprites: ArrayUtils.range(25, 31),
  },
  attack2: {
    delay: 6,
    sprites: ArrayUtils.range(32, 38),
  },
  attack3: {
    delay: 6,
    sprites: ArrayUtils.range(25, 31),
  },
  run: {
    delay: 10,
    sprites: ArrayUtils.range(12, 17),
  },
  idle: {
    delay: 10,
    sprites: ArrayUtils.range(0, 5),
  },
  slideAndUp: {
    delay: 10,
    sprites: ArrayUtils.range(18, 21),
  },
  jump: {
    delay: 15,
    sprites: [22],
  },
  fall: {
    delay: 5,
    sprites: [23],
  },
  knockDown: {
    delay: 15,
    sprites: ArrayUtils.range(42, 49),
  },
  down: {
    delay: 5,
    sprites: [49],
  },
  hurt: {
    delay: 6,
    sprites: ArrayUtils.range(39, 41),
  },
  getUp: {
    delay: 6,
    sprites: ArrayUtils.range(49, 42),
  },
};
