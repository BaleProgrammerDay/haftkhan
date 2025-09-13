// Phaser-specific exports
export { PhaserInteractionHelper } from "./PhaserInteractionHelper";
export type {
    PhaserInteractionPrompt,
    PhaserKeyboardKey
} from "./PhaserInteractionHelper";

export {
    PHASER_KEYBOARD_KEYS,
    PHASER_INTERACTION_PATTERNS,
    PHASER_PRESET_PROMPTS,
    createPhaserInteractionPrompt,
    createFollowingPrompt,
    createScreenPrompt,
    createWorldPrompt
} from "./phaserKeyboardMappings";

export type { CreatePhaserPromptOptions } from "./phaserKeyboardMappings";

export { InteractionDemoScene } from "./InteractionDemoScene";
