import { Physics, Scene } from "phaser";

export default class Tower extends Physics.Arcade.Image {
  isActivate: boolean;
  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.isActivate = false;
  }
}
