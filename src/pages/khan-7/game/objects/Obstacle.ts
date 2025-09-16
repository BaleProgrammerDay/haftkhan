import { Physics, Scene } from "phaser";

export default class Obstacle extends Physics.Arcade.Image {
  declare body: Physics.Arcade.Body; // tell TS what body will be
  private gameSpeed: number = 400;
  // texture: string

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, texture === "airplane" ? y - 220 : y, texture);
  }

  public applyPhysics() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    (this.body as Physics.Arcade.Body).setSlideFactor(0, 0);
    if (this.texture.key === "airplane") {
      this.body.setAllowGravity(false);
    } else {
      this.setScale(0.5);
    }
    this.moveLeft(this.gameSpeed);
  }

  moveLeft(speed: number = 300) {
    this.setVelocityX(-speed);
  }

  checkBounds() {
    if (this.active && this.x < -100) {
      this.destroy();
    }
  }

  update(gameSpeed: number) {
    console.log("!@!", gameSpeed);
    this.moveLeft(gameSpeed);
  }
}

