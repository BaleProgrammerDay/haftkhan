import { Physics, Scene, Types } from "phaser";

export default class Player extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.createAnimations();
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.body!.setSize(150, 300);
        this.body!.setOffset(250, 300);
    }

    createAnimations() {
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers("run", {
                start: 0,
                end: 32,
            }),
            frameRate: 24,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("idle", {
                start: 0,
                end: 98,
            }),
            frameRate: 24,
            repeat: -1,
        });
    }

    handleInput(cursors: Types.Input.Keyboard.CursorKeys) {
        if (cursors.left.isDown) {
            this.setVelocityX(-300);
            this.play("run", true);
            this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(300);
            this.play("run", true);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
            this.play("idle", true);
        }
    }
}
