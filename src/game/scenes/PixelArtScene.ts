import { GameObjects, Scene, Types } from "phaser";
import Rostam from "../characters/Rostam";
import Door from "../objects/Door";

export class PixelArtScene extends Scene {
    background: GameObjects.Image;
    player: Rostam;
    cursors: Types.Input.Keyboard.CursorKeys;
    doors: Door[] = [];

    constructor() {
        super("PixelArtScene");
    }

    create() {
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

        this.player = new Rostam(this, 250, height, "rostam");
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.doors.forEach((door) => {
            this.physics.add.overlap(this.player, door, this.onPressurePlate);
        });
    }

    onPressurePlate(player: any, door: any) {
        door.isActivate = true;
    }

    update() {
        this.doors.forEach((door) => {
            if (door.isActivate) {
                door.setTint(0x00ff00);
                door.isActivate = false;
            } else {
                door.setTint(0xffffff);
            }
        });
        this.player.handleInput(this.cursors);
    }
}
