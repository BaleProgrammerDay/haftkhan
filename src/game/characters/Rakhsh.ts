import { Input, Physics, Scene, Types } from "phaser";

export default class Rakhsh extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.createAnimations();
        // this.setScale(1.5);
        this.setCollideWorldBounds(true);
        this.body!.setSize(60, 54, false);
        this.body?.setOffset(10, 10);
    }

    resetOffset() {
        this.body?.setOffset(0, -20);
    }

    createAnimations() {
        this.scene.anims.create({
            key: "rakhsh_walk",
            frames: this.scene.anims.generateFrameNumbers("rakhsh_walk", {
                start: 0,
                end: 8,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "rakhsh_idle",
            frames: this.scene.anims.generateFrameNumbers("rakhsh_idle", {
                start: 0,
                end: 8,
            }),
            frameRate: 8,
            repeat: -1,
        });
    }

    handleInput(cursors: Types.Input.Keyboard.CursorKeys) {
        if (cursors.left.isDown) {
            this.setVelocityX(-100);
            this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(100);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if (!this.body?.blocked.down) {
            this.play("jump", true);
        } else if (cursors.left.isDown || cursors.right.isDown) {
            this.play("rakhsh_walk", true);
        } else {
            this.play("rakhsh_idle", true);
        }
        if (Input.Keyboard.JustDown(cursors.up) && this.body?.blocked.down) {
            this.setVelocityY(-800);
        }
    }
}
