import { Scene, Types, Input } from "phaser";
import { EventBus } from "../EventBus";
import PowerGenerator from "../objects/PowerGenerator";
import ElectricityParticle from "../Particles/ElectricityParticle";
import Rostam from "../characters/Rostam";
import Wrench from "../items/wrench";
import { createScreenPrompt, PHASER_KEYBOARD_KEYS, PhaserInteractionHelper, PhaserInteractionPrompt } from "../ui/interaction";
import { ProgressBar } from "../ui/progressbar";
import { powerRestore } from "../scenarios/powerOutage";

export class Barghman extends Scene {
    powerGenerator: PowerGenerator;
    particle: ElectricityParticle;
    rostam: Rostam;
    cursors: Types.Input.Keyboard.CursorKeys;
    wrench: Wrench;
    hKey: Input.Keyboard.Key;
    eKey: Input.Keyboard.Key;
    interactionHelper!: PhaserInteractionHelper;
    hudPrompt: PhaserInteractionPrompt
    progressBar: ProgressBar;
    taskProgress: number = 0;
    lastProgressUpdate: number = 0;
    done: boolean = false;

    constructor() {
        super("Barghman");
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }

    create() {
        const { width, height } = this.scale;
        
        this.powerGenerator = new PowerGenerator(this, width, height);
        this.powerGenerator.setY(this.powerGenerator.y - this.powerGenerator.height / 4);
        this.powerGenerator.setX(this.powerGenerator.x - this.powerGenerator.width / 4);
        this.powerGenerator.body?.updateFromGameObject();
        this.powerGenerator.setTint(0x686868);
        this.particle = new ElectricityParticle(
            this,
            this.powerGenerator.x - 170,
            this.powerGenerator.y + 20
        );
        
        this.interactionHelper = new PhaserInteractionHelper(this, 0, 0, true);
        this.progressBar = new ProgressBar(this, this.powerGenerator.width - 120, height - 200,width/4, 30);
        this.progressBar.setVisible(false);
        this.progressBar.setMaxProgress(100);

        this.wrench = new Wrench(this, 40, height); // Position at ground level with bottom origin
        

        this.rostam = new Rostam(this, 250, height, "rostam");
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.hKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.H);
        this.eKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.E);
        this.interactionHelper.addPrompt(createScreenPrompt(
            {
                id: 'holdh',
                active: false,
                keys: [PHASER_KEYBOARD_KEYS.H],
                text: 'را برای برداشتن آچار فرانسه نگه دارید',
                animation: "fade",
                variant: "highlight"
            },
            180,
            height - 120 
        ));
        this.interactionHelper.addPrompt(createScreenPrompt(
            {
                id: 'holdE',
                active: false,
                keys: [PHASER_KEYBOARD_KEYS.E],
                text: "را برای تعمیر ژنراتور نگه دارید",
                animation: "fade",
                variant: "highlight"
            },
            this.powerGenerator.width / 2,
            height - 120 
        ));
        
        this.physics.add.collider(this.rostam, this.powerGenerator);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.rostam.handleInput(this.cursors);
        this.particle.updateDistance(this.rostam.x, this.rostam.y);
        
        // Update wrench position if attached
        if (this.wrench.isAttached) {
            this.wrench.update();
        }
        
        this.handleWrenchInteraction();
        this.interactionHelper.update();
            // Update progress with animation
            // this.progressBar.animateToProgress(this.taskProgress, 800);
    }

    private handleWrenchInteraction() {
        if (this.done) return

        // Calculate distance between Rostam and wrench
        const distance = Phaser.Math.Distance.Between(
            this.rostam.x, this.rostam.y,
            this.wrench.x, this.wrench.y
        );

        const distanceWithGenerator = Phaser.Math.Distance.Between(
            this.rostam.x, this.rostam.y,
            this.powerGenerator.x, this.powerGenerator.y
        );

        if (distanceWithGenerator < 340 && distance < 60 && !this.wrench.isAttached) {
            if (this.eKey.isDown) {
                if(performance.now() - this.lastProgressUpdate > 1000) {
                    this.taskProgress += 10;
                    this.lastProgressUpdate = performance.now();
                }
                this.interactionHelper.setPromptActive('holdE', false);
                this.progressBar.setVisible(true)

                if (this.taskProgress >= 100) {
                    powerRestore(this.scene.key);
                    this.done = true;
                    this.particle.visible = false
                    this.progressBar.setVisible(false);
                    this.powerGenerator.setTint(0xFFFFFF);
                }
            } else {
                this.taskProgress = 0;
                this.lastProgressUpdate = 0;
                this.interactionHelper.setPromptActive('holdE', true);
                this.progressBar.setVisible(false)
            }
            this.progressBar.animateToProgress(this.taskProgress, 500);
        } else {
            this.interactionHelper.setPromptActive('holdE', false);
        }

        if (distance < 50 && (this.hKey.isDown)) {
            if (!this.wrench.isAttached) {
                this.wrench.attachTo(this.rostam);
                this.interactionHelper.setPromptActive('holdh', false);
            }
        } else if (this.wrench.isAttached) {
                this.wrench.detach();
                this.wrench.x = this.rostam.x + (this.rostam.flipX ? 30 : -30);
                this.wrench.y = this.rostam.y;
        } else {
            this.interactionHelper.setPromptActive('holdh', distanceWithGenerator > 340 && distance < 50);
        }
    }
}
