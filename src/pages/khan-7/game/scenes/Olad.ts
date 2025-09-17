import { Scene, Types } from "phaser";
import { EventBus } from "../EventBus";

export class Olad extends Scene {
  changeScene(scene: string) {
    this.scene.start(scene);
  }

  constructor() {
    super("Olad");
  }

  create() {
    // const { width, height } = this.scale;

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
