import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const andrewSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 10,
    sprites: ArrayUtils.range(16, 31),
  },
  attack1: {
    delay: 5,
    sprites: ArrayUtils.range(58, 68),
  },
  attack2: {
    delay: 5,
    sprites: ArrayUtils.range(58, 68),
  },
  attack3: {
    delay: 5,
    sprites: ArrayUtils.range(58, 68),
  },
  run: {
    delay: 7,
    sprites: ArrayUtils.range(32, 39),
  },
  idle: {
    delay: 8,
    sprites: ArrayUtils.range(0, 15),
  },
  slideAndUp: {
    delay: 6,
    sprites: ArrayUtils.range(49, 57),
  },
  jump: {
    delay: 10,
    sprites: ArrayUtils.range(40, 45),
  },
  fall: {
    delay: 5,
    sprites: ArrayUtils.range(46, 48),
  },
  knockDown: {
    delay: 20,
    sprites: ArrayUtils.range(74, 77),
  },
  down: {
    delay: 6,
    sprites: ArrayUtils.range(78, 78),
  },
  hurt: {
    delay: 6,
    sprites: ArrayUtils.range(69, 73),
  },
  getUp: {
    delay: 4,
    sprites: ArrayUtils.range(79, 79),
  },
};
