import { Player } from "../units/Player";
import { Movement } from "../ui/input/Movement";
import { AnimationService } from "../graphic/AnimationService";
import { EnemyManager } from "../units/EnemyManager";
import { GeneratorService } from "../graphic/generators/GeneratorService";
import { EnvManager } from "../env/EnvManager";
import { PointerService } from "../ui/input/PointerService";
import { ColliderService } from "../services/ColliderService";
import { TowerManager } from "../units/towers/TowerManager";
import { TowerModus } from "../ui/input/TowerModus";
import { PathManager } from "../path/PathManager";
import { SpawnManager } from "../spawn/SpawnManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  movement: Movement;
  enemyManager: EnemyManager;
  envManager: EnvManager;
  pathManager: PathManager;
  spawnManager: SpawnManager;
  towerManager: TowerManager;
  towerModus: TowerModus;

  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    GeneratorService.generateTextures(this);
    AnimationService.createAnims(this.anims);

    new EnvManager(this);
    new PathManager(this);
    new TowerManager(this);

    new SpawnManager(this);

    new EnemyManager(this);

    new TowerModus(this);

    ColliderService.addCollisionDetection(this);

    new Movement(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.movement.update();
  }
}
