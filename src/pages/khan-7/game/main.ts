import { Boot } from "./scenes/Boot";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { TeamPlayer } from "./scenes/TeamPlayer";
import { RakhshChat } from "./scenes/RakhshChat";

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
    scene: [Boot, Preloader, TeamPlayer, RakhshChat],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
