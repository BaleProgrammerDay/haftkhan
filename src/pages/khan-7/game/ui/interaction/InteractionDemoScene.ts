import Phaser from "phaser";
import { PhaserInteractionHelper } from "./PhaserInteractionHelper";
import { 
    PHASER_PRESET_PROMPTS, 
    createPhaserInteractionPrompt,
    createFollowingPrompt,
    createScreenPrompt 
} from "./phaserKeyboardMappings";

/**
 * Example scene demonstrating how to use the PhaserInteractionHelper
 * This can be used as a reference for implementing the system in your game
 */
export class InteractionDemoScene extends Phaser.Scene {
    private interactionHelper!: PhaserInteractionHelper;
    private player!: Phaser.GameObjects.Rectangle;
    private npc!: Phaser.GameObjects.Rectangle;
    private collectible!: Phaser.GameObjects.Arc;

    constructor() {
        super({ key: 'InteractionDemo' });
    }

    preload() {
        // The interaction helper will load the keyboard sprite automatically
        this.load.image('keyboard-keys', '/assets/keyboard-keys.png');
    }

    create() {
        // Create the interaction helper
        this.interactionHelper = new PhaserInteractionHelper(this, 0, 0, true);
        
        // Set up interaction callback
        this.interactionHelper.setOnInteractionCallback((promptId: string) => {
            this.handleInteraction(promptId);
        });

        // Create demo objects
        this.createDemoObjects();
        
        // Setup initial prompts
        this.setupInitialPrompts();

        // Show movement controls
        this.showMovementControls();
    }

    private createDemoObjects() {
        // Create player (blue rectangle)
        this.player = this.add.rectangle(400, 300, 40, 40, 0x0066cc);
        
        // Create NPC (green rectangle)
        this.npc = this.add.rectangle(600, 200, 40, 40, 0x00cc66);
        
        // Create collectible (yellow circle)
        this.collectible = this.add.circle(200, 400, 20, 0xffcc00);
    }

    private setupInitialPrompts() {
        // Add persistent movement prompt (screen position)
        const movementPrompt = createScreenPrompt(
            PHASER_PRESET_PROMPTS.MOVE,
            100,
            100
        );
        this.interactionHelper.addPrompt(movementPrompt);

        // Add pause prompt (screen position)
        const pausePrompt = createScreenPrompt(
            PHASER_PRESET_PROMPTS.PAUSE,
            this.cameras.main.width - 100,
            50
        );
        this.interactionHelper.addPrompt(pausePrompt);
    }

    private showMovementControls() {
        // Show inventory prompt
        const inventoryPrompt = createScreenPrompt(
            PHASER_PRESET_PROMPTS.OPEN_INVENTORY,
            200,
            50
        );
        this.interactionHelper.addPrompt(inventoryPrompt);
    }

    private handleInteraction(promptId: string) {
        console.log(`Interaction triggered: ${promptId}`);
        
        switch (promptId) {
            case 'move':
                console.log('Player is moving!');
                break;
                
            case 'interact_npc':
                console.log('Talking to NPC...');
                this.showNPCDialog();
                break;
                
            case 'pickup':
                console.log('Picking up collectible...');
                this.collectItem();
                break;
                
            case 'pause':
                console.log('Game paused!');
                this.scene.pause();
                break;
                
            case 'inventory':
                console.log('Opening inventory...');
                this.showInventoryPrompt();
                break;
        }
    }

    private showNPCDialog() {
        // Show a temporary dialog prompt
        const dialogPrompt = createPhaserInteractionPrompt({
            id: 'continue_dialog',
            text: 'Continue',
            keys: ['SPACE'],
            variant: 'highlight',
            animation: 'fade',
            autoHideTime: 3000,
            worldPosition: { x: this.npc.x, y: this.npc.y - 80 }
        });
        
        this.interactionHelper.addPrompt(dialogPrompt);
    }

    private collectItem() {
        // Hide the collectible
        this.collectible.setVisible(false);
        
        // Remove the pickup prompt
        this.interactionHelper.removePrompt('pickup');
        
        // Show success message
        const successPrompt = createPhaserInteractionPrompt({
            id: 'item_collected',
            text: 'Item Collected!',
            keys: [],
            variant: 'success',
            animation: 'bounce',
            autoHideTime: 2000,
            worldPosition: { x: this.collectible.x, y: this.collectible.y - 50 }
        });
        
        this.interactionHelper.addPrompt(successPrompt);
    }

    private showInventoryPrompt() {
        // Create a temporary inventory opened message
        const inventoryOpenPrompt = createPhaserInteractionPrompt({
            id: 'inventory_opened',
            text: 'Inventory Opened',
            keys: ['ESC'],
            variant: 'default',
            animation: 'pulse',
            autoHideTime: 3000,
            screenPosition: { x: this.cameras.main.centerX, y: this.cameras.main.centerY }
        });
        
        this.interactionHelper.addPrompt(inventoryOpenPrompt);
    }

    update() {
        // Update the interaction helper (handles following prompts)
        this.interactionHelper.update();
        
        // Check proximity for interactions
        this.checkProximityInteractions();
    }

    private checkProximityInteractions() {
        const playerX = this.player.x;
        const playerY = this.player.y;
        
        // Check NPC proximity
        const npcDistance = Phaser.Math.Distance.Between(playerX, playerY, this.npc.x, this.npc.y);
        if (npcDistance < 80) {
            // Show interaction prompt if not already showing
            if (!this.interactionHelper['prompts'].has('interact_npc')) {
                const npcPrompt = createFollowingPrompt(
                    PHASER_PRESET_PROMPTS.TALK,
                    this.npc,
                    { x: 0, y: -60 }
                );
                npcPrompt.id = 'interact_npc';
                this.interactionHelper.addPrompt(npcPrompt);
            }
        } else {
            // Remove interaction prompt if too far
            this.interactionHelper.removePrompt('interact_npc');
        }
        
        // Check collectible proximity
        if (this.collectible.visible) {
            const collectibleDistance = Phaser.Math.Distance.Between(
                playerX, playerY, 
                this.collectible.x, this.collectible.y
            );
            
            if (collectibleDistance < 60) {
                // Show pickup prompt if not already showing
                if (!this.interactionHelper['prompts'].has('pickup')) {
                    const pickupPrompt = createFollowingPrompt(
                        PHASER_PRESET_PROMPTS.PICK_UP,
                        this.collectible,
                        { x: 0, y: -40 }
                    );
                    this.interactionHelper.addPrompt(pickupPrompt);
                }
            } else {
                // Remove pickup prompt if too far
                this.interactionHelper.removePrompt('pickup');
            }
        }
    }

    destroy() {
        // Clean up the interaction helper
        if (this.interactionHelper) {
            this.interactionHelper.destroy();
        }
    }
}
