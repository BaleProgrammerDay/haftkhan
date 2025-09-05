import { GameObjects, Scene, Types } from "phaser";
import Rostam from "../characters/Rostam";

export class PixelArtScene extends Scene {
    background: GameObjects.Image;
    player: Rostam;
    cursors: Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("PixelArtScene");
    }

    create() {
        const { width, height } = this.scale;
        this.player = new Rostam(this, 250, height, "rostam");
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        this.player.handleInput(this.cursors);
    }
}
