import { Physics, Scene } from "phaser";

export default class Star extends Physics.Arcade.Image {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "star");
    scene.add.existing(this);
    this.setInteractive({ draggable: true });
  }
}
