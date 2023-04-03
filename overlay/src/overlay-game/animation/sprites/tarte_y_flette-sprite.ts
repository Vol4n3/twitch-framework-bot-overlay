import { SpritesAnimation } from "./sprite-animation";
import { rangeArray } from "../range";

export const tarteyfletteSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 10,
    sprites: rangeArray(24, 30),
  },
  attack1: {
    delay: 12,
    sprites: rangeArray(31, 39),
  },
  attack2: {
    delay: 12,
    sprites: rangeArray(31, 39),
  },
  attack3: {
    delay: 12,
    sprites: rangeArray(31, 39),
  },
  run: {
    delay: 7,
    sprites: rangeArray(24, 30),
  },
  idle: {
    delay: 15,
    sprites: rangeArray(0, 23),
  },
  slideAndUp: {
    delay: 40,
    sprites: rangeArray(74, 76),
  },
  jump: {
    delay: 8,
    sprites: rangeArray(66, 72),
  },
  fall: {
    delay: 5,
    sprites: [73],
  },
  knockDown: {
    delay: 5,
    sprites: rangeArray(44, 61),
  },
  down: {
    delay: 6,
    sprites: rangeArray(62, 65),
  },
  hurt: {
    delay: 6,
    sprites: rangeArray(40, 43),
  },
  getUp: {
    delay: 4,
    sprites: rangeArray(45, 61).reverse(),
  },
};
