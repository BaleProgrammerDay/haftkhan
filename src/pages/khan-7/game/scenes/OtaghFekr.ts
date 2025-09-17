import { Scene, Types } from "phaser";
import { Chats } from "../../messenger/types/Chat";
import { EventBus } from "../EventBus";
import RedButton from "../objects/RedButton";
import Rostam from "../characters/Rostam";
import { store } from "~/store/store";
import { addMessage } from "~/store/chat/chat.slice";

export class OtaghFekr extends Scene {
  image: Phaser.GameObjects.Image;
  buttons: Phaser.GameObjects.Image[] = [];
  redButtons: RedButton[] = [];
  rostam: Rostam;
  cursors: Types.Input.Keyboard.CursorKeys;
  pressedButtons: boolean[] = [false, false, false, false];
  done: boolean = false;

  constructor() {
    super(Chats.OtaghFekr);
  }

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  create() {
    this.rostam = new Rostam(this, 250, this.scale.height, "rostam");
    this.cursors = this.input.keyboard!.createCursorKeys();

    const buttonSpacing = 60;
    const startX = this.scale.width - 200;
    for (let i = 0; i < 4; i++) {
      const redButton = new RedButton(
        this,
        startX + i * buttonSpacing,
        this.scale.height - 10
      );
      redButton.setScale(0.5);
      this.redButtons.push(redButton);
    }

    // Ensure Rostam is rendered above the buttons
    this.rostam.setDepth(100);

    EventBus.addListener("image-selected", (file: File) => {
      if (this.image) {
        this.image.destroy();
      }

      const url = URL.createObjectURL(file);
      this.load.image(file.name, url);
      this.load.once("complete", () => {
        this.image = this.add.image(this.scale.width - 150, 400, file.name);
        this.image.setScale(1);
        this.add.existing(this.image);
        this.physics.add.existing(this.image);
        this.image.setInteractive();
        if (this.image.body) {
          (this.image.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
            true
          );
        }
      });
      this.load.start();
    });
  }

  update() {
    this.redButtons.forEach((button, i) => {
      if (
        this.physics.overlap(this.rostam, button) ||
        (this.image !== undefined && this.physics.overlap(this.image, button))
      ) {
        button.setPressed(true);
        this.pressedButtons[i] = true;
      } else {
        button.setPressed(false);
        this.pressedButtons[i] = false;
      }
    });

    if (this.pressedButtons.every((pressed) => pressed) && !this.done) {
      this.done = true;
      store.dispatch(
        addMessage({
          chatId: Chats.OtaghFekr,
          message: {
            sender: "me",
            type: "text",
            text: "افتاد",
          },
        })
      );
      store.dispatch(
        addMessage({
          chatId: Chats.OtaghFekr,
          message: {
            sender: "حسام",
            type: "text",
            text: "بچه ها دکتر به من یه دارو داد برای حل این مشکل، شماره نسخش: 247568",
          },
        })
      );
    }

    this.rostam.handleInput(this.cursors);
  }

  destroy() {
    // Clean up red buttons
    this.redButtons.forEach((button) => {
      button.destroy();
    });
    this.redButtons = [];
  }
}

