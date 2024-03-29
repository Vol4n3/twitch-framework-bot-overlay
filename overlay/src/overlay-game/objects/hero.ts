import {
  ArrayUtils,
  Easing,
  Item2Scene,
  Point,
  Rectangle,
  Scene2d,
} from "jcv-ts-utils";
import { PlayerWithHeroStats } from "../../../../shared/src/shared-game";
import {
  AnimationName,
  SpriteSheet,
} from "../animation/sprites/sprite-animation";
function rotateColors(data: Uint8ClampedArray, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const length = data.length;
  const sinSqrt = Math.sqrt(1 / 3) * sin;
  const cosTierce = (1 - cos) / 3;
  const A = cos + cosTierce;
  const B = cosTierce - sinSqrt;
  const C = cosTierce + sinSqrt;
  for (let i = 0; i < length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = A * r + B * g + C * b;
    data[i + 1] = C * r + A * g + B * b;
    data[i + 2] = B * r + C * g + A * b;
  }
}

const effectSprite = (
  spriteSheet: SpriteSheet,
  width: number,
  height: number,
  animationFrame: number,
  time: number
) => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(
    spriteSheet.image,
    spriteSheet.width * animationFrame,
    0,
    spriteSheet.width,
    spriteSheet.height,
    0,
    0,
    width,
    height
  );

  const data = tempCtx.getImageData(0, 0, width, height);
  rotateColors(data.data, time / 10);

  tempCtx.putImageData(data, 0, 0);
  return tempCanvas;
};
export class Hero implements Item2Scene {
  isUpdated: boolean = true;
  scenePriority: number = 0;
  velocity: Point.Point2 = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;
  animationName: AnimationName = "walk";
  grounded: boolean = false;
  lastAttack: Hero | null = null;
  floatingMessage: {
    text: string;
    delay: number;
    elevation: number;
    color: string;
    size: number;
  } | null = null;
  public onDie: ((killer: Hero) => void) | undefined;
  private messageBox: HTMLElement | null = null;
  private frameCount = 0;
  private health: number;
  constructor(
    private _player: PlayerWithHeroStats,
    public position: Point.Point2 = { x: 200, y: 0 },
    private container: HTMLElement,
    private spriteSheet: SpriteSheet,
    private isBattleRoyal: boolean = false
  ) {
    this.width = spriteSheet.width * spriteSheet.scale;
    this.height = spriteSheet.height * spriteSheet.scale;
    this.health = _player.heroStats.pv;
    this.move();
  }

  get player() {
    return this._player;
  }

  set player(p: PlayerWithHeroStats) {
    this._player = p;
    this.velocity = {
      x:
        (1 + this._player.heroStats.speed / 10) *
        (this.velocity.x > 1 ? 1 : -1),
      y: this.velocity.y,
    };
  }

  move() {
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.velocity = {
      x: (1 + this._player.heroStats.speed / 10) * direction,
      y: 0,
    };
  }

  stop() {
    const direction = Math.random() > 0.5 ? 0.01 : -0.01;
    this.velocity = { x: direction, y: 0 };
  }

  getRect(): Rectangle.Rectangle2 {
    const crop = this.spriteSheet.cropHitBox || {};
    return {
      x: this.position.x + this.width / 2 - (crop.left || 0),
      y: this.position.y - (crop.top || 0),
      w: this.width - this.width / 2 - (crop.right || 0),
      h: this.height - (crop.bottom || 0),
    };
  }
  coloration: number | null = 0;
  draw2d(scene: Scene2d, time: number): void {
    const { ctx } = scene;
    const { x, y } = this.position;
    ctx.imageSmoothingEnabled = false;
    ctx.translate(x, y);
    ctx.save();
    if (this.velocity.x < 0) {
      ctx.translate(this.width, 0);
      ctx.scale(-1, 1);
    }
    const { sprites, delay } = this.spriteSheet.animations[this.animationName];
    const loop = (this.frameCount / delay) % sprites.length;
    const animationFrame = sprites.at(loop);

    if (typeof animationFrame !== "undefined") {
      const resultEffect = effectSprite(
        this.spriteSheet,
        this.width,
        this.height,
        animationFrame,
        this.coloration === null ? time : this.coloration
      );
      if (resultEffect) {
        ctx.drawImage(resultEffect, 0, 0);
      } else {
        ctx.drawImage(
          this.spriteSheet.image,
          this.spriteSheet.width * animationFrame,
          0,
          this.spriteSheet.width,
          this.spriteSheet.height,
          0,
          0,
          this.width,
          this.height
        );
      }
      this.frameCount++;
    }

    ctx.restore();
    scene.writeText({
      x: this.width / 2,
      y: -10 + (this.spriteSheet.cropHitBox?.top || 0),
      text: `(${this._player.level}) ${this._player.name}
      ${this.canAttack() ? "⚔️" : ""} ${this.health}❤️‍🔥`,
      textAlign: "center",
      strokeStyle: "black",
      lineWidth: 0.5,
      fillStyle: "white",
    });
    if (this.floatingMessage) {
      scene.writeText({
        x: this.width / 2,
        y: -30 + this.floatingMessage.elevation,
        text: `${this.floatingMessage.text}`,
        textAlign: "center",
        font: { type: "sans-serif", size: this.floatingMessage.size },
        fillStyle: this.floatingMessage.color,
      });
      this.floatingMessage.elevation -= 1;
      this.floatingMessage.delay--;
      if (this.floatingMessage.delay < 0) {
        this.floatingMessage = null;
      }
    }
  }

  onResize(): void {}

  setAnimation(name: AnimationName, after?: number) {
    if (after) {
      setTimeout(() => {
        this.frameCount = 0;
        this.animationName = name;
      }, after);
      return;
    }
    if (name === this.animationName) return;
    this.frameCount = 0;
    this.animationName = name;
  }

  shakeCamera(scene: Scene2d) {
    Promise.all([
      scene.addEasing({
        easing: Easing.easeShakeOut(8),
        scale: 5,
        onNext: (n: number) => (scene.camera.y = n),
        start: scene.camera.y,
        time: 10,
      }),
      scene.addEasing({
        easing: Easing.easeShake(3),
        scale: 5,
        onNext: (n: number) => (scene.camera.x = n),
        start: scene.camera.x,
        time: 10,
      }),
    ]).then(() => {
      scene.camera.y = 0;
      scene.camera.x = 0;
    });
  }

  isWander() {
    return (
      this.animationName === "run" ||
      this.animationName === "idle" ||
      this.animationName === "walk"
    );
  }

  update(scene: Scene2d, count: number): void {
    const { height, width } = scene;
    this.isUpdated = true;
    const { regen, pv, speed } = this._player.heroStats;
    if (!this.isBattleRoyal && count % 300 === 0) {
      if (this.isWander()) {
        if (this.animationName === "idle") {
          const rand = Math.random() > 0.2;
          if (rand) {
            this.move();
          }
        } else {
          const rand = Math.random() > 0.8;
          if (rand) {
            this.stop();
          }
        }
      }
    }
    if (count % 3000 === 0) {
      if (!this.isBattleRoyal) {
        this.health += this.health <= 0 ? pv : regen;
      }
      if (this.health > pv) {
        this.health = pv;
      }
    }
    if (this.messageBox) {
      const left = this.position.x;
      const top = this.position.y - this.messageBox.clientHeight - 40;
      this.messageBox.style.left = `${left}px`;
      this.messageBox.style.top = `${top}px`;
    }
    if (
      this.animationName === "getUp" ||
      this.animationName === "down" ||
      this.animationName === "knockDown"
    ) {
      if (this.health > 0) {
        this.setAnimation("getUp");
        this.setAnimation("walk", 600);
      }
      return;
    }
    if (Math.abs(this.velocity.x) > 0.01) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;
    const limitGround = height - this.height;
    if (!this.grounded) {
      if (this.position.y >= limitGround) {
        this.grounded = true;
        this.position.y = limitGround;
        this.velocity.y = 0;
        const sign = this.velocity.x > 0 ? 1 : -1;
        this.velocity.x = sign * (1 + speed / 10);
        this.setAnimation("slideAndUp");
        this.setAnimation("walk", 850);
        this.shakeCamera(scene);
      } else {
        if (this.velocity.y > 0) {
          this.setAnimation("fall");
        }

        this.velocity.y++;
      }
    } else {
      if (this.isWander()) {
        if (Math.abs(this.velocity.x) > 4) {
          this.setAnimation("run");
        } else if (Math.abs(this.velocity.x) <= 0.1) {
          this.setAnimation("idle");
        } else {
          this.setAnimation("walk");
        }
      }
    }

    const limitRight = width - this.width / 2;
    if (this.position.x > limitRight) {
      this.velocity.x *= -1;
      this.position.x = limitRight;
      if (this.animationName === "walk" || this.animationName === "run") {
        this.lastAttack = null;
      }
    }
    const limitLeft = 0 - this.width / 2;
    if (this.position.x < limitLeft) {
      this.velocity.x *= -1;
      this.position.x = limitLeft;
      if (this.animationName === "walk" || this.animationName === "run") {
        this.lastAttack = null;
      }
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
    if (this.animationName !== "walk" && this.animationName !== "run") return;
    this.setAnimation("jump");
    setTimeout(() => {
      const jumpHeight = (y - this.position.y) / 20;
      const jumpDistance = (x - this.position.x) / 150;

      this.velocity = {
        y: jumpHeight > -20 ? -20 : jumpHeight,
        x: jumpDistance,
      };
      this.grounded = false;
    }, 400);
  }
  canAttack(): boolean {
    return !(
      (this.animationName !== "run" && this.animationName !== "walk") ||
      this.lastAttack
    );
  }
  attack(target: Hero): boolean {
    if (this.health <= 0) return false;
    if (!this.canAttack()) return false;
    if (target.health <= 0) return false;
    if (this.velocity.x > 0) {
      if (this.position.x > target.position.x) return false;
    } else {
      if (this.position.x < target.position.x) return false;
    }
    this.lastAttack = target;
    const rand = ArrayUtils.pickRandomOne<AnimationName>([
      "attack1",
      "attack3",
      "attack2",
    ]);
    const isSCritic = Math.random() + this._player.heroStats.critic / 100 > 1;
    const criticModifier = isSCritic ? 2 : 1;
    const isDodge = Math.random() + target._player.heroStats.dodge / 100 > 1;
    const copyVel = this.velocity.x;
    this.setAnimation(rand);
    this.velocity.x /= 1000;
    setTimeout(() => {
      if (!isDodge) {
        const damage = this._player.heroStats.power * criticModifier;
        target.health -= damage;
        target.floatingMessage = {
          delay: 50,
          color: isSCritic ? "orange" : "yellow",
          text: `${damage}${isSCritic ? "✨" : ""}`,
          elevation: 0,
          size: isSCritic ? 40 : 30,
        };
      } else {
        target.floatingMessage = {
          delay: 50,
          color: "white",
          text: `Esquive`,
          elevation: 0,
          size: 25,
        };
      }
      this.velocity.x = copyVel;
      if (target.health <= 0) {
        target.health = 0;
        if (target.onDie) target.onDie(this);

        target.setAnimation("knockDown");
        target.setAnimation("down", 1000);
      } else {
        target.setAnimation("hurt");
        target.setAnimation("walk", 300);
      }
      this.setAnimation("idle");
    }, 1000);
    return true;
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}
