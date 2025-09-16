import { Input, Physics, Scene, Types } from "phaser";

export default class Rostam extends Physics.Arcade.Sprite {
  isPushing = false;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createAnimations();
    this.setScale(1.5);
    this.setCollideWorldBounds(true);
    this.body!.setSize(40, 50, false);
    this.body?.setOffset(10, 8);
  }

  resetOffset() {
    this.body?.setOffset(10, 8);
  }

  createAnimations() {
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("rostam_walk", {
        start: 0,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("rostam_walk", {
        start: 0,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("rostam_jump", {
        start: 0,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("rostam_idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "push",
      frames: this.scene.anims.generateFrameNumbers("rostam_push", {
        start: 0,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  handleInput(cursors: Types.Input.Keyboard.CursorKeys) {
    if (cursors.left.isDown) {
      this.setVelocityX(-150);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(150);
      this.setFlipX(false);
      this.body?.setOffset(10, 3);
    } else {
      this.setVelocityX(0);
    }

    if (
      (this.body?.blocked.right || this.body?.blocked.left || this.isPushing) &&
      (cursors.left.isDown || cursors.right.isDown)
    ) {
      this.play("push", true);
    } else {
      this.resetOffset();
      if (!this.body?.blocked.down) {
        this.play("jump", true);
      } else if (cursors.left.isDown || cursors.right.isDown) {
        this.play("walk", true);
      } else {
        this.play("idle", true);
      }
    }
    if (Input.Keyboard.JustDown(cursors.up) && this.body?.blocked.down) {
      this.setVelocityY(-800);
    }
  }
}
