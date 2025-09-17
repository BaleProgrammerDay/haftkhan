import { Scene, Types } from "phaser";
import Rostam from "../characters/Rostam";
import Door from "../objects/Door";
import Box from "../objects/Box";
import { EventBus } from "../EventBus";
import { store } from "~/store/store";
import { addMessage } from "~/store/chat/chat.slice";
import { Chats } from "../../messenger/types/Chat";
import { powerOutage } from "../scenarios/powerOutage";
import { API } from "~/api/api";
import { hashStringToNumber } from "../utils";

export class TeamPlayer extends Scene {
  rostam: Rostam;
  cursors: Types.Input.Keyboard.CursorKeys;
  doors: Door[] = [];
  boxes: Box[] = [];
  transparentPlatform: Phaser.Physics.Arcade.StaticGroup;
  allActivated: boolean;
  messageIsSent: boolean;

  onEnterDoor(player: any, door: any) {
    door.isActivate = true;
  }
  onExitDoor(player: any, door: any) {
    door.isActivate = false;
  }

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  constructor() {
    super("TeamPlayer");
  }

  create() {
    this.boxes = [];
    this.doors = [];
    //@ts-ignore
    this.transparentPlatform = undefined;

    const { width, height } = this.scale;

    const doorData = [
      { x: 300, label: "فروتنی" },
      { x: 500, label: "هوشمندی" },
      { x: 700, label: "ولع" },
    ];

    this.doors = doorData.map(({ x, label }) => {
      const door = new Door(this, x, height, "door");
      door.setY(door.y - door.height / 2);
      door.body?.updateFromGameObject();
      this.add
        .text(door.x, door.y - door.height / 2 - 20, label, {
          fontFamily: "sorena",
          fontSize: "20px",
          color: "#ffffff",
        })
        .setOrigin(0.5, 1);
      return door;
    });

    // Add a transparent static object to match #message-3
    const msgElem = document.getElementById("message-3");
    if (msgElem && this.game && this.game.canvas) {
      const rect = msgElem.getBoundingClientRect();
      // Convert DOM coordinates to Phaser world coordinates
      const gameRect = this.game.canvas.getBoundingClientRect();
      const x = rect.left - gameRect.left + rect.width / 2;
      const y = rect.top - gameRect.top + rect.height / 2;
      const widthRect = rect.width;
      const heightRect = rect.height;
      this.transparentPlatform = this.physics.add.staticGroup();
      const platform = this.add.rectangle(
        x,
        y,
        widthRect,
        heightRect,
        0x000000,
        0
      );
      this.transparentPlatform.add(platform);
      EventBus.on("deleted", () => {
        if (this.transparentPlatform)
          this.transparentPlatform.clear(true, true);
      });
      // Observe DOM for removal of #message-3 and remove platform
    }

    this.boxes.push(new Box(this, 400, height, "box"));

    if (
      msgElem &&
      this.transparentPlatform &&
      this.transparentPlatform.getChildren() &&
      this.transparentPlatform.getChildren().length > 0
    ) {
      const platformChild =
        this.transparentPlatform.getChildren()[0] as Phaser.GameObjects.Rectangle;

      this.boxes.push(
        new Box(this, 100, platformChild.y - platformChild.height - 20, "box")
      );
    } else {
      // Fallback position if transparentPlatform doesn't exist
      this.boxes.push(new Box(this, 100, height, "box"));
    }

    this.rostam = new Rostam(this, 250, height, "rostam");
    this.cursors = this.input.keyboard!.createCursorKeys();
    let t: any = null;
    this.boxes.forEach((box) => {
      this.physics.add.collider(this.rostam, box, (rostam: any, box: any) => {
        if (t) clearTimeout(t);
        rostam.isPushing = true;
        t = setTimeout(() => {
          rostam.isPushing = false;
        }, 100);
      });
    });

    if (this.boxes[1].body)
      (this.boxes[1].body as Phaser.Physics.Arcade.Body).allowGravity = false;

    // Only add colliders if transparentPlatform exists
    if (this.transparentPlatform) {
      this.physics.add.collider(this.rostam, this.transparentPlatform);
      this.physics.add.collider(this.boxes[1], this.transparentPlatform);
      if (this.boxes[1].body)
        (this.boxes[1].body as Phaser.Physics.Arcade.Body).allowGravity = true;
    }

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    // this.rostam.isPushing = false;
    this.allActivated = true;
    this.doors.forEach((door) => {
      if (
        this.physics.overlap(this.rostam, door) ||
        this.physics.overlap(this.boxes[0], door) ||
        this.physics.overlap(this.boxes[1], door)
      ) {
        door.isActivate = true;
        door.setTint(0x00ff00);
      } else {
        door.isActivate = false;
        this.allActivated = false;
        door.setTint(0xffffff);
      }
    });
    if (this.allActivated && !this.messageIsSent) {
      // window.dispatchEvent(new Event("allDoorsActivated"));
      store.dispatch(
        addMessage({
          chatId: Chats.TeamPlayer,
          message: {
            text: "تو استخدامی!",
            sender: "other",
            type: "text",
          },
        })
      );
      //todo
      API.submitAnswer({
        question_id: hashStringToNumber(this.scene.key),
        answer: hashStringToNumber(
          this.scene.key.split("").reverse().join("")
        ).toString(),
      }).then(() => {});
      this.messageIsSent = true;
      setTimeout(() => {
        powerOutage();
      }, 1000);
    }
    this.rostam.handleInput(this.cursors);
  }
}
