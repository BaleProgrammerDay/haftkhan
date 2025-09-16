import { Physics, Scene } from "phaser";

export default class RostamVehicle extends Physics.Arcade.Sprite {
  private isJumping: boolean = false;
  private originalRotation: number = 0;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "rostam_vehicle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createAnimations();
    this.setScale(1);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.body!.setSize(300, 140, false);
    this.body?.setOffset(15, 10);
    this.originalRotation = this.rotation;
  }

  createAnimations() {
    this.scene.anims.create({
      key: "vehicle_move",
      frames: this.scene.anims.generateFrameNumbers("rostam_vehicle", {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });
  }

  startMoving() {
    this.play("vehicle_move", true);
    // Vehicle stays in place - no forward movement
    // The illusion of movement comes from obstacles moving left
  }

  stopMoving() {
    this.stop();
  }

  jump() {
    if (this.body?.blocked.down && !this.isJumping) {
      this.isJumping = true;
      this.setVelocityY(-1000);

      // Start jump rotation animation
      this.scene.tweens.add({
        targets: this,
        rotation: -0.3, // Rotate upward
        duration: 800,
        ease: "Power2",
        onComplete: () => {
          // Return to normal rotation when landing
          this.scene.tweens.add({
            targets: this,
            rotation: this.originalRotation,
            duration: 500,
            ease: "Power2",
          });
        },
      });
    }
  }

  update() {
    // Check if landed
    if (this.isJumping && this.body?.blocked.down) {
      this.isJumping = false;
      // Return to normal rotation when landing
      this.scene.tweens.add({
        targets: this,
        rotation: this.originalRotation,
        duration: 200,
        ease: "Power2",
      });
    }
  }

  handleInput(spaceKey: Phaser.Input.Keyboard.Key) {
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
      this.jump();
    }
  }
}

