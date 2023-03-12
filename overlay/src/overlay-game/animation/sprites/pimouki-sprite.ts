import { SpritesAnimation } from "./sprite-animation";
import { rangeArray } from "../range";

export const pimoukiSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 20,
    sprites: rangeArray(6, 12),
  },
  attack1: {
    delay: 6,
    sprites: rangeArray(46, 52),
  },
  attack2: {
    delay: 6,
    sprites: rangeArray(41, 45),
  },
  attack3: {
    delay: 6,
    sprites: rangeArray(26, 30),
  },
  run: {
    delay: 10,
    sprites: rangeArray(18, 21),
  },
  idle: {
    delay: 10,
    sprites: rangeArray(0, 5),
  },
  slideAndUp: {
    delay: 10,
    sprites: rangeArray(53, 54),
  },
  jump: {
    delay: 15,
    sprites: rangeArray(22, 23),
  },
  fall: {
    delay: 5,
    sprites: rangeArray(24, 25),
  },
  knockDown: {
    delay: 15,
    sprites: rangeArray(59, 65),
  },
  down: {
    delay: 5,
    sprites: [65],
  },
  hurt: {
    delay: 6,
    sprites: rangeArray(55, 58),
  },
  getUp: {
    delay: 6,
    sprites: [65, 64, 63, 62, 61, 60, 59],
  },
};
