# Phaser Interaction Helper UI System

This system provides a Phaser-based interaction helper component for displaying keyboard prompts and handling user input in games with full Persian RTL text support.

## Features

- 🎮 Support for keyboard key sprites or styled key buttons
- 🎨 Multiple visual variants (default, highlight, warning, success)
- ✨ Animation effects (pulse, bounce, fade, float)
- 📍 Flexible positioning (screen, world, or following game objects)
- ⚡ Easy-to-use preset prompts for common interactions
- 🔧 Highly customizable and extensible
- 🌐 Full Persian RTL text support with automatic detection
- 📏 Dynamic background sizing based on content length

## Basic Setup

```typescript
import Phaser from 'phaser';
import { PhaserInteractionHelper, PHASER_PRESET_PROMPTS } from './ui';

export class GameScene extends Phaser.Scene {
    private interactionHelper!: PhaserInteractionHelper;

    create() {
        // Create the interaction helper
        this.interactionHelper = new PhaserInteractionHelper(this, 0, 0, true);
        
        // Set up interaction callback
        this.interactionHelper.setOnInteractionCallback((promptId: string) => {
            this.handleInteraction(promptId);
        });

        // Add some prompts
        this.interactionHelper.addPrompt(PHASER_PRESET_PROMPTS.MOVE);
        this.interactionHelper.addPrompt(PHASER_PRESET_PROMPTS.INTERACT);
    }

    update() {
        // Update the interaction helper (important for following prompts)
        this.interactionHelper.update();
    }

    private handleInteraction(promptId: string) {
        switch (promptId) {
            case 'move':
                console.log('Player is moving!');
                break;
            case 'interact':
                console.log('Interaction triggered!');
                break;
        }
    }
}
```

## Following Game Objects

```typescript
import { createFollowingPrompt, PHASER_PRESET_PROMPTS } from './ui';

// Create a prompt that follows an NPC
const npcPrompt = createFollowingPrompt(
    PHASER_PRESET_PROMPTS.TALK,
    npcGameObject,
    { x: 0, y: -60 } // Offset from the NPC
);

this.interactionHelper.addPrompt(npcPrompt);
```

## Screen and World Positioning

```typescript
import { createScreenPrompt, createWorldPrompt } from './ui';

// Screen position (relative to camera)
const hudPrompt = createScreenPrompt(
    PHASER_PRESET_PROMPTS.PAUSE,
    100, // x position on screen
    50   // y position on screen
);

// World position (absolute world coordinates)
const worldPrompt = createWorldPrompt(
    PHASER_PRESET_PROMPTS.PICK_UP,
    400, // world x
    300  // world y
);

this.interactionHelper.addPrompt(hudPrompt);
this.interactionHelper.addPrompt(worldPrompt);
```

## Available Preset Prompts (Persian)

- `PHASER_PRESET_PROMPTS.MOVE` - "حرکت" - WASD movement
- `PHASER_PRESET_PROMPTS.INTERACT` - "تعامل" - E key interaction
- `PHASER_PRESET_PROMPTS.JUMP` - "پرش" - Spacebar jump
- `PHASER_PRESET_PROMPTS.RUN` - "نگه دارید برای دویدن" - Shift to run
- `PHASER_PRESET_PROMPTS.PAUSE` - "توقف" - Escape to pause
- `PHASER_PRESET_PROMPTS.PICK_UP` - "برداشتن" - F to pick up
- `PHASER_PRESET_PROMPTS.USE_ITEM` - "استفاده از وسیله" - Q to use item
- `PHASER_PRESET_PROMPTS.OPEN_INVENTORY` - "کیف" - I for inventory
- `PHASER_PRESET_PROMPTS.CROUCH` - "خمیدن" - Ctrl to crouch
- `PHASER_PRESET_PROMPTS.ATTACK` - "حمله" - F to attack
- `PHASER_PRESET_PROMPTS.TALK` - "صحبت کردن" - E to talk (with following behavior)
- `PHASER_PRESET_PROMPTS.EXAMINE` - "بررسی" - E to examine

## Persian RTL Support

The system automatically detects Persian text and applies RTL layout:

```typescript
// This will automatically be displayed RTL
const persianPrompt = createPhaserInteractionPrompt({
    id: "persian_action",
    text: "برای فراموشی آغاز کردن کلیک کنید", // Persian text
    keys: ["E"],
    variant: "highlight",
});

// This will be displayed LTR
const englishPrompt = createPhaserInteractionPrompt({
    id: "english_action",
    text: "Click to start forgetting", // English text
    keys: ["E"],
    variant: "highlight",
});
```

## Keyboard Key Mappings

Comprehensive keyboard mappings with Phaser key codes:

```typescript
// Available keys include:
PHASER_KEYBOARD_KEYS.W, PHASER_KEYBOARD_KEYS.A, PHASER_KEYBOARD_KEYS.S, PHASER_KEYBOARD_KEYS.D
PHASER_KEYBOARD_KEYS.SPACE, PHASER_KEYBOARD_KEYS.ENTER, PHASER_KEYBOARD_KEYS.ESC
PHASER_KEYBOARD_KEYS.UP, PHASER_KEYBOARD_KEYS.DOWN, PHASER_KEYBOARD_KEYS.LEFT, PHASER_KEYBOARD_KEYS.RIGHT
PHASER_KEYBOARD_KEYS.SHIFT, PHASER_KEYBOARD_KEYS.CTRL, PHASER_KEYBOARD_KEYS.ALT
// ... and many more
```

## Styling Variants

- `default` - Standard white border
- `highlight` - Blue theme for important actions
- `warning` - Yellow theme for cautions
- `success` - Green theme for positive actions

## Animations

- `none` - No animation
- `pulse` - Gentle scaling effect
- `bounce` - Bouncing motion
- `fade` - Opacity fade effect
- `float` - Gentle vertical floating

## Advanced Features

### Auto-hide Prompts
```typescript
const temporaryPrompt = createPhaserInteractionPrompt({
    id: 'temp',
    text: 'اقدام سریع',
    keys: ['E'],
    autoHideTime: 3000, // Hide after 3 seconds
});
```

### Dynamic Updates
```typescript
// Update prompt properties
this.interactionHelper.updatePrompt('move', { 
    animation: 'bounce',
    variant: 'highlight' 
});

// Toggle prompt visibility
this.interactionHelper.setPromptActive('interact', false);
```

### Depth Control
```typescript
const priorityPrompt = createPhaserInteractionPrompt({
    id: 'priority',
    text: 'مهم!',
    keys: ['E'],
    depth: 2000, // Render on top
});
```

## Demo Scene

Check out `InteractionDemoScene.ts` for a complete example showing:
- Player movement with WASD
- Proximity-based interactions
- NPC dialog prompts
- Item collection
- Screen-based UI prompts

To use the demo:
```typescript
// Add to your Phaser game configuration
scene: [InteractionDemoScene]
```

## Requirements

- **Phaser version**: Phaser 3.60+
- **Keyboard sprites**: Place `keyboard-keys.png` in `/public/assets/`
- **Font**: Yekan Bakh font for proper Persian text rendering

## Tips

1. **Performance**: Use `setPromptActive()` instead of adding/removing prompts frequently
2. **Positioning**: World positions are better for in-game objects, screen positions for UI
3. **Animations**: Use sparingly to avoid visual clutter
4. **Following prompts**: Always call `update()` in your Phaser scene's update loop
5. **Cleanup**: Remember to destroy the PhaserInteractionHelper when changing scenes
6. **Persian text**: The system automatically detects and handles RTL layout for Persian text
7. **Message length**: Backgrounds automatically resize based on content length
