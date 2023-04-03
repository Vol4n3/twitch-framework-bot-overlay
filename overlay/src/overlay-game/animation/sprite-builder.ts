import { HeroSkin } from "../../../../shared/src/shared-game";
import { SpriteSheet } from "./sprites/sprite-animation";
import { loadImage } from "jcv-ts-utils";
import { aventurerSpriteAnimations } from "./sprites/adventurer-sprite";
import { chevalierSpriteAnimations } from "./sprites/chevalier-sprite";
import { pimoukiSpriteAnimations } from "./sprites/pimouki-sprite";
import { icecopteredSpriteAnimations } from "./sprites/icecoptered-sprite";
import { kikiksSpriteAnimations } from "./sprites/kikiks-sprite";
import { tarteyfletteSpriteAnimations } from "./sprites/tarte_y_flette-sprite";
import { andrewSpriteAnimations } from "./sprites/andrew-sprite";

export const buildSpriteSheet = async (): Promise<{
  [key in HeroSkin]: SpriteSheet;
}> => {
  const [
    adventurer,
    blueAdventurer,
    chevalier,
    pimouki,
    kikiks,
    icecoptered,
    tarte_y_flette,
    andrew,
  ] = await Promise.all([
    loadImage("/assets/img/adventurer-sheet.png"),
    loadImage("/assets/img/adventurer-sheet-blue.png"),
    loadImage("/assets/img/chevalier-sheet.png"),
    loadImage("/assets/img/pimouki.png"),
    loadImage("/assets/img/kikiks.png"),
    loadImage("/assets/img/icecoptered.png"),
    loadImage("/assets/img/tarte_y_flette.png"),
    loadImage("/assets/img/andrew.png"),
  ]);
  return {
    adventurer: {
      image: adventurer,
      animations: aventurerSpriteAnimations,
      width: 50,
      height: 37,
      scale: 4,
    },
    blueAdventurer: {
      image: blueAdventurer,
      animations: aventurerSpriteAnimations,
      width: 50,
      height: 37,
      scale: 4,
    },
    chevalier: {
      image: chevalier,
      animations: chevalierSpriteAnimations,
      width: 128,
      height: 64,
      scale: 3,
    },
    pimouki: {
      image: pimouki,
      animations: pimoukiSpriteAnimations,
      width: 48,
      height: 32,
      scale: 5,
    },
    icecoptered: {
      image: icecoptered,
      animations: icecopteredSpriteAnimations,
      width: 128,
      height: 100,
      scale: 2,
    },
    kikiks: {
      image: kikiks,
      animations: kikiksSpriteAnimations,
      width: 48,
      height: 32,
      scale: 5,
    },
    tarte_y_flette: {
      image: tarte_y_flette,
      animations: tarteyfletteSpriteAnimations,
      width: 599,
      height: 256,
      scale: 0.7,
      cropHitBox: {
        top: 30,
        left: 10,
        right: 10,
      },
    },
    andrew: {
      image: andrew,
      animations: andrewSpriteAnimations,
      width: 64,
      height: 46,
      scale: 3,
    },
  };
};
