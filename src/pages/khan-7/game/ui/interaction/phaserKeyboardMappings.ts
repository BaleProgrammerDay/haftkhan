import Phaser from "phaser";
import { PhaserKeyboardKey, PhaserInteractionPrompt } from "./PhaserInteractionHelper";

// Phaser keyboard key mappings with sprite positions
export const PHASER_KEYBOARD_KEYS: Record<string, PhaserKeyboardKey> = {
    // Function keys
    F1: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F1, 
        displayName: "F1", 
        spritePosition: { x: 0, y: 0, width: 32, height: 32 } 
    },
    F2: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F2, 
        displayName: "F2", 
        spritePosition: { x: 32, y: 0, width: 32, height: 32 } 
    },
    F3: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F3, 
        displayName: "F3", 
        spritePosition: { x: 64, y: 0, width: 32, height: 32 } 
    },
    F4: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F4, 
        displayName: "F4", 
        spritePosition: { x: 96, y: 0, width: 32, height: 32 } 
    },
    F5: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F5, 
        displayName: "F5", 
        spritePosition: { x: 128, y: 0, width: 32, height: 32 } 
    },

    // Number row
    ONE: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.ONE, 
        displayName: "1", 
        spritePosition: { x: 0, y: 32, width: 32, height: 32 } 
    },
    TWO: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.TWO, 
        displayName: "2", 
        spritePosition: { x: 32, y: 32, width: 32, height: 32 } 
    },
    THREE: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.THREE, 
        displayName: "3", 
        spritePosition: { x: 64, y: 32, width: 32, height: 32 } 
    },
    FOUR: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.FOUR, 
        displayName: "4", 
        spritePosition: { x: 96, y: 32, width: 32, height: 32 } 
    },
    FIVE: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.FIVE, 
        displayName: "5", 
        spritePosition: { x: 128, y: 32, width: 32, height: 32 } 
    },

    // QWERTY row
    Q: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.Q, 
        displayName: "Q", 
        spritePosition: { x: 0, y: 64, width: 32, height: 32 } 
    },
    W: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.W, 
        displayName: "W", 
        spritePosition: { x: 32, y: 64, width: 32, height: 32 } 
    },
    E: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.E, 
        displayName: "E", 
        spritePosition: { x: 64, y: 64, width: 32, height: 32 } 
    },
    R: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.R, 
        displayName: "R", 
        spritePosition: { x: 96, y: 64, width: 32, height: 32 } 
    },
    T: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.T, 
        displayName: "T", 
        spritePosition: { x: 128, y: 64, width: 32, height: 32 } 
    },
    Y: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.Y, 
        displayName: "Y", 
        spritePosition: { x: 160, y: 64, width: 32, height: 32 } 
    },
    U: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.U, 
        displayName: "U", 
        spritePosition: { x: 192, y: 64, width: 32, height: 32 } 
    },
    I: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.I, 
        displayName: "I", 
        spritePosition: { x: 224, y: 64, width: 32, height: 32 } 
    },
    O: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.O, 
        displayName: "O", 
        spritePosition: { x: 256, y: 64, width: 32, height: 32 } 
    },
    P: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.P, 
        displayName: "P", 
        spritePosition: { x: 288, y: 64, width: 32, height: 32 } 
    },

    // ASDF row
    A: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.A, 
        displayName: "A", 
        spritePosition: { x: 0, y: 96, width: 32, height: 32 } 
    },
    S: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.S, 
        displayName: "S", 
        spritePosition: { x: 32, y: 96, width: 32, height: 32 } 
    },
    D: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.D, 
        displayName: "D", 
        spritePosition: { x: 64, y: 96, width: 32, height: 32 } 
    },
    F: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.F, 
        displayName: "F", 
        spritePosition: { x: 96, y: 96, width: 32, height: 32 } 
    },
    G: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.G, 
        displayName: "G", 
        spritePosition: { x: 128, y: 96, width: 32, height: 32 } 
    },
    H: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.H, 
        displayName: "H", 
        spritePosition: { x: 160, y: 96, width: 32, height: 32 } 
    },
    J: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.J, 
        displayName: "J", 
        spritePosition: { x: 192, y: 96, width: 32, height: 32 } 
    },
    K: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.K, 
        displayName: "K", 
        spritePosition: { x: 224, y: 96, width: 32, height: 32 } 
    },
    L: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.L, 
        displayName: "L", 
        spritePosition: { x: 256, y: 96, width: 32, height: 32 } 
    },

    // ZXCV row
    Z: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.Z, 
        displayName: "Z", 
        spritePosition: { x: 0, y: 128, width: 32, height: 32 } 
    },
    X: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.X, 
        displayName: "X", 
        spritePosition: { x: 32, y: 128, width: 32, height: 32 } 
    },
    C: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.C, 
        displayName: "C", 
        spritePosition: { x: 64, y: 128, width: 32, height: 32 } 
    },
    V: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.V, 
        displayName: "V", 
        spritePosition: { x: 96, y: 128, width: 32, height: 32 } 
    },
    B: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.B, 
        displayName: "B", 
        spritePosition: { x: 128, y: 128, width: 32, height: 32 } 
    },
    N: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.N, 
        displayName: "N", 
        spritePosition: { x: 160, y: 128, width: 32, height: 32 } 
    },
    M: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.M, 
        displayName: "M", 
        spritePosition: { x: 192, y: 128, width: 32, height: 32 } 
    },

    // Special keys
    SPACE: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.SPACE, 
        displayName: "SPACE", 
        displayText: "SPACE", 
        spritePosition: { x: 0, y: 160, width: 96, height: 32 } 
    },
    ENTER: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.ENTER, 
        displayName: "ENTER", 
        displayText: "ENTER", 
        spritePosition: { x: 96, y: 160, width: 64, height: 32 } 
    },
    SHIFT: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.SHIFT, 
        displayName: "SHIFT", 
        displayText: "SHIFT", 
        spritePosition: { x: 0, y: 192, width: 64, height: 32 } 
    },
    CTRL: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.CTRL, 
        displayName: "CTRL", 
        displayText: "CTRL", 
        spritePosition: { x: 64, y: 192, width: 48, height: 32 } 
    },
    ALT: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.ALT, 
        displayName: "ALT", 
        displayText: "ALT", 
        spritePosition: { x: 112, y: 192, width: 48, height: 32 } 
    },

    // Arrow keys
    UP: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.UP, 
        displayName: "UP", 
        displayText: "↑", 
        spritePosition: { x: 0, y: 224, width: 32, height: 32 } 
    },
    DOWN: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.DOWN, 
        displayName: "DOWN", 
        displayText: "↓", 
        spritePosition: { x: 32, y: 224, width: 32, height: 32 } 
    },
    LEFT: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.LEFT, 
        displayName: "LEFT", 
        displayText: "←", 
        spritePosition: { x: 64, y: 224, width: 32, height: 32 } 
    },
    RIGHT: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.RIGHT, 
        displayName: "RIGHT", 
        displayText: "→", 
        spritePosition: { x: 96, y: 224, width: 32, height: 32 } 
    },

    // Function keys
    ESC: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.ESC, 
        displayName: "ESC", 
        displayText: "ESC", 
        spritePosition: { x: 128, y: 224, width: 32, height: 32 } 
    },
    TAB: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.TAB, 
        displayName: "TAB", 
        displayText: "TAB", 
        spritePosition: { x: 0, y: 256, width: 48, height: 32 } 
    },
    BACKSPACE: { 
        keyCode: Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 
        displayName: "BACKSPACE", 
        displayText: "⌫", 
        spritePosition: { x: 48, y: 256, width: 48, height: 32 } 
    },
};

// Common Phaser interaction patterns
export const PHASER_INTERACTION_PATTERNS = {
    MOVEMENT_WASD: [
        PHASER_KEYBOARD_KEYS.W,
        PHASER_KEYBOARD_KEYS.A,
        PHASER_KEYBOARD_KEYS.S,
        PHASER_KEYBOARD_KEYS.D,
    ],
    MOVEMENT_ARROWS: [
        PHASER_KEYBOARD_KEYS.UP,
        PHASER_KEYBOARD_KEYS.DOWN,
        PHASER_KEYBOARD_KEYS.LEFT,
        PHASER_KEYBOARD_KEYS.RIGHT,
    ],
    BASIC_INTERACTION: [PHASER_KEYBOARD_KEYS.E],
    JUMP: [PHASER_KEYBOARD_KEYS.SPACE],
    RUN: [PHASER_KEYBOARD_KEYS.SHIFT],
    MENU: [PHASER_KEYBOARD_KEYS.ESC],
    ATTACK: [PHASER_KEYBOARD_KEYS.F],
    USE_ITEM: [PHASER_KEYBOARD_KEYS.Q],
    INVENTORY: [PHASER_KEYBOARD_KEYS.I],
    CROUCH: [PHASER_KEYBOARD_KEYS.CTRL],
};

// Helper function to create Phaser interaction prompts easily
export interface CreatePhaserPromptOptions {
    id: string;
    text: string;
    keys: (keyof typeof PHASER_KEYBOARD_KEYS)[];
    worldPosition?: { x: number; y: number };
    screenPosition?: { x: number; y: number };
    variant?: "default" | "highlight" | "warning" | "success";
    animation?: "none" | "pulse" | "bounce" | "fade" | "float";
    followTarget?: Phaser.GameObjects.GameObject;
    followOffset?: { x: number; y: number };
    autoHideTime?: number;
    depth?: number;
    active?: boolean;
}

export function createPhaserInteractionPrompt(options: CreatePhaserPromptOptions): PhaserInteractionPrompt {
    return {
        id: options.id,
        text: options.text,
        keys: options.keys.map(keyName => PHASER_KEYBOARD_KEYS[keyName]),
        worldPosition: options.worldPosition,
        screenPosition: options.screenPosition,
        variant: options.variant || "default",
        animation: options.animation || "none",
        followTarget: options.followTarget,
        followOffset: options.followOffset,
        autoHideTime: options.autoHideTime,
        depth: options.depth,
        active: options.active !== false,
    };
}

// Preset prompts for common Phaser game interactions (Persian)
export const PHASER_PRESET_PROMPTS = {
    MOVE: createPhaserInteractionPrompt({
        id: "move",
        text: "حرکت",
        keys: ["W", "A", "S", "D"],
        animation: "pulse",
    }),
    
    INTERACT: createPhaserInteractionPrompt({
        id: "interact",
        text: "تعامل",
        keys: ["E"],
        variant: "highlight",
        animation: "bounce",
    }),
    
    JUMP: createPhaserInteractionPrompt({
        id: "jump",
        text: "پرش",
        keys: ["SPACE"],
    }),
    
    RUN: createPhaserInteractionPrompt({
        id: "run",
        text: "نگه دارید برای دویدن",
        keys: ["SHIFT"],
    }),
    
    PAUSE: createPhaserInteractionPrompt({
        id: "pause",
        text: "توقف",
        keys: ["ESC"],
        variant: "warning",
        screenPosition: { x: 100, y: 50 },
    }),
    
    PICK_UP: createPhaserInteractionPrompt({
        id: "pickup",
        text: "برداشتن",
        keys: ["F"],
        variant: "success",
        animation: "float",
    }),
    
    USE_ITEM: createPhaserInteractionPrompt({
        id: "use_item",
        text: "استفاده از وسیله",
        keys: ["Q"],
    }),
    
    OPEN_INVENTORY: createPhaserInteractionPrompt({
        id: "inventory",
        text: "کیف",
        keys: ["I"],
        screenPosition: { x: 150, y: 50 },
    }),
    
    CROUCH: createPhaserInteractionPrompt({
        id: "crouch",
        text: "خمیدن",
        keys: ["CTRL"],
    }),

    ATTACK: createPhaserInteractionPrompt({
        id: "attack",
        text: "حمله",
        keys: ["F"],
        variant: "warning",
        animation: "pulse",
    }),

    TALK: createPhaserInteractionPrompt({
        id: "talk",
        text: "صحبت کردن",
        keys: ["E"],
        variant: "highlight",
        followOffset: { x: 0, y: -60 },
        autoHideTime: 5000,
    }),

    EXAMINE: createPhaserInteractionPrompt({
        id: "examine",
        text: "بررسی",
        keys: ["E"],
        variant: "default",
        followOffset: { x: 0, y: -40 },
    }),
};

// Helper function to create prompts that follow game objects
export function createFollowingPrompt(
    basePrompt: PhaserInteractionPrompt,
    target: Phaser.GameObjects.GameObject,
    offset: { x: number; y: number } = { x: 0, y: -50 }
): PhaserInteractionPrompt {
    return {
        ...basePrompt,
        followTarget: target,
        followOffset: offset,
    };
}

// Helper function to create screen-positioned prompts
export function createScreenPrompt(
    basePrompt: PhaserInteractionPrompt,
    x: number,
    y: number
): PhaserInteractionPrompt {
    return {
        ...basePrompt,
        screenPosition: { x, y },
        worldPosition: undefined,
        followTarget: undefined,
    };
}

// Helper function to create world-positioned prompts
export function createWorldPrompt(
    basePrompt: PhaserInteractionPrompt,
    x: number,
    y: number
): PhaserInteractionPrompt {
    return {
        ...basePrompt,
        worldPosition: { x, y },
        screenPosition: undefined,
        followTarget: undefined,
    };
}
