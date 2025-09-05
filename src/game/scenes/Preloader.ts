import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");
        this.load.image("door", "door.png");

        this.load.image("bg", "background.png");
        this.load.image("samurai", "run.png");
        this.load.spritesheet("run", "run.png", {
            frameWidth: 600,
            frameHeight: 600,
        });
        this.load.spritesheet("walk", "walk.png", {
            frameWidth: 200,
            frameHeight: 600,
        });
        this.load.image("rostam", "rostam_idle.png");
        this.load.spritesheet("rostam_walk", "rostam_walk.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rostam_idle", "rostam_idle.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("rostam_jump", "rostam_jump.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("idle", "idle.png", {
            frameWidth: 200,
            frameHeight: 600,
        });
        this.load.spritesheet("jump", "jump.png", {
            frameWidth: 400,
            frameHeight: 600,
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start("Scene1");
        this.scene.start("PixelArtScene");
    }
}
