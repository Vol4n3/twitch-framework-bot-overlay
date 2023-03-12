import { SpritesAnimation } from "./sprite-animation";
import { rangeArray } from "../range";

export const icecopteredSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 15,
    sprites: rangeArray(8, 14),
  },
  attack1: {
    delay: 6,
    sprites: rangeArray(15, 19),
  },
  attack2: {
    delay: 6,
    sprites: rangeArray(20, 29),
  },
  attack3: {
    delay: 6,
    sprites: rangeArray(15, 19),
  },
  run: {
    delay: 8,
    sprites: rangeArray(8, 14),
  },
  idle: {
    delay: 10,
    sprites: rangeArray(0, 7),
  },
  slideAndUp: {
    delay: 10,
    sprites: rangeArray(30, 38),
  },
  jump: {
    delay: 15,
    sprites: rangeArray(8, 14),
  },
  fall: {
    delay: 5,
    sprites: rangeArray(0, 7),
  },
  knockDown: {
    delay: 15,
    sprites: rangeArray(39, 42),
  },
  down: {
    delay: 5,
    sprites: rangeArray(43, 47),
  },
  hurt: {
    delay: 6,
    sprites: rangeArray(40, 41),
  },
  getUp: {
    delay: 6,
    sprites: rangeArray(0, 7),
  },
};
