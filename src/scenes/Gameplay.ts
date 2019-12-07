import { Player } from "../player/Player";
import { Movement } from "../player/input/Movement";
import { AnimationService } from "../graphics/AnimationService";
import { Enemies } from "../enemies/Enemies";
import { GeneratorService } from "../graphics/generators/GeneratorService";
import { World } from "../world/World";
import { PointerService } from "../player/input/PointerService";
import { Collision } from "../collision/Collision";
import { TowerManager } from "../player/towers/TowerManager";
import { TowerModus } from "../player/input/TowerModus";
import { PathManager } from "../enemies/path/PathManager";
import { SpawnManager } from "../enemies/spawn/SpawnManager";

export class Gameplay extends Phaser.Scene {
  player: Player;
  movement: Movement;
  enemies: Enemies;
  world: World;
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

    new World({ scene: this, type: "world", physicGroupType: "staticGroup" });
    new PathManager({ scene: this, type: "pathManager" });
    new TowerManager({ scene: this, type: "towerManager", physicGroupType: "staticGroup" });
    new SpawnManager({ scene: this, type: "spawnManager" });
    new Enemies({ scene: this, type: "enemies" });

    new TowerModus(this);
    new Collision(this);
    new Movement(this);
    PointerService.setupPointerEvents(this);
  }

  update() {
    this.movement.update();
  }
}
