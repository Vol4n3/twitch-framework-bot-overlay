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
