import { SpritesAnimation } from "./sprite-animation";
import { rangeArray } from "../range";

export const andrewSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 10,
    sprites: rangeArray(16, 31),
  },
  attack1: {
    delay: 5,
    sprites: rangeArray(58, 68),
  },
  attack2: {
    delay: 5,
    sprites: rangeArray(58, 68),
  },
  attack3: {
    delay: 5,
    sprites: rangeArray(58, 68),
  },
  run: {
    delay: 7,
    sprites: rangeArray(32, 39),
  },
  idle: {
    delay: 8,
    sprites: rangeArray(0, 15),
  },
  slideAndUp: {
    delay: 6,
    sprites: rangeArray(49, 57),
  },
  jump: {
    delay: 10,
    sprites: rangeArray(40, 45),
  },
  fall: {
    delay: 5,
    sprites: rangeArray(46, 48),
  },
  knockDown: {
    delay: 20,
    sprites: rangeArray(74, 77),
  },
  down: {
    delay: 6,
    sprites: [78],
  },
  hurt: {
    delay: 6,
    sprites: rangeArray(69, 73),
  },
  getUp: {
    delay: 4,
    sprites: [79],
  },
};
