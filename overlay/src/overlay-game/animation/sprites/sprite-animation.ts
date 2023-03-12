export type AnimationName =
  | "run"
  | "idle"
  | "walk"
  | "fall"
  | "slideAndUp"
  | "jump"
  | "knockDown"
  | "getUp"
  | "down"
  | "hurt"
  | "attack2"
  | "attack3"
  | "attack1";
export type SpriteSheetDefinition = { delay: number; sprites: number[] };
export type SpritesAnimation = {
  [key in AnimationName]: SpriteSheetDefinition;
};
export type SpriteSheet = {
  image: HTMLImageElement;
  animations: SpritesAnimation;
  width: number;
  height: number;
  scale: number;
};
