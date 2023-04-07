import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const icecopteredSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 15,
    sprites: ArrayUtils.range(8, 14),
  },
  attack1: {
    delay: 6,
    sprites: ArrayUtils.range(15, 19),
  },
  attack2: {
    delay: 6,
    sprites: ArrayUtils.range(20, 29),
  },
  attack3: {
    delay: 6,
    sprites: ArrayUtils.range(15, 19),
  },
  run: {
    delay: 8,
    sprites: ArrayUtils.range(8, 14),
  },
  idle: {
    delay: 10,
    sprites: ArrayUtils.range(0, 7),
  },
  slideAndUp: {
    delay: 10,
    sprites: ArrayUtils.range(30, 38),
  },
  jump: {
    delay: 15,
    sprites: ArrayUtils.range(8, 14),
  },
  fall: {
    delay: 5,
    sprites: ArrayUtils.range(0, 7),
  },
  knockDown: {
    delay: 15,
    sprites: ArrayUtils.range(39, 42),
  },
  down: {
    delay: 5,
    sprites: ArrayUtils.range(43, 47),
  },
  hurt: {
    delay: 6,
    sprites: ArrayUtils.range(40, 41),
  },
  getUp: {
    delay: 6,
    sprites: ArrayUtils.range(0, 7),
  },
};
