import { GameObjects, Scene } from "phaser";

export class Scene1 extends Scene {
    background: GameObjects.Image;

    constructor() {
        super("Scene1");
    }

    create() {
        this.background = this.add.image(512, 384, "bg");
    }
}
