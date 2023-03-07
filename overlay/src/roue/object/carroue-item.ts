import { NumberUtils, Scene2d } from "jcv-ts-utils";
import { Item2Scene } from "jcv-ts-utils/dist/geometry/scene2d";
import angleRangeLoop = NumberUtils.angleRangeLoop;
import rangeLoop = NumberUtils.rangeLoop;
import PI = NumberUtils.PI;
import PI2 = NumberUtils.PI2;
function randomNumber() {
  return Math.round(Math.random() * 155) + 100;
}

function randomColor() {
  return `rgb(${randomNumber()} , ${randomNumber()} , ${randomNumber()})`;
}
export type Choice = { name: string; color: string };
export const choices: Choice[] = [
  { name: "Relance la carroue 0", color: randomColor() },
  { name: "Fais 10 Pompes 1", color: randomColor() },
  { name: "Vip une semaine 2", color: randomColor() },
  { name: "Karaoké 3", color: randomColor() },
  { name: "Ajoute un défi à la roue 4", color: randomColor() },
  { name: "Perdu ! 5", color: randomColor() },
  { name: "Fais une Grimace 6", color: randomColor() },
  { name: "Raconte un blague 7", color: randomColor() },
  /*  { name: "7", color: randomColor() },
    { name: "8", color: randomColor() },
    { name: "9", color: randomColor() },
    { name: "10", color: randomColor() },
    { name: "11", color: randomColor() },*/
];
export class Carroue implements Item2Scene {
  isUpdated: boolean = true;
  scenePriority: number = 0;
  radius: number = 1000;

  rotation: number = Math.random() * PI2;
  rotationSpeed: number = 0;
  onStop: ((choice: Choice) => void) | null = null;
  constructor(public x: number = 0, public y: number = 0) {}

  draw2d(scene: Scene2d): void {
    const { ctx } = scene;
    ctx.translate(this.x, this.y);
    ctx.save(); // save for rotation
    ctx.rotate(this.rotation);
    ctx.save(); // save for clipping
    const rectSize = this.radius / 1.4;
    ctx.rect(-rectSize, -rectSize, rectSize * 2, rectSize * 2);
    ctx.clip();

    ctx.globalAlpha = 0.8;
    const quarterSize = (PI * 2) / choices.length;
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
          size: 40,
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

    if (this.rotationSpeed > 0.0001 && Math.random() > 0.6) {
      this.rotationSpeed *= 0.992;
      if (this.rotationSpeed <= 0.0005) {
        this.rotationSpeed = 0;
        const positiveAngle = (this.rotation + PI2) / 2;
        const quarterSize = PI2 / choices.length / 2;
        const indexChoice: number =
          choices.length -
          1 -
          Math.floor(rangeLoop(0, positiveAngle / quarterSize, choices.length));

        if (this.onStop) this.onStop(choices[indexChoice]);
      }
    }
  }

  destroy(): void {}
}
