import { GameObjects, Scene, Types } from "phaser";
import Player from "../characters/Player";

export class Scene1 extends Scene {
    background: GameObjects.Image;
    player: Player;
    cursors: Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("Scene1");
    }

    create() {
        const { width, height } = this.scale;

        this.background = this.add.image(width / 2, height / 2, "bg");
        this.background.setOrigin(0.5, 0.5);
        this.background.displayWidth = width;
        this.background.displayHeight = height;

        this.player = new Player(this, 250, height, "samurai");
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        this.player.handleInput(this.cursors);
    }
}
