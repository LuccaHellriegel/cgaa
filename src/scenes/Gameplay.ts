import { Player } from "../units/Player";
import { MovementManager } from "../input/MovementManager";
import { AnimationService } from "../graphic/AnimationService";
import { UnitManager } from "../units/UnitManager";
import { GeneratorService } from "../graphic/generators/GeneratorService";
import { AreaManager } from "../env/AreaManager";
import { PointerService } from "../input/PointerService";
import { ColliderService } from "../services/ColliderService";
import { TowerManager } from "../units/towers/TowerManager";
import { TowerModusManager } from "../input/TowerModusManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  playerMovement: MovementManager;
  unitManager: UnitManager;
  areaManager: AreaManager;
  towerManager: TowerManager;
  towerModusManager: TowerModusManager;

  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new AreaManager(this);
    new UnitManager(this);

    new TowerManager(this);
    new TowerModusManager(this);

    ColliderService.addCollisionDetection(this);

    new MovementManager(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.playerMovement.update();
  }
}
