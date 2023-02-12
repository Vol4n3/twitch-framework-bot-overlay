import { Easing, Item2Scene, Point, Scene2d } from "jcv-ts-utils";
import { PlayerWithHeroStats } from "../../../../shared/src/shared-game";
import Point2 = Point.Point2;

export class Hero implements Item2Scene {
  isUpdated: boolean = true;
  scenePriority: number = 0;
  velocity: Point2 = { x: 1, y: 0 };
  width: number = 40;
  height: number = 65;
  grounded: boolean = false;

  constructor(
    public player: PlayerWithHeroStats,
    public position: Point2 = { x: 200, y: 0 }
  ) {}

  // @ts-ignore
  draw2d(scene: Scene2d): void {
    const { ctx } = scene;
    const { x, y } = this.position;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    scene.writeText({
      x: this.width / 2,
      y: -10,
      text: this.player.name,
      textAlign: "center",
      fillStyle: "red",
    });
  }

  onResize(): void {}

  update(scene: Scene2d): void {
    const { height, width } = scene;
    this.isUpdated = true;
    this.position = Point.operation("add", this.position, this.velocity);
    const limitGround = height - this.height;
    if (!this.grounded) {
      if (this.position.y >= limitGround) {
        this.grounded = true;
        this.position.y = limitGround;
        this.velocity.y = 0;
        scene.addEasing({
          easing: Easing.easeShakeOut(8),
          scale: 5,
          onNext: (n: number) => (scene.camera.y = n),
          start: scene.camera.y,
          time: 10,
        });
        scene.addEasing({
          easing: Easing.easeShake(3),
          scale: 5,
          onNext: (n: number) => (scene.camera.x = n),
          start: scene.camera.x,
          time: 10,
        });
      } else {
        this.velocity.y++;
      }
    }

    const limitRight = width - this.width;
    if (this.position.x > limitRight) {
      this.velocity.x *= -1;
      this.position.x = limitRight;
    }
    const limitLeft = 0;
    if (this.position.x < limitLeft) {
      this.velocity.x *= -1;
      this.position.x = limitLeft;
    }
  }

  destroy(): void {}
}
