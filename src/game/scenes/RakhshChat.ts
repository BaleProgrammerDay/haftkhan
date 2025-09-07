import { Scene, Types } from "phaser";
import Rakhsh from "../characters/Rakhsh";
import { EventBus } from "../EventBus";

export class RakhshChat extends Scene {
    rakhsh: Rakhsh;
    cursors: Types.Input.Keyboard.CursorKeys;

    changeScene(scene: string) {
        this.scene.start(scene);
    }

    constructor() {
        super("RakhshChat");
    }

    create() {
        const { width, height } = this.scale;
        this.rakhsh = new Rakhsh(this, 100, height, "rakhsh");
        this.cursors = this.input.keyboard!.createCursorKeys();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.rakhsh.handleInput(this.cursors);
    }
}
