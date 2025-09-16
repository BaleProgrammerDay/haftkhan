import { Scene, Types } from "phaser";
import { EventBus } from "../EventBus";
import Tower from "../objects/Tower";
import CharBox from "../objects/CharBox";
import Rostam from "../characters/Rostam";
import { store } from "~/store/store";
import { addMessage } from "~/store/chat/chat.slice";
import { Chats } from "../../messenger/types/Chat";

export class Pisano extends Scene {
  tower: Tower;
  rostam: Rostam;
  cursors: Types.Input.Keyboard.CursorKeys;
  charBox: CharBox;
  leftGraphics: Phaser.GameObjects.Graphics;
  leftFilled: boolean = false;
  leftUnderlineX: number;
  underlineY: number;
  underlineWidth: number;
  underlineHeight: number;
  messageIsSent: boolean = false;

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  constructor() {
    super("Pisano");
  }

  create() {
    const { width, height } = this.scale;
    this.tower = new Tower(this, 400, height, "tower");
    this.tower.setY(this.tower.y - this.tower.displayHeight / 2);
    this.tower.body?.updateFromGameObject();
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add two static rectangles (underlines) to both sides of the tower
    const underlineWidth = 100;
    const underlineHeight = 40;
    const underlineYOffset = 10; // distance below the tower
    const leftUnderlineX =
      this.tower.x - this.tower.displayWidth / 2 - underlineWidth / 2 - 40;
    const rightUnderlineX =
      this.tower.x + this.tower.displayWidth / 2 + underlineWidth / 2 + 40;
    const underlineY =
      this.tower.y + this.tower.displayHeight / 2 + underlineYOffset;

    // Left underline (striped outline, no fill initially)
    this.leftGraphics = this.add.graphics();
    this.leftFilled = false;
    this.underlineWidth = underlineWidth;
    this.underlineHeight = underlineHeight;
    this.leftUnderlineX = leftUnderlineX;
    this.underlineY = underlineY;
    this.drawLeftUnderline(false);

    // Right underline (striped outline, no fill)
    const rightGraphics = this.add.graphics();
    rightGraphics.lineStyle(3, 0xffffff, 1);
    const stripeGap = 10;
    for (
      let x = -underlineWidth / 2;
      x < underlineWidth / 2;
      x += stripeGap * 2
    ) {
      rightGraphics.beginPath();
      rightGraphics.moveTo(
        rightUnderlineX + x,
        underlineY - underlineHeight / 2
      );
      rightGraphics.lineTo(
        rightUnderlineX + x + stripeGap,
        underlineY - underlineHeight / 2
      );
      rightGraphics.strokePath();
      rightGraphics.beginPath();
      rightGraphics.moveTo(
        rightUnderlineX + x,
        underlineY + underlineHeight / 2
      );
      rightGraphics.lineTo(
        rightUnderlineX + x + stripeGap,
        underlineY + underlineHeight / 2
      );
      rightGraphics.strokePath();
    }
    for (
      let y = -underlineHeight / 2;
      y < underlineHeight / 2;
      y += stripeGap * 2
    ) {
      rightGraphics.beginPath();
      rightGraphics.moveTo(
        rightUnderlineX - underlineWidth / 2,
        underlineY + y
      );
      rightGraphics.lineTo(
        rightUnderlineX - underlineWidth / 2,
        underlineY + y + stripeGap
      );
      rightGraphics.strokePath();
      rightGraphics.beginPath();
      rightGraphics.moveTo(
        rightUnderlineX + underlineWidth / 2,
        underlineY + y
      );
      rightGraphics.lineTo(
        rightUnderlineX + underlineWidth / 2,
        underlineY + y + stripeGap
      );
      rightGraphics.strokePath();
    }

    this.rostam = new Rostam(this, 250, height, "rostam");

    EventBus.on("new-message", (massage: string) => {
      if (this.charBox) {
        this.charBox.destroy();
      }
      this.charBox = new CharBox(this, width - 100, 100, massage[0] ?? "");
      let t: any = null;
      this.physics.add.collider(this.rostam, this.charBox, (rostam: any) => {
        if (t) clearTimeout(t);
        rostam.isPushing = true;
        t = setTimeout(() => {
          rostam.isPushing = false;
        }, 100);
      });
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    this.rostam.handleInput(this.cursors);
    // Check if charBox is left of left rectangle, fill if so
    if (this.charBox && this.charBox.char == "\\" && this.leftGraphics) {
      const charBoxRight =
        this.charBox.x +
        (this.charBox.displayWidth ? this.charBox.displayWidth / 2 : 0);
      const leftRectLeft = this.leftUnderlineX - this.underlineWidth / 2;
      if (charBoxRight < leftRectLeft) {
        if (!this.leftFilled) {
          this.leftFilled = true;
          this.drawLeftUnderline(true);
          this.tower.setTexture("tower_straight");
          if (!this.messageIsSent) {
            store.dispatch(
              addMessage({
                chatId: Chats.Pisano,
                message: {
                  text: "Perfetto! Grazie!",
                  sender: "other",
                  ltr: true,
                },
              })
            );
            this.messageIsSent = true;
          }
        }
      } else {
        if (this.leftFilled) {
          this.leftFilled = false;
          this.drawLeftUnderline(false);
          this.tower.setTexture("tower");
        }
      }
    }
  }

  // Helper to draw left underline, filled or not
  drawLeftUnderline(filled: boolean) {
    this.leftGraphics.clear();
    const x = this.leftUnderlineX;
    const y = this.underlineY;
    const w = this.underlineWidth;
    const h = this.underlineHeight;
    const stripeGap = 10;
    if (filled) {
      this.leftGraphics.fillStyle(0xffffff, 1);
      this.leftGraphics.fillRect(x - w / 2, y - h / 2, w, h);
    }
    this.leftGraphics.lineStyle(3, 0xffffff, 1);
    for (let dx = -w / 2; dx < w / 2; dx += stripeGap * 2) {
      this.leftGraphics.beginPath();
      this.leftGraphics.moveTo(x + dx, y - h / 2);
      this.leftGraphics.lineTo(x + dx + stripeGap, y - h / 2);
      this.leftGraphics.strokePath();
      this.leftGraphics.beginPath();
      this.leftGraphics.moveTo(x + dx, y + h / 2);
      this.leftGraphics.lineTo(x + dx + stripeGap, y + h / 2);
      this.leftGraphics.strokePath();
    }
    for (let dy = -h / 2; dy < h / 2; dy += stripeGap * 2) {
      this.leftGraphics.beginPath();
      this.leftGraphics.moveTo(x - w / 2, y + dy);
      this.leftGraphics.lineTo(x - w / 2, y + dy + stripeGap);
      this.leftGraphics.strokePath();
      this.leftGraphics.beginPath();
      this.leftGraphics.moveTo(x + w / 2, y + dy);
      this.leftGraphics.lineTo(x + w / 2, y + dy + stripeGap);
      this.leftGraphics.strokePath();
    }
  }
}
