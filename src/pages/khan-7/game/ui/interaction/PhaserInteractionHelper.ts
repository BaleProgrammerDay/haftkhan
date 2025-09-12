import Phaser from "phaser";

export interface PhaserKeyboardKey {
    /** The Phaser key code (e.g., Phaser.Input.Keyboard.KeyCodes.W) */
    keyCode: number;
    /** Display name for the key */
    displayName: string;
    /** Position in the keyboard sprite sheet */
    spritePosition?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Custom display text if different from displayName */
    displayText?: string;
}

export interface PhaserInteractionPrompt {
    /** Unique identifier for the interaction */
    id: string;
    /** Text to display alongside the key(s) */
    text: string;
    /** Key or combination of keys required */
    keys: PhaserKeyboardKey[];
    /** Position in world coordinates */
    worldPosition?: {
        x: number;
        y: number;
    };
    /** Position relative to camera (screen coordinates) */
    screenPosition?: {
        x: number;
        y: number;
    };
    /** Whether the prompt is currently active/visible */
    active: boolean;
    /** Visual style variant */
    variant?: "default" | "highlight" | "warning" | "success";
    /** Animation style */
    animation?: "none" | "pulse" | "bounce" | "fade" | "float";
    /** Follow a specific game object */
    followTarget?: Phaser.GameObjects.GameObject;
    /** Offset from follow target */
    followOffset?: { x: number; y: number };
    /** Auto-hide after time (in milliseconds) */
    autoHideTime?: number;
    /** Depth/z-index for rendering order */
    depth?: number;
}

export class PhaserInteractionHelper extends Phaser.GameObjects.Container {
    private prompts: Map<string, PhaserInteractionPrompt> = new Map();
    private promptDisplays: Map<string, Phaser.GameObjects.Container> = new Map();
    private useKeySprites: boolean;
    private onInteractionCallback?: (promptId: string) => void;
    private keyMap: Map<number, Phaser.Input.Keyboard.Key> = new Map();

    constructor(
        scene: Phaser.Scene,
        x: number = 0,
        y: number = 0,
        useKeySprites: boolean = true
    ) {
        super(scene, x, y);
        
        this.useKeySprites = useKeySprites;
        this.scene.add.existing(this);
        this.setDepth(1000); // High depth to render on top
        
        // Setup keyboard input
        this.setupKeyboardInput();
        
        // Load keyboard sprite if needed
        // if (useKeySprites) {
        //     this.loadKeyboardSprite();
        // }
    }

    private setupKeyboardInput(): void {
        // Setup common keys
        const commonKeys = [
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,
            Phaser.Input.Keyboard.KeyCodes.E,
            Phaser.Input.Keyboard.KeyCodes.F,
            Phaser.Input.Keyboard.KeyCodes.Q,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.SHIFT,
            Phaser.Input.Keyboard.KeyCodes.CTRL,
            Phaser.Input.Keyboard.KeyCodes.ESC,
            Phaser.Input.Keyboard.KeyCodes.ENTER,
            Phaser.Input.Keyboard.KeyCodes.I,
        ];

        commonKeys.forEach(keyCode => {
            const key = this.scene.input.keyboard?.addKey(keyCode);
            if (key) {
                this.keyMap.set(keyCode, key);
                key.on('down', () => this.handleKeyPress(keyCode));
            }
        });
    }

    private isPersianText(text: string): boolean {
        // Persian Unicode ranges: 0x0600-0x06FF (Arabic/Persian), 0xFB50-0xFDFF (Arabic Presentation Forms-A), 0xFE70-0xFEFF (Arabic Presentation Forms-B)
        const persianRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return persianRegex.test(text);
    }

    // private loadKeyboardSprite(): void {
    //     // Check if keyboard sprite is already loaded
    //     if (!this.scene.textures.exists('keyboard-keys')) {
    //         this.scene.load.image('keyboard-keys', '/assets/keyboard-keys.png');
    //         this.scene.load.start();
    //     }
    // }

    private handleKeyPress(keyCode: number): void {
        // Find matching prompts
        const matchingPrompts = Array.from(this.prompts.values()).filter(prompt =>
            prompt.active && prompt.keys.some(keyInfo => keyInfo.keyCode === keyCode)
        );

        matchingPrompts.forEach(prompt => {
            if (this.onInteractionCallback) {
                this.onInteractionCallback(prompt.id);
            }
        });
    }

    public addPrompt(prompt: PhaserInteractionPrompt): void {
        this.prompts.set(prompt.id, prompt);
        if (prompt.active) {
            this.createPromptDisplay(prompt);
        }
    }

    public removePrompt(promptId: string): void {
        this.prompts.delete(promptId);
        this.destroyPromptDisplay(promptId);
    }

    public updatePrompt(promptId: string, updates: Partial<PhaserInteractionPrompt>): void {
        const prompt = this.prompts.get(promptId);
        if (prompt) {
            Object.assign(prompt, updates);
            
            if (prompt.active) {
                this.destroyPromptDisplay(promptId);
                this.createPromptDisplay(prompt);
            } else {
                this.destroyPromptDisplay(promptId);
            }
        }
    }

    public setPromptActive(promptId: string, active: boolean): void {
        this.updatePrompt(promptId, { active });
    }

    public setOnInteractionCallback(callback: (promptId: string) => void): void {
        this.onInteractionCallback = callback;
    }

    private createPromptDisplay(prompt: PhaserInteractionPrompt): void {
        const container = this.scene.add.container(0, 0);
        
        // Detect if text is Persian/RTL
        const isPersianText = this.isPersianText(prompt.text);
        
        // Create background (will be resized later based on content)
        const background = this.scene.add.graphics();
        container.add(background);

        // Create keys display
        const keysContainer = this.scene.add.container(0, 0);
        let keyX = isPersianText ? 120 : -80; // Start from right for RTL
        const keyDirection = isPersianText ? -1 : 1; // Direction multiplier

        prompt.keys.forEach((keyInfo, index) => {
            if (index > 0) {
                // Add separator
                const separator = this.scene.add.text(keyX, 0, '+', {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: 'Yekan Bakh, Arial',
                }).setOrigin(0.5);
                keysContainer.add(separator);
                keyX += 20 * keyDirection;
            }

            // Create key display
            const keyDisplay = this.createKeyDisplay(keyInfo);
            keyDisplay.setPosition(keyX, 0);
            keysContainer.add(keyDisplay);
            keyX += isPersianText ? -10 : 40;
        });

        container.add(keysContainer);

        // Create prompt text with proper RTL support
        const promptText = this.scene.add.text(
            isPersianText ? keyX - 20 : keyX + 20, 
            0, 
            prompt.text, 
            {
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: 'Yekan Bakh, Arial',
                stroke: '#000000',
                strokeThickness: 2,
                rtl: isPersianText,
                align: isPersianText ? 'right' : 'left',
                wordWrap: { width: 200, useAdvancedWrap: true },
                maxLines: 2,
            }
        ).setOrigin(isPersianText ? 1 : 0, 0.5);
        container.add(promptText);

        // Calculate proper background size based on content
        const totalWidth = Math.max(
            Math.abs(keyX) + promptText.width + 40,
            200 // Minimum width
        );
        
        // Create background with proper size
        this.createBackground(background, prompt.variant || 'default', totalWidth);

        // Position the container
        this.positionPromptContainer(container, prompt);

        // Set depth
        container.setDepth(prompt.depth || 1000);

        // Add animations
        this.addPromptAnimations(container, prompt.animation || 'none');

        // Auto-hide if specified
        if (prompt.autoHideTime) {
            this.scene.time.delayedCall(prompt.autoHideTime, () => {
                this.removePrompt(prompt.id);
            });
        }

        this.promptDisplays.set(prompt.id, container);
        this.add(container);
    }

    private createBackground(graphics: Phaser.GameObjects.Graphics, variant: string, customWidth?: number): void {
        graphics.clear();
        
        const width = customWidth || 200;
        const height = 40;
        const radius = 8;

        // Background colors by variant
        const colors = {
            default: { bg: 0x000000, border: 0xffffff },
            highlight: { bg: 0x007bff, border: 0x0056b3 },
            warning: { bg: 0xffc107, border: 0xe0a800 },
            success: { bg: 0x28a745, border: 0x1e7e34 },
        };

        const color = colors[variant as keyof typeof colors] || colors.default;

        // Draw background with rounded corners
        graphics.fillStyle(color.bg, 0.8);
        graphics.fillRoundedRect(-width/2, -height/2, width, height, radius);
        
        // Draw border
        graphics.lineStyle(2, color.border, 1);
        graphics.strokeRoundedRect(-width/2, -height/2, width, height, radius);
    }

    private createKeyDisplay(keyInfo: PhaserKeyboardKey): Phaser.GameObjects.Container {
        const container = this.scene.add.container(0, 0);

        // if (this.useKeySprites && keyInfo.spritePosition && this.scene.textures.exists('keyboard-keys')) {
        //     // Use sprite
        //     const sprite = this.scene.add.image(0, 0, 'keyboard-keys');
        //     sprite.setCrop(
        //         keyInfo.spritePosition.x,
        //         keyInfo.spritePosition.y,
        //         keyInfo.spritePosition.width,
        //         keyInfo.spritePosition.height
        //     );
        //     sprite.setDisplaySize(32, 32);
        //     container.add(sprite);
        // } else {
            // Create key button graphic
            const keyButton = this.scene.add.graphics();
            keyButton.fillStyle(0x4a4a4a);
            keyButton.fillRoundedRect(-16, -16, 32, 32, 4);
            keyButton.lineStyle(1, 0x666666);
            keyButton.strokeRoundedRect(-16, -16, 32, 32, 4);
            container.add(keyButton);
        // }

        // Add key text
        const displayText = keyInfo.displayText || keyInfo.displayName;
        const keyText = this.scene.add.text(0, 0, displayText, {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Yekan Bakh, Arial',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        container.add(keyText);

        return container;
    }

    private positionPromptContainer(container: Phaser.GameObjects.Container, prompt: PhaserInteractionPrompt): void {
        if (prompt.followTarget) {
            // Position relative to target with offset
            const target = prompt.followTarget as any;
            const offsetX = prompt.followOffset?.x || 0;
            const offsetY = prompt.followOffset?.y || -50; // Default above target
            container.setPosition(target.x + offsetX, target.y + offsetY);
        } else if (prompt.worldPosition) {
            container.setPosition(prompt.worldPosition.x, prompt.worldPosition.y);
        } else if (prompt.screenPosition) {
            // Convert screen position to world position
            const camera = this.scene.cameras.main;
            const worldX = prompt.screenPosition.x + camera.scrollX;
            const worldY = prompt.screenPosition.y + camera.scrollY;
            container.setPosition(worldX, worldY);
        }
    }

    private addPromptAnimations(container: Phaser.GameObjects.Container, animation: string): void {
        switch (animation) {
            case 'pulse':
                this.scene.tweens.add({
                    targets: container,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });
                break;

            case 'bounce':
                this.scene.tweens.add({
                    targets: container,
                    y: container.y - 10,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Bounce.easeOut',
                });
                break;

            case 'fade':
                this.scene.tweens.add({
                    targets: container,
                    alpha: 0.6,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });
                break;

            case 'float':
                this.scene.tweens.add({
                    targets: container,
                    y: container.y - 5,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });
                break;
        }
    }

    private destroyPromptDisplay(promptId: string): void {
        const display = this.promptDisplays.get(promptId);
        if (display) {
            display.destroy();
            this.promptDisplays.delete(promptId);
        }
    }

    public update(): void {
        // Update prompt positions for following targets
        this.prompts.forEach((prompt, id) => {
            if (prompt.active && prompt.followTarget) {
                const display = this.promptDisplays.get(id);
                if (display) {
                    this.positionPromptContainer(display, prompt);
                }
            }
        });
    }

    public destroy(): void {
        // Clean up all displays
        this.promptDisplays.forEach(display => display.destroy());
        this.promptDisplays.clear();
        this.prompts.clear();
        super.destroy();
    }
}
