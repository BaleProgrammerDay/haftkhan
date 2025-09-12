import { Physics, Scene } from "phaser";

export default class PowerGenerator extends Physics.Arcade.Image {
    isActivate: boolean;
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "power_gen");
		this.setScale(0.5)
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.isActivate = false;
    }
}
