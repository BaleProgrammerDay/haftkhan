# Phaser Progress Bar Component

A simple, customizable progress bar component for Phaser 3 games.

## Features

- ✅ Simple to use and integrate
- ✅ Customizable colors that change based on progress
- ✅ Smooth animations
- ✅ Percentage text display
- ✅ Scene control methods
- ✅ Show/hide functionality
- ✅ Position and depth control

## Quick Start

### 1. Import the ProgressBar

```typescript
import ProgressBar from '../ui/ProgressBar';
```

### 2. Create a Progress Bar in your Scene

```typescript
export class YourScene extends Scene {
    private progressBar!: ProgressBar;

    create() {
        // Create progress bar (x, y, width, height)
        this.progressBar = new ProgressBar(this, 100, 50, 300, 25);
        
        // Set initial progress (0-100)
        this.progressBar.setProgress(50);
    }
}
```

## API Reference

### Constructor
```typescript
new ProgressBar(scene: Scene, x: number, y: number, width?: number, height?: number)
```

### Methods

#### Progress Control
- `setProgress(value: number)` - Set progress value (0 to max)
- `getProgress(): number` - Get current progress value
- `setMaxProgress(value: number)` - Set maximum progress value (default: 100)
- `incrementProgress(amount: number = 1)` - Increase progress by amount
- `decrementProgress(amount: number = 1)` - Decrease progress by amount

#### Animation
- `animateToProgress(targetProgress: number, duration: number = 1000)` - Smoothly animate to target progress

#### Visual Control
- `setVisible(visible: boolean)` - Show/hide the progress bar
- `isVisible(): boolean` - Check if progress bar is visible
- `setPosition(x: number, y: number)` - Move the progress bar
- `setDepth(depth: number)` - Set rendering depth/layer

#### Cleanup
- `destroy()` - Clean up and remove the progress bar

## Examples

### Basic Usage
```typescript
// Create progress bar
const progressBar = new ProgressBar(this, 100, 100, 400, 30);

// Set progress to 75%
progressBar.setProgress(75);

// Animate to 100% over 2 seconds
progressBar.animateToProgress(100, 2000);
```

### Game Integration
```typescript
export class GameScene extends Scene {
    private progressBar!: ProgressBar;
    private collectedItems: number = 0;
    private totalItems: number = 10;

    create() {
        this.progressBar = new ProgressBar(this, 50, 30, 300, 25);
        this.progressBar.setMaxProgress(this.totalItems);
        this.progressBar.setDepth(1000); // Render on top
    }

    collectItem() {
        this.collectedItems++;
        this.progressBar.setProgress(this.collectedItems);
        
        if (this.collectedItems >= this.totalItems) {
            console.log('All items collected!');
        }
    }
}
```

### Health/Energy Bar
```typescript
// Use as health bar
const healthBar = new ProgressBar(this, 20, 20, 200, 20);
healthBar.setMaxProgress(100); // 100 HP
healthBar.setProgress(80); // Current health

// Damage taken
healthBar.decrementProgress(20); // Take 20 damage

// Healing
healthBar.incrementProgress(10); // Heal 10 HP
```

## Color Scheme

The progress bar automatically changes colors based on progress:
- **Red**: 0-29% progress
- **Orange**: 30-69% progress  
- **Green**: 70-100% progress

## Notes

- The progress bar consists of multiple Phaser GameObjects (Graphics and Text)
- Remember to call `destroy()` when you no longer need the progress bar
- Use `setDepth()` to ensure the progress bar renders above other game elements
- All positions are in world coordinates, not screen coordinates
