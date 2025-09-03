import { Physics, Scene, Types } from "phaser";

export default class Player extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.createAnimations();
        this.setBounce(0.2);
        this.setScale(0.5);
        this.setCollideWorldBounds(true);
        this.body!.setSize(200, 600, false);
        this.body?.setOffset(0, -20);
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
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("walk", {
                start: 0,
                end: 8,
            }),
            frameRate: 13,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("idle", {
                start: 0,
                end: 0,
            }),
            frameRate: 13,
            repeat: -1,
        });
    }

    handleInput(cursors: Types.Input.Keyboard.CursorKeys) {
        if (cursors.left.isDown) {
            this.setVelocityX(-150);
            // this.play("run", true);
            this.play("walk", true);
            this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(150);
            // this.play("run", true);
            this.play("walk", true);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
            this.play("idle", true);
        }
    }
}
