import { Physics, Scene } from "phaser";

export default class RedButton extends Physics.Arcade.Sprite {
  private isPressed: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "red_button", 0); // Start with frame 0 (unpressed)

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body since buttons don't move

    this.setInteractive();
    this.setScale(1);

    // Set up click/touch events
    this.on("pointerdown", this.onPressed, this);
    this.on("pointerup", this.onReleased, this);
    this.on("pointerout", this.onReleased, this); // Release when mouse leaves button
  }

  private onPressed(): void {
    if (!this.isPressed) {
      this.isPressed = true;
      this.setFrame(1); // Switch to pressed frame

      // You can add custom button press logic here
      this.emit("button-pressed", this);
    }
  }

  private onReleased(): void {
    if (this.isPressed) {
      this.isPressed = false;
      this.setFrame(0); // Switch back to unpressed frame

      // You can add custom button release logic here
      this.emit("button-released", this);
    }
  }

  public getIsPressed(): boolean {
    return this.isPressed;
  }

  public setPressed(pressed: boolean): void {
    this.isPressed = pressed;
    this.setFrame(pressed ? 1 : 0);
  }
}

