import { Scene } from 'phaser';
import ProgressBar from './ProgressBar';

/**
 * Example of how to integrate ProgressBar into your existing game scene
 */
export class GameSceneWithProgress extends Scene {
    private progressBar!: ProgressBar;
    private taskProgress: number = 0;
    private maxTasks: number = 5;

    constructor() {
        super('GameSceneWithProgress');
    }

    create() {
        // Create your regular game content here
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
        
        // Create progress bar in top area of screen
        this.progressBar = new ProgressBar(this, 50, 30, 700, 30);
        this.progressBar.setMaxProgress(this.maxTasks);
        this.progressBar.setDepth(1000); // Make sure it's on top
        
        // Add title
        this.add.text(400, 100, 'Game Progress Example', {
            fontSize: '24px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Add some example tasks/objectives
        this.createTasks();
    }

    private createTasks(): void {
        const tasks = [
            'Collect 10 coins',
            'Defeat 3 enemies', 
            'Find the key',
            'Open the door',
            'Reach the exit'
        ];

        tasks.forEach((task, index) => {
            const taskText = this.add.text(100, 200 + (index * 40), `${index + 1}. ${task}`, {
                fontSize: '18px',
                color: '#000000'
            });

            // Make tasks clickable for demo
            taskText.setInteractive();
            taskText.on('pointerdown', () => {
                this.completeTask(index + 1);
            });
        });

        this.add.text(400, 450, 'Click on tasks to complete them!', {
            fontSize: '16px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);
    }

    private completeTask(taskNumber: number): void {
        if (this.taskProgress < taskNumber) {
            this.taskProgress = taskNumber;
            
            // Update progress with animation
            this.progressBar.animateToProgress(this.taskProgress, 800);
            
            // Check if all tasks completed
            if (this.taskProgress >= this.maxTasks) {
                this.onAllTasksCompleted();
            }
        }
    }

    private onAllTasksCompleted(): void {
        // Show completion message
        const completionText = this.add.text(400, 500, 'All tasks completed! 🎉', {
            fontSize: '20px',
            color: '#00aa00',
            align: 'center'
        }).setOrigin(0.5);

        // Make it flash
        this.tweens.add({
            targets: completionText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    // Example of updating progress based on game events
    public updateProgressBy(amount: number): void {
        this.progressBar.incrementProgress(amount);
    }

    public setProgressValue(value: number): void {
        this.progressBar.setProgress(value);
    }

    public getProgressValue(): number {
        return this.progressBar.getProgress();
    }

    // Hide/show progress bar
    public hideProgressBar(): void {
        this.progressBar.setVisible(false);
    }

    public showProgressBar(): void {
        this.progressBar.setVisible(true);
    }
}
