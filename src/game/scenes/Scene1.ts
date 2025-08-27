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
        this.background = this.add.image(512, 384, "bg");
        this.player = new Player(this, 250, this.scale.height, "samurai");
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        this.player.handleInput(this.cursors);
    }
}
