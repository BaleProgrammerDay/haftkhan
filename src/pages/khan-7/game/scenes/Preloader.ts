import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Chats } from "../../messenger/types/Chat";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("door", "door.png");
    this.load.image("box", "box.png");
    this.load.image("empty", "items/empty.png");
    this.load.image("rostam", "rostam_idle.png");
    this.load.spritesheet("rostam_walk", "rostam_walk.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("rostam_idle", "rostam_idle.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("rostam_jump", "rostam_jump.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("rostam_push", "rostam_push.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("rakhsh", "rakhsh_idle.png");
    this.load.spritesheet("rakhsh_idle", "rakhsh_idle.png", {
      frameWidth: 80,
      frameHeight: 64,
    });
    this.load.spritesheet("rakhsh_walk", "rakhsh_walk.png", {
      frameWidth: 80,
      frameHeight: 64,
    });
    this.load.spritesheet("lightning_particle", "particles/lightning.png", {
      frameWidth: 32,
      frameHeight: 22,
    });
    this.load.spritesheet("rostam_vehicle", "rostam/rostam_vehicle.png", {
      frameWidth: 330,
      frameHeight: 160,
    });
    this.load.spritesheet("hulk_transform", "spritesheets/hulk.png", {
      frameWidth: 384,
      frameHeight: 228,
    });
    this.load.spritesheet("hulk_idle", "spritesheets/hulk_idle.png", {
      frameWidth: 384,
      frameHeight: 228,
    });
    this.load.spritesheet("red_button", "buttons.png", {
      frameWidth: 63.5,
      frameHeight: 43,
    });

    this.load.image("items/wrench", "items/wrench.png");
    this.load.image("power_gen", "general/power_gen.png");
    this.load.image("tower", "general/tower.png");
    this.load.image("tower_straight", "general/tower_straight.png");
    this.load.audio("recharge", "sounds/recharge.wav");
    this.load.image("bruce", "characters/bruce.png");
    this.load.image("star", "particles/star.png");
    // this.load.image('keyboard-keys', '/keyboard-keys.png');

    // Parking scene assets
    this.load.image("airplane", "items/airplane.png");
    this.load.image("cone", "items/traffic/cone.png");
    this.load.image("traffic_light", "items/traffic/traffic_light.png");
    this.load.image("barrier", "items/traffic/barrier.png");

    // Audio
    this.load.audio("recharge", "sounds/recharge.wav");
    this.load.audio("engine", "sounds/engine.mp3");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start(Chats.Olad);
  }
}
