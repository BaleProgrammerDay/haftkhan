import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { PixelArtScene } from "./scenes/PixelArtScene";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width:
        document.getElementById("message-list-container")?.clientWidth || 800,
    height:
        document.getElementById("message-list-container")?.clientHeight || 600,
    parent: "game-container",
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1500, x: 0 },
            // debug: true,
        },
    },
    input: {
        keyboard: true,
    },
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver, PixelArtScene],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
