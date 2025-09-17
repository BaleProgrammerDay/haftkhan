import { Scene, Input } from "phaser";
import { EventBus } from "../EventBus";
import {
  createScreenPrompt,
  PHASER_KEYBOARD_KEYS,
  PhaserInteractionHelper,
  PhaserInteractionPrompt,
} from "../ui/interaction";
import RostamVehicle from "../characters/RostamVehicle";
import Obstacle from "../objects/Obstacle";
import { store } from "~/store/store";
import { addMessage } from "~/store/chat/chat.slice";
import { Chats } from "../../messenger/types/Chat";
import { hashStringToNumber } from "../utils";
import { API } from "~/api/api";

export class Parking extends Scene {
  rostamVehicle: RostamVehicle;
  spaceKey: Input.Keyboard.Key;
  interactionHelper!: PhaserInteractionHelper;
  hudPrompt: PhaserInteractionPrompt;
  done: boolean = false;
  obstacles: Phaser.Physics.Arcade.Group;
  obstacleSpawnTimer: Phaser.Time.TimerEvent;
  started: boolean = false;
  gameSpeed: number = -300;
  engineSound: Phaser.Sound.BaseSound;
  timerText: Phaser.GameObjects.Text;
  timerEvent: Phaser.Time.TimerEvent;

  constructor() {
    super("Parking");
  }

  changeScene(scene: string) {
    this.scene.start(scene);
  }

  create() {
    const { width, height } = this.scale;
    this.physics.world.setBounds(
      0,
      0,
      width,
      height,
      false,
      false,
      false,
      true
    );

    this.interactionHelper = new PhaserInteractionHelper(this, 0, 0, true);
    this.rostamVehicle = new RostamVehicle(this, 150, height);
    this.engineSound = this.sound.add("engine", { loop: true, volume: 0.5 });
    this.spaceKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.obstacles = this.physics.add.group();
    this.physics.add.collider(
      this.rostamVehicle,
      this.obstacles,
      this.hitObstacle,
      undefined,
      this
    );

    this.interactionHelper.addPrompt(
      createScreenPrompt(
        {
          id: "space",
          active: false,
          keys: [PHASER_KEYBOARD_KEYS.SPACE],
          text: "را برای شروع بازی فشار دهدید",
          animation: "fade",
          variant: "default",
        },
        width / 2,
        height / 2
      )
    );

    // Add timer text to the scene
    this.timerText = this.add.text(width / 2, 20, "01:00", {
      font: "20px Arial",
      color: "#ffffff",
    });

    // Initialize timer event (paused initially)
    this.timerEvent = this.time.addEvent({
      delay: 60000, // 1 minute
      callback: this.win,
      callbackScope: this,
      paused: true, // Start paused
    });

    // Update timer text every second
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimerText,
      callbackScope: this,
      loop: true,
    });

    EventBus.emit("current-scene-ready", this);
    // this.startGame();
  }

  updateTimerText() {
    if (this.timerEvent.paused || !this.started) {
      // Show full minute when game is not started or paused
      this.timerText.setText("01:00");
      return;
    }

    const remainingTime = Math.ceil(this.timerEvent.getRemainingSeconds());
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    this.timerText.setText(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  }

  startGame() {
    this.obstacles.clear(true, true);
    this.started = true;
    this.gameSpeed = 400;
    this.rostamVehicle.startMoving();
    this.engineSound.play();

    // Reset and start the timer
    this.timerEvent.reset({
      delay: 60000,
      callback: this.win,
      callbackScope: this,
    });
    this.timerEvent.paused = false;

    this.obstacleSpawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: false,
    });
  }

  stopGame() {
    this.gameSpeed = 0;
    this.started = true;
    this.rostamVehicle.setGravity(0, 0);
    this.rostamVehicle.stopMoving();
    this.rostamVehicle.setVelocity(0, 0);
    this.engineSound.stop();
    this.timerEvent.paused = true;
  }

  spawnObstacle() {
    if (!this.started) return;

    const obstacleTypes = ["cone", "traffic_light", "barrier", "airplane"];
    const randomType = Phaser.Math.RND.pick(obstacleTypes);
    const x = this.cameras.main.width + 100;
    const y = this.scale.height;

    const obstacle: Obstacle = new Obstacle(this, x, y, randomType);

    if (obstacle) {
      this.obstacles.add(obstacle);
      obstacle.applyPhysics();
    }

    this.obstacleSpawnTimer = this.time.addEvent({
      delay: randomType === "airplane" ? 4000 : Phaser.Math.Between(1500, 3000),
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: false,
    });
  }

  win() {
    API.submitAnswer({
      question_id: hashStringToNumber(this.scene.key),
      answer: hashStringToNumber(
        this.scene.key.split("").reverse().join("")
      ).toString(),
    }).then(() => {});
    this.stopGame();
    this.timerText.setText("00:00");
    this.interactionHelper.removePrompt("space"); // Remove specific prompt
    EventBus.emit("game-won");
    store.dispatch(
      addMessage({
        chatId: Chats.Parking,
        message: {
          sender: "me",
          text: "سلام، 8",
          type: "text",
        },
      })
    );
  }

  loose() {
    this.stopGame();
    this.obstacles.clear(true, true); // Clear all obstacles
    this.rostamVehicle.setPosition(150, this.scale.height); // Reset vehicle position
    this.started = false; // Set started to false to allow restart

    // Reset the timer
    this.timerText.setText("01:00");
    this.timerEvent.paused = true;

    this.interactionHelper.setPromptActive("space", true);
    this.interactionHelper.updatePrompt("space", {
      text: "باختی! برای شروع دوباره اسپیس رو بزن",
    });
    EventBus.emit("game-lost");
  }

  hitObstacle() {
    this.loose();
  }

  update() {
    if (!this.started) {
      this.interactionHelper.setPromptActive("space", true);

      if (this.spaceKey.isDown) {
        this.interactionHelper.setPromptActive("space", false);
        this.startGame();
      }
    }

    if (this.started) {
      this.rostamVehicle.handleInput(this.spaceKey);
      this.rostamVehicle.update();
      this.obstacles.children.each((obstacle) => {
        (obstacle as Obstacle).update(this.gameSpeed);
        (obstacle as Obstacle).checkBounds();
        return null;
      });
    }
    this.interactionHelper.update();
  }
}
