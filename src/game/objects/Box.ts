import { Physics, Scene } from "phaser";

export default class Box extends Physics.Arcade.Image {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        (this.body as Physics.Arcade.Body).setSlideFactor(0, 0);
    }
}
