import { GameObjects, Scene, Types } from "phaser";
import Rostam from "../characters/Rostam";
import Door from "../objects/Door";

export class PixelArtScene extends Scene {
    background: GameObjects.Image;
    player: Rostam;
    cursors: Types.Input.Keyboard.CursorKeys;
    door: Door;

    constructor() {
        super("PixelArtScene");
    }

    create() {
        const { width, height } = this.scale;
        this.door = new Door(this, 400, height, "door");
        this.door.setY(this.door.y - this.door.height / 2);
        this.door.body?.updateFromGameObject();
        this.player = new Rostam(this, 250, height, "rostam");
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.add
            .text(
                this.door.x,
                this.door.y - this.door.height / 2 - 20,
                "فروتنی",
                {
                    font: "20px sorena",
                    color: "#ffffff",
                }
            )
            .setOrigin(0.5, 1);
        this.physics.add.overlap(this.player, this.door, this.onPressurePlate);
    }

    onPressurePlate(player: any, door: any) {
        door.isActivate = true;
    }

    update() {
        if (this.door.isActivate) {
            this.door.setTint(0x00ff00);
            this.door.isActivate = false;
        } else {
            this.door.setTint(0xffffff);
        }
        this.player.handleInput(this.cursors);
    }
}
