import { Physics, Scene } from "phaser";

export default class CharBox extends Physics.Arcade.Sprite {
  textObj: Phaser.GameObjects.Text;
  char: string;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    char: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {}
  ) {
    // Create a transparent texture for the physics body
    super(scene, x, y, "empty");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    (this.body as Physics.Arcade.Body).setAllowGravity(true);
    this.char = char;
    // Add the text object centered on the CharBox
    this.textObj = scene.add.text(x, y, char, {
      fontSize: style.fontSize || "56px",
      color: style.color || "#fff",
      fontFamily: style.fontFamily || "sorena",
      align: "center",
      backgroundColor: "transparent",
      ...style,
    });
    this.textObj.setOrigin(0.5, 0.5);
    this.body!.setSize(this.textObj.width, 45, false);
    (this.body as Physics.Arcade.Body).setSlideFactor(0, 0);
    // Optionally, you can sync the text position in update
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // Keep the text centered on the physics body
    this.textObj.setPosition(this.x, this.y);
  }

  destroy(fromScene?: boolean) {
    this.textObj.destroy();
    super.destroy(fromScene);
  }
}
