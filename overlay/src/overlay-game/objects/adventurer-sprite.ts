import { AnimationName, SpriteSheetDefinition } from "./sprite-animation";

export const AventurerSpriteAnimations: {
  [key in AnimationName]: SpriteSheetDefinition;
} = {
  walk: {
    delay: 12,
    sprites: [155, 156, 157, 158, 159, 160],
  },
  attack1: {
    delay: 12,
    sprites: [42, 44, 45, 46],
  },
  attack2: {
    delay: 12,
    sprites: [47, 48, 49, 50, 51, 52],
  },
  attack3: {
    delay: 12,
    sprites: [53, 54, 55, 56, 57, 58],
  },
  run: {
    delay: 8,
    sprites: [8, 9, 10, 11, 12, 13],
  },
  idle: {
    delay: 20,
    sprites: [0, 1, 2, 3],
  },
  slideAndUp: {
    delay: 10,
    sprites: [24, 25, 26, 27, 28],
  },
  jump: {
    delay: 8,
    sprites: [14, 15, 16, 17, 18, 19, 20, 21],
  },
  fall: {
    delay: 5,
    sprites: [22, 23],
  },
  knockDown: {
    delay: 10,
    sprites: [142, 143, 144, 145, 146, 147],
  },
  down: {
    delay: 5,
    sprites: [147],
  },
  hurt: {
    delay: 6,
    sprites: [59, 60, 61],
  },
  getUp: {
    delay: 6,
    sprites: [148, 149, 150, 151, 152, 153, 154],
  },
};
