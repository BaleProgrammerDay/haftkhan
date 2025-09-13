export default class ElectricityParticle extends Phaser.GameObjects.Particles.ParticleEmitter {
	soundFX: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
	soundPosition: Phaser.Math.Vector2;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(
			scene,
			x,
			y,
			'lightning_particle',
            {
                frame: [0, 1, 2, 3, 4, 5, 6, 7], // Use all available frames from the spritesheet for animation
                blendMode: "ADD",
                scale: 1.5,
                moveToX: {random: true, min: -25, max: 25},
                moveToY: {random: true, min: -25, max: 25},
                rotate: 90,
                alpha: { start: 0.8, end: 0 },
                lifespan: 300,
                frequency: 80,
            }
		);

		scene.add.existing(this);
		this.soundFX = this.scene.sound.add('recharge', { loop: true, volume: 0.5 });
		this.soundPosition = new Phaser.Math.Vector2(x, y);
		this.soundFX.play();
	}
	
	updateDistance(playerX: number, playerY: number) {
		if (!this.visible && this.soundFX.isPlaying) {
			this.soundFX.stop();
		}
		  const playerPos = new Phaser.Math.Vector2(playerX, playerY);
		const distance = Phaser.Math.Distance.BetweenPoints(this.soundPosition, playerPos);
		const maxDistance = 350;

		let volume = Phaser.Math.Clamp(1 - (distance / maxDistance ), 0, 0.1);
		let pan = Phaser.Math.Clamp((this.soundPosition.x - playerPos.x) / maxDistance, -1, 1);

		this.soundFX.setVolume(volume);
		this.soundFX.setPan(pan);
	}
}