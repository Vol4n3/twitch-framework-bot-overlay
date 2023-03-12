import { NumberUtils, Scene2d } from "jcv-ts-utils";
import { Item2Scene } from "jcv-ts-utils/dist/geometry/scene2d";
import angleRangeLoop = NumberUtils.angleRangeLoop;
import rangeLoop = NumberUtils.rangeLoop;
import PI2 = NumberUtils.PI2;
function randomNumber() {
  return Math.round(Math.random() * 155) + 100;
}

function randomColor() {
  return `rgb(${randomNumber()} , ${randomNumber()} , ${randomNumber()})`;
}
export type Choice = { name: string; color: string; id: string };

export const choices: Choice[] = [
  { id: "relance", name: "Relance la carroue", color: randomColor() },
  { id: "pompe", name: "10 Pompes !", color: randomColor() },
  { id: "burpee", name: "3 Burpees !", color: randomColor() },
  { id: "vip", name: "Vip une semaine", color: randomColor() },
  { id: "karaoke", name: "Karaoké", color: randomColor() },
  {
    id: "addChoice",
    name: "Ajoute un défi à la carroue",
    color: randomColor(),
  },
  { id: "loose", name: "Perdu !", color: randomColor() },
  { id: "grimace", name: "une Grimace", color: randomColor() },
  { id: "blague", name: "Raconte un blague", color: randomColor() },
  { id: "squat", name: "20 squats", color: randomColor() },
  { id: "giveOther", name: "File la roue à quelqu'un", color: randomColor() },
  { id: "battleRoyal", name: "Battle Royal", color: randomColor() },
  {
    id: "refund",
    name: "Rembourse les points de chaines",
    color: randomColor(),
  },
];
const quarterSize = PI2 / choices.length;
export class Carroue implements Item2Scene {
  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    this.isUpdated = true;
    this._show = value;
  }
  isUpdated: boolean = true;
  scenePriority: number = 0;
  radius: number = 1000;
  rotation: number = Math.random() * PI2;
  rotationSpeed: number = 0;
  onStop: ((choice: Choice) => void) | null = null;
  previousIndex: number | null = null;
  onIndexChange: (() => void) | null = null;
  constructor(public x: number = 0, public y: number = 0) {}
  private _show: boolean = false;

  draw2d(scene: Scene2d): void {
    if (!this._show) return;
    const { ctx } = scene;
    ctx.translate(this.x, this.y);
    ctx.save(); // save for rotation
    ctx.rotate(this.rotation);
    ctx.save(); // save for clipping
    const rectSize = this.radius / 1.4;
    ctx.rect(-rectSize, -rectSize, rectSize * 2, rectSize * 2);
    ctx.clip();

    ctx.globalAlpha = 0.8;

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      if (!choice) continue;
      ctx.save(); // save for color parts
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        this.radius,
        quarterSize * i,
        quarterSize + quarterSize * i
      );
      ctx.fillStyle = choice.color;
      ctx.lineWidth = 10;
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.restore(); // restore color parts
      ctx.save(); // save for text
      ctx.rotate(quarterSize / 2 + quarterSize * i);
      scene.writeText({
        fillStyle: "black",
        strokeStyle: "black",
        font: {
          size: 32,
          type: "Helvetica",
        },

        lineWidth: 1,
        x: 200,
        y: 0,
        text: choice.name,
      });
      ctx.restore(); // restore text
    }
    ctx.restore(); // restore clipping

    ctx.beginPath();
    ctx.rect(-rectSize, -rectSize, rectSize * 2, rectSize * 2);
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, PI2);
    ctx.fill();
    ctx.closePath();
    ctx.restore(); // restore rotation
    ctx.beginPath();
    ctx.moveTo(40, 15);
    ctx.lineTo(100, 0);
    ctx.lineTo(40, -15);
    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  launch() {
    this.rotationSpeed = Math.random() / 10 + 0.2;
    this.isUpdated = true;
  }
  update(): void {
    if (this.rotationSpeed === 0) return;
    this.isUpdated = true;
    this.rotation += this.rotationSpeed;
    this.rotation = angleRangeLoop(this.rotation);
    const positiveAngle = (this.rotation + PI2) / 2;
    const indexChoice: number =
      choices.length -
      1 -
      Math.floor(
        rangeLoop(0, positiveAngle / (quarterSize / 2), choices.length)
      );
    if (indexChoice !== this.previousIndex && this.onIndexChange) {
      this.onIndexChange();
    }
    this.previousIndex = indexChoice;
    if (this.rotationSpeed > 0.0001 && Math.random() > 0.6) {
      this.rotationSpeed *= 0.992;
      if (this.rotationSpeed <= 0.0005) {
        this.rotationSpeed = 0;
        if (this.onStop) this.onStop(choices[indexChoice]);
      }
    }
  }

  destroy(): void {}
}
