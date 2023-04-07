import { SpritesAnimation } from "./sprite-animation";
import { ArrayUtils } from "jcv-ts-utils";

export const pimoukiSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 20,
    sprites: ArrayUtils.range(6, 12),
  },
  attack1: {
    delay: 6,
    sprites: ArrayUtils.range(46, 52),
  },
  attack2: {
    delay: 6,
    sprites: ArrayUtils.range(41, 45),
  },
  attack3: {
    delay: 6,
    sprites: ArrayUtils.range(26, 30),
  },
  run: {
    delay: 10,
    sprites: ArrayUtils.range(18, 21),
  },
  idle: {
    delay: 10,
    sprites: ArrayUtils.range(0, 5),
  },
  slideAndUp: {
    delay: 10,
    sprites: ArrayUtils.range(53, 54),
  },
  jump: {
    delay: 15,
    sprites: ArrayUtils.range(22, 23),
  },
  fall: {
    delay: 5,
    sprites: ArrayUtils.range(24, 25),
  },
  knockDown: {
    delay: 15,
    sprites: ArrayUtils.range(59, 65),
  },
  down: {
    delay: 5,
    sprites: [65],
  },
  hurt: {
    delay: 6,
    sprites: ArrayUtils.range(55, 58),
  },
  getUp: {
    delay: 6,
    sprites: ArrayUtils.range(65, 59),
  },
};
