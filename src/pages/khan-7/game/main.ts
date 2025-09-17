import { Boot } from "./scenes/Boot";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { TeamPlayer } from "./scenes/TeamPlayer";
import { RakhshChat } from "./scenes/RakhshChat";
import { Barghman } from "./scenes/Barghman";
import { Pisano } from "./scenes/Pisano";
import { Bruce } from "./scenes/Bruce";
import { Parking } from "./scenes/Parking";
import { Olad } from "./scenes/Olad";
import { OtaghFekr } from "./scenes/OtaghFekr";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: document.getElementById("message-list-container")?.clientWidth || 800,
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
  scene: [
    Boot,
    Preloader,
    Olad,
    TeamPlayer,
    RakhshChat,
    Barghman,
    Pisano,
    Bruce,
    Parking,
    OtaghFekr,
  ],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
