import { Physics, Scene, Types } from "phaser";

export default class Rostam extends Physics.Arcade.Sprite {
    private _jumpPressed: boolean = false;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.createAnimations();
        // this.setBounce(0.2);
        this.setScale(1.5);
        this.setCollideWorldBounds(true);
        this.body!.setSize(40, 50, false);
        this.body?.setOffset(10, 10);
        this._jumpPressed = false;
    }

    resetOffset() {
        this.body?.setOffset(0, -20);
    }

    createAnimations() {
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers("rostam_walk", {
                start: 0,
                end: 6,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("rostam_walk", {
                start: 0,
                end: 6,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("rostam_jump", {
                start: 0,
                end: 6,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("rostam_idle", {
                start: 0,
                end: 4,
            }),
            frameRate: 8,
            repeat: -1,
        });
    }

    handleInput(cursors: Types.Input.Keyboard.CursorKeys) {
        // Only allow jump if player is on the ground
        const isOnGround = (this.body as Physics.Arcade.Body).blocked.down;
        if (!cursors.up.isDown) {
            this._jumpPressed = false;
            if (isOnGround) {
                // this.resetOffset();
            }
        }
        if (cursors.left.isDown) {
            this.setVelocityX(-150);
            this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(150);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        // Jump only if up is pressed, player is on ground, and jump wasn't already triggered
        if (cursors.up.isDown && isOnGround && !this._jumpPressed) {
            this.setVelocityY(-800);
            // this.body?.setOffset(100, -10);
            this._jumpPressed = true;
        }

        // Animation logic
        if (!isOnGround) {
            this.play("jump", true);
        } else if (cursors.left.isDown || cursors.right.isDown) {
            this.play("walk", true);
        } else {
            this.play("idle", true);
        }
    }
}
