import { SpritesAnimation } from "./sprite-animation";
import { rangeArray } from "../range";

export const chevalierSpriteAnimations: SpritesAnimation = {
  walk: {
    delay: 15,
    sprites: rangeArray(8, 15),
  },
  attack1: {
    delay: 6,
    sprites: rangeArray(16, 25),
  },
  attack2: {
    delay: 6,
    sprites: rangeArray(16, 25),
  },
  attack3: {
    delay: 6,
    sprites: rangeArray(16, 25),
  },
  run: {
    delay: 8,
    sprites: rangeArray(8, 15),
  },
  idle: {
    delay: 10,
    sprites: rangeArray(0, 7),
  },
  slideAndUp: {
    delay: 10,
    sprites: rangeArray(31, 34),
  },
  jump: {
    delay: 15,
    sprites: rangeArray(26, 29),
  },
  fall: {
    delay: 5,
    sprites: [30],
  },
  knockDown: {
    delay: 15,
    sprites: rangeArray(35, 38),
  },
  down: {
    delay: 5,
    sprites: [38],
  },
  hurt: {
    delay: 6,
    sprites: rangeArray(40, 42),
  },
  getUp: {
    delay: 15,
    sprites: rangeArray(35, 38).reverse(),
  },
};
