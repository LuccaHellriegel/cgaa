import Phaser from "phaser";
import { runSystems } from "./data";
import { createChainWeaponAnims } from "./anims/chainWeaponAnim";

class Gameplay extends Phaser.Scene {
  constructor() {
    super("Gameplay");
  }

  preload() {
    Textures(this);
    createChainWeaponAnims(this.anims);
    createCircleAnims(this.anims);
    createShooterAnims(this.anims);
  }

  update() {
    runSystems(this);
  }
}

const devMode = false;
const debugMode = devMode || false;

function createGameConfig() {
  return {
    type: Phaser.WEBGL,
    canvas: document.getElementById("game") as HTMLCanvasElement,
    width: 1280,
    height: 720,
    physics: {
      default: "arcade",
      arcade: {
        debug: debugMode,
      },
    },
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Gameplay],
  };
}

new Phaser.Game(createGameConfig());
