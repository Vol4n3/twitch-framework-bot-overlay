import { Easing, NumberUtils, Scene2d } from "jcv-ts-utils";
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

const buildChoices = (): Choice[] => [
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
  { id: "changeIde", name: "Change le theme d'IDE", color: randomColor() },
  { id: "battleRoyal", name: "Battle Royal", color: randomColor() },
  {
    id: "heroUpgrade",
    name: "Ton héro gagne 20 points de stat",
    color: randomColor(),
  },
  {
    id: "heroDowngrade",
    name: "Ton héro perd 5 points de stat :/",
    color: randomColor(),
  },

  {
    id: "refund",
    name: "Rembourse la carroue",
    color: randomColor(),
  },
];

export class Carroue implements Item2Scene {
  private pinRotation: number = 0;
  private choices: Choice[] = buildChoices();
  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    this.isUpdated = true;
    this.rotation = Math.random() * PI2;
    this.choices = buildChoices();
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

    ctx.globalAlpha = 0.7;
    const quarterSize = PI2 / this.choices.length;
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];
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
    ctx.rotate(this.pinRotation);
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
  launch(invert: boolean) {
    this.rotationSpeed = Math.random() / 10 + 0.2 * (invert ? -1 : 1);
    this.isUpdated = true;
  }
  update(scene: Scene2d): void {
    if (this.rotationSpeed === 0) return;
    this.isUpdated = true;
    this.rotation += this.rotationSpeed;
    this.rotation = angleRangeLoop(this.rotation);
    const positiveAngle = (this.rotation + PI2) / 2;
    const quarterSize = PI2 / this.choices.length;
    const indexChoice: number =
      this.choices.length -
      1 -
      Math.floor(
        rangeLoop(0, positiveAngle / (quarterSize / 2), this.choices.length)
      );
    if (indexChoice !== this.previousIndex && this.onIndexChange) {
      this.onIndexChange();
      scene
        .addEasing({
          easing: Easing.easeShakeOut(4),
          start: 0,
          time: 35,
          scale: 0.06,
          onNext: (value) => (this.pinRotation = value),
        })
        .then(() => {
          this.pinRotation = 0;
        });
    }
    this.previousIndex = indexChoice;
    const absSpeed = Math.abs(this.rotationSpeed);
    if (absSpeed > 0.0001 && Math.random() > 0.6) {
      this.rotationSpeed *= 0.992;
      if (absSpeed <= 0.0005) {
        this.rotationSpeed = 0;
        if (this.onStop) this.onStop(this.choices[indexChoice]);
      }
    }
  }

  destroy(): void {}
}
