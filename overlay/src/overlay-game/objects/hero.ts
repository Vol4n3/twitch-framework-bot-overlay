import { Easing, Item2Scene, Point, Scene2d } from "jcv-ts-utils";
import { PlayerWithHeroStats } from "../../../../shared/src/shared-game";
import Point2 = Point.Point2;

export class Hero implements Item2Scene {
  isUpdated: boolean = true;
  scenePriority: number = 0;
  velocity: Point2;
  width: number = 40;
  height: number = 65;
  grounded: boolean = false;
  private messageBox: HTMLElement | null = null;

  constructor(
    public player: PlayerWithHeroStats,
    public position: Point2 = { x: 200, y: 0 },
    private container: HTMLElement
  ) {
    this.velocity = { x: 1 + player.heroStats.speed / 100, y: 0 };
  }

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
        const sign = this.velocity.x > 0 ? 1 : -1;
        this.velocity.x = sign * (1 + this.player.heroStats.speed / 100);
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
    if (this.messageBox) {
      const left = this.position.x - this.messageBox.clientWidth / 2;
      const top = this.position.y - this.messageBox.clientHeight - 40;
      this.messageBox.style.left = `${left}px`;
      this.messageBox.style.top = `${top}px`;
    }
  }

  destroy(): void {}

  removeMessageBox() {
    if (this.messageBox) {
      this.container.removeChild(this.messageBox);
      this.messageBox = null;
    }
  }

  say(text: string) {
    this.removeMessageBox();
    const div = document.createElement("div");
    div.textContent = text;
    div.style.left = `${this.position.x}px`;
    div.style.top = `${this.position.y}px`;
    div.className = "message-box";
    this.container.appendChild(div);
    this.messageBox = div;
    setTimeout(() => {
      div.style.opacity = "1";
      setTimeout(() => {
        div.style.opacity = "0";
        setTimeout(() => {
          this.removeMessageBox();
        }, 300);
      }, 6000);
    }, 1);
  }

  jump(x: number, y: number) {
    if (!this.grounded) return;
    const jumpHeight = (y - this.position.y) / 25;
    const jumpDistance = (x - this.position.x) / 25;

    this.velocity = {
      y: jumpHeight,
      x: jumpDistance,
    };
    this.grounded = false;
  }
}
