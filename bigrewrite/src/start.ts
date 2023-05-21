import Phaser from "phaser";
import { createChainWeaponAnims } from "./anims/chainWeaponAnim";
import { runSystems, setupPlayer } from "./ecs";
import { createCircleAnims } from "./anims/circle-anim";
import { createShooterAnims } from "./anims/createShooterAnims";
import { EnvSetup } from "./data/EnvSetup";
import { UnitSetup } from "./data/UnitSetup";
import { CircleGenerator } from "./textures/CircleGenerator";
import { RectGenerator } from "./textures/RectGenerator";
import { weaponTextures } from "./textures/chainWeaponTexture";
import { generateUnits } from "./textures/textures-units";

class Gameplay extends Phaser.Scene {
  constructor() {
    super("Gameplay");
  }

  preload() {
    // TEXTURES
    generateUnits(this);
    new CircleGenerator(
      0xff0000,
      this,
      "bullet",
      UnitSetup.normalCircleRadius / 4
    );
    RectGenerator(
      this,
      0xa9a9a9,
      "wallPart",
      EnvSetup.halfGridPartSize,
      EnvSetup.halfGridPartSize,
      EnvSetup.gridPartSize,
      EnvSetup.gridPartSize
    );
    weaponTextures(this);

    // ANIMATIONS
    createChainWeaponAnims(this.anims);
    createCircleAnims(this.anims);
    createShooterAnims(this.anims);
  }

  create() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scale.displaySize.setAspectRatio(width / height);
    this.scale.refresh();

    setupPlayer(this);
  }

  update() {
    runSystems(this);
  }
}

const devMode = false;
const debugMode = devMode || false;

function createGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.WEBGL,
    canvas: document.getElementById("game") as HTMLCanvasElement,
    // width: 1280,
    // height: 720,
    physics: {
      default: "arcade",
      arcade: {
        debug: debugMode,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Gameplay],
  };
}

new Phaser.Game(createGameConfig());
