import { Input, Physics, Scene, Types } from "phaser";

export default class BruceBanner extends Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createAnimations();
    this.setCollideWorldBounds(true);
    this.createAnimations();
    this.body!.setSize(100, 140, false);
    this.body?.setOffset(100, 95);
  }

  createAnimations() {
    this.scene.anims.create({
      key: "transform",
      frames: this.scene.anims.generateFrameNumbers("hulk_transform", {
        start: 0,
        end: 24,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "hulk_idle",
      frames: this.scene.anims.generateFrameNumbers("hulk_idle", {
        start: 0,
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  transform() {
    this.play("transform", true);
    this.setOffset(100, 80);
    this.on("animationcomplete", () => {
      this.play("hulk_idle", true);
    });
  }
}
