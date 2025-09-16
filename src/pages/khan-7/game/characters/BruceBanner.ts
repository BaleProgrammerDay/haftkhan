import { Input, Physics, Scene, Types } from "phaser";

export default class BruceBanner extends Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createAnimations();
    this.setCollideWorldBounds(true);
    // this.setScale(1.5);
    // this.body!.setSize(60, 54, false);
    // this.body?.setOffset(10, 10);
  }

  createAnimations() {}
}
