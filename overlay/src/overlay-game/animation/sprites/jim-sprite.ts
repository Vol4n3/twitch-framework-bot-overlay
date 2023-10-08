import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const jimSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 10,
    sprites: ArrayUtils.range(0, 7),
  },
  attack1: {
    delay: 10,
    sprites: ArrayUtils.range(26, 33),
  },
  attack2: {
    delay: 10,
    sprites: ArrayUtils.range(26, 33),
  },
  attack3: {
    delay: 10,
    sprites: ArrayUtils.range(26, 33),
  },
  run: {
    delay: 10,
    sprites: ArrayUtils.range(8, 11),
  },
  idle: {
    delay: 8,
    sprites: ArrayUtils.range(12, 19),
  },
  slideAndUp: {
    delay: 8,
    sprites: ArrayUtils.range(20, 25),
  },
  jump: {
    delay: 10,
    sprites: ArrayUtils.range(34, 40),
  },
  fall: {
    delay: 10,
    sprites: ArrayUtils.range(41, 44),
  },
  knockDown: {
    delay: 15,
    sprites: ArrayUtils.range(50, 56),
  },
  down: {
    delay: 6,
    sprites: ArrayUtils.range(56, 56),
  },
  hurt: {
    delay: 9,
    sprites: ArrayUtils.range(45, 59),
  },
  getUp: {
    delay: 15,
    sprites: ArrayUtils.range(57, 60),
  },
};
