import { Scene, Types } from "phaser";
import Rakhsh from "../characters/Rakhsh";
import { EventBus } from "../EventBus";
import BruceBanner from "../characters/BruceBanner";
import Star from "../characters/Star";

export class Bruce extends Scene {
  bruce: BruceBanner;
  stars: Star[] = [];

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  constructor() {
    super("Bruce");
  }

  create() {
    this.stars = [];
    const { width, height } = this.scale;
    this.bruce = new BruceBanner(this, width / 2, height, "bruce");
    this.stars.push(new Star(this, width - 60, 100));
    this.stars.push(new Star(this, 60, 200));
    this.input.setDraggable(this.stars);
    this.stars.forEach((star) => {
      star.on("drag", (_pointer: any, dragX: number, dragY: number) => {
        star.x = dragX;
        star.y = dragY;
        if (this.stars.length === 2 && this.bruce) {
          const [star1, star2] = this.stars;
          const bruceX = this.bruce.body?.x ?? 0;
          const bruceY = this.bruce.body?.y ?? 0;
          const bruceWidth = this.bruce.body?.width ?? 0;
          const starsOnSides =
            (star1.x < bruceX && star2.x > bruceX + bruceWidth) ||
            (star2.x < bruceX && star1.x > bruceX + bruceWidth);
          const starsBelow = star1.y > bruceY && star2.y > bruceY;
          if (starsOnSides && starsBelow) {
            this.bruce.transform();
          }
        }
      });
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
