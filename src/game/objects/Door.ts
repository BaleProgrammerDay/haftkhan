import { Physics, Scene } from "phaser";

export default class Door extends Physics.Arcade.Image {
    isActivate: boolean;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.isActivate = false;
    }
}
