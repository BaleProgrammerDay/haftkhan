import { Scene, Types } from "phaser";
import Rakhsh from "../characters/Rakhsh";
import { EventBus } from "../EventBus";
import BruceBanner from "../characters/BruceBanner";

export class Bruce extends Scene {
  bruce: BruceBanner;

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  constructor() {
    super("Bruce");
  }

  create() {
    const { width, height } = this.scale;
    this.bruce = new BruceBanner(this, width / 2, height, "bruce");

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
