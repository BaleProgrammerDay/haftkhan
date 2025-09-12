import { Physics, Scene } from "phaser";

export default class Wrench extends Physics.Arcade.Image {
    isAttached: boolean = false;
    attachedTo: Physics.Arcade.Sprite | null = null;
    originalX: number;
    originalY: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "items/wrench");
        scene.add.existing(this);
        scene.physics.add.existing(this); // Start as static body (no gravity)
        this.setCollideWorldBounds(true);
        this.rotation = 0.8;
        this.originalX = x;
        this.originalY = y;
        
        // Set the origin to bottom center so it sits properly on the ground
        this.setOrigin(0.5, 1);
    }

    attachTo(target: Physics.Arcade.Sprite) {
        this.isAttached = true;
        this.attachedTo = target;
        this.rotation = -0.8;
        if (this.body) {
            this.body.enable = false;
        }
    }

    detach() {
        this.isAttached = false;
        this.attachedTo = null;
        this.rotation = 0.8;
        this.scene.physics.world.enable(this);
        if (this.body && 'setCollideWorldBounds' in this.body) {
            (this.body as Physics.Arcade.Body).setCollideWorldBounds(true);
            (this.body as Physics.Arcade.Body).setBounce(0.3);
        }
    }

    update() {
        if (this.isAttached && this.attachedTo) {
            this.x = this.attachedTo.x + (this.attachedTo.flipX ? 30 : -10); 
            this.y = this.attachedTo.y + 10;
        }
    }
}
