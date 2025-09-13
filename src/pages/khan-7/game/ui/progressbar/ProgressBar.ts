import { Scene } from 'phaser';

export default class ProgressBar {
    private scene: Scene;
    private background: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;
    private border: Phaser.GameObjects.Graphics;
    private progressText: Phaser.GameObjects.Text;
    
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private currentProgress: number = 0;
    private maxProgress: number = 100;
    private visible: boolean = true;

    constructor(scene: Scene, x: number, y: number, width: number = 300, height: number = 20) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.createProgressBar();
    }

    private createProgressBar(): void {
        // Create background
        this.background = this.scene.add.graphics();
        this.background.fillStyle(0x222222);
        this.background.fillRect(this.x, this.y, this.width, this.height);

        // Create progress bar
        this.progressBar = this.scene.add.graphics();

        // Create border
        this.border = this.scene.add.graphics();
        this.border.lineStyle(2, 0x666666);
        this.border.strokeRect(this.x, this.y, this.width, this.height);

        // Create text
        this.progressText = this.scene.add.text(
            this.x + this.width / 2,
            this.y + this.height / 2,
            '0%',
            {
                fontSize: '14px',
                color: '#ffffff',
                align: 'center'
            }
        );
        this.progressText.setOrigin(0.5, 0.5);

        this.updateProgressBar();
    }

    private updateProgressBar(): void {
        // Clear previous progress
        this.progressBar.clear();

        // Calculate progress width
        const progressWidth = (this.currentProgress / this.maxProgress) * this.width;

        // Draw progress bar with gradient effect
        if (progressWidth > 0) {
            // Create gradient colors based on progress
            let color = 0x00ff00; // Green
            if (this.currentProgress < 30) {
                color = 0xff0000; // Red
            } else if (this.currentProgress < 70) {
                color = 0xffaa00; // Orange
            }

            this.progressBar.fillStyle(color);
            this.progressBar.fillRect(this.x + 1, this.y + 1, progressWidth - 2, this.height - 2);
        }

        // Update text
        const percentage = Math.round((this.currentProgress / this.maxProgress) * 100);
        this.progressText.setText(`${percentage}%`);
    }

    // Public methods for scene control
    setProgress(value: number): void {
        this.currentProgress = Math.max(0, Math.min(value, this.maxProgress));
        this.updateProgressBar();
    }

    getProgress(): number {
        return this.currentProgress;
    }

    setMaxProgress(value: number): void {
        this.maxProgress = Math.max(1, value);
        this.updateProgressBar();
    }

    incrementProgress(amount: number = 1): void {
        this.setProgress(this.currentProgress + amount);
    }

    decrementProgress(amount: number = 1): void {
        this.setProgress(this.currentProgress - amount);
    }

    setPosition(x: number, y: number): void {
        const deltaX = x - this.x;
        const deltaY = y - this.y;

        this.x = x;
        this.y = y;

        // Move all components
        this.background.x += deltaX;
        this.background.y += deltaY;
        this.progressBar.x += deltaX;
        this.progressBar.y += deltaY;
        this.border.x += deltaX;
        this.border.y += deltaY;
        this.progressText.x += deltaX;
        this.progressText.y += deltaY;

        this.recreateGraphics();
    }

    private recreateGraphics(): void {
        // Clear and redraw all graphics at new position
        this.background.clear();
        this.background.fillStyle(0x222222);
        this.background.fillRect(this.x, this.y, this.width, this.height);

        this.border.clear();
        this.border.lineStyle(2, 0x666666);
        this.border.strokeRect(this.x, this.y, this.width, this.height);

        this.updateProgressBar();
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
        this.background.setVisible(visible);
        this.progressBar.setVisible(visible);
        this.border.setVisible(visible);
        this.progressText.setVisible(visible);
    }

    isVisible(): boolean {
        return this.visible;
    }

    setDepth(depth: number): void {
        this.background.setDepth(depth);
        this.progressBar.setDepth(depth + 1);
        this.border.setDepth(depth + 2);
        this.progressText.setDepth(depth + 3);
    }

    // Animate progress change
    animateToProgress(targetProgress: number, duration: number = 1000): void {
        const startProgress = this.currentProgress;
        
        this.scene.tweens.add({
            targets: { progress: startProgress },
            progress: targetProgress,
            duration: duration,
            ease: 'Power2',
            onUpdate: (tween) => {
                const currentValue = tween.getValue();
                if (currentValue !== null) {
                    this.setProgress(currentValue);
                }
            }
        });
    }

    // Clean up when destroying
    destroy(): void {
        this.background.destroy();
        this.progressBar.destroy();
        this.border.destroy();
        this.progressText.destroy();
    }
}
