import { Scene } from "phaser";
import { Player } from "../../../components/Player";
import { Soul } from "../../../components/Soul";
import { Enemy } from "../../../components/Enemy";
import { Tower } from "../../../components/Tower";
import { CampBuilding } from "../../../components/CampBuilding";
import { GameEvents } from "../../../events/GameEvents";
import { assert } from "../../../utils/assert";

export class CollisionSystem {
  private scene: Scene;
  private player: Player | null = null;
  private souls: Soul[] = [];
  private enemies: Enemy[] = [];
  private towers: Tower[] = [];
  private camps: CampBuilding[] = [];

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.scene = scene;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for game objects being added/removed
    this.scene.events.on(GameEvents.PLAYER_READY, this.registerPlayer, this);
    this.scene.events.on("soul-created", this.registerSoul, this);
    this.scene.events.on("enemy-created", this.registerEnemy, this);
    this.scene.events.on(GameEvents.TOWER_PLACED, this.registerTower, this);
    this.scene.events.on("soul-destroyed", this.unregisterSoul, this);
    this.scene.events.on(GameEvents.ENEMY_KILLED, this.unregisterEnemy, this);
    this.scene.events.on(GameEvents.TOWER_REMOVED, this.unregisterTower, this);
  }

  private registerPlayer(player: Player): void {
    assert(player instanceof Player, "Must provide a valid Player instance");
    this.player = player;
    this.setupPlayerCollisions();
  }

  private registerSoul(soul: Soul): void {
    assert(soul instanceof Soul, "Must provide a valid Soul instance");
    this.souls.push(soul);
  }

  private registerEnemy(enemy: Enemy): void {
    assert(enemy instanceof Enemy, "Must provide a valid Enemy instance");
    this.enemies.push(enemy);
  }

  private registerTower(tower: Tower): void {
    assert(tower instanceof Tower, "Must provide a valid Tower instance");
    this.towers.push(tower);
  }

  private unregisterSoul(soul: Soul): void {
    this.souls = this.souls.filter((s) => s !== soul);
  }

  private unregisterEnemy(enemy: Enemy): void {
    this.enemies = this.enemies.filter((e) => e !== enemy);
  }

  private unregisterTower(tower: Tower): void {
    this.towers = this.towers.filter((t) => t !== tower);
  }

  private setupPlayerCollisions(): void {
    assert(
      this.player !== null,
      "Player must be registered before setting up collisions"
    );
    assert(this.scene.physics !== undefined, "Scene must have physics system", {
      sceneKey: this.scene.sys.settings.key,
    });

    const playerSprite = this.player.getSprite();

    // Player collides with souls
    this.scene.physics.add.overlap(
      playerSprite,
      this.souls.map((soul) => soul.getSprite()),
      (_, soulSprite) => {
        const soul = this.souls.find((s) => s.getSprite() === soulSprite);
        if (soul) {
          this.scene.events.emit(GameEvents.SOUL_COLLECTED, soul);
          soul.destroy();
        }
      }
    );

    // Player collides with enemies
    this.scene.physics.add.overlap(
      playerSprite,
      this.enemies.map((enemy) => enemy.getSprite()),
      (_, enemySprite) => {
        const enemy = this.enemies.find((e) => e.getSprite() === enemySprite);
        if (enemy) {
          this.scene.events.emit(GameEvents.PLAYER_DAMAGED, enemy.getDamage());
        }
      }
    );

    // Player interacts with camps
    this.scene.physics.add.overlap(
      playerSprite,
      this.camps.map((camp) => camp.getSprite()),
      (_, campSprite) => {
        const camp = this.camps.find((c) => c.getSprite() === campSprite);
        if (camp) {
          // Only emit interaction event if player presses the interaction key
          const keys = this.scene.registry.get("wasdKeys");
          if (keys && keys.E.isDown) {
            this.scene.events.emit("playerInteractWithCamp", camp);
          }
        }
      }
    );
  }

  public registerCamp(camp: CampBuilding): void {
    assert(
      camp instanceof CampBuilding,
      "Must provide a valid CampBuilding instance"
    );
    this.camps.push(camp);
    this.setupCampCollisions(camp);
  }

  private setupCampCollisions(camp: CampBuilding): void {
    assert(this.scene.physics !== undefined, "Scene must have physics system", {
      sceneKey: this.scene.sys.settings.key,
    });

    // Add collision detection between camp and enemies
    this.scene.physics.add.overlap(
      camp.getSprite(),
      this.enemies.map((enemy) => enemy.getSprite()),
      (_, enemySprite) => {
        const enemy = this.enemies.find((e) => e.getSprite() === enemySprite);
        if (enemy) {
          camp.takeDamage(enemy.getDamage());
        }
      }
    );
  }

  public update(time: number, delta: number): void {
    // Update tower-enemy collisions
    this.towers.forEach((tower) => {
      const towerRange = tower.getRange();
      this.enemies.forEach((enemy) => {
        const enemySprite = enemy.getSprite();
        const distance = Phaser.Math.Distance.Between(
          towerRange.x,
          towerRange.y,
          enemySprite.x,
          enemySprite.y
        );

        if (distance <= towerRange.radius) {
          tower.targetEnemy(enemy);
        }
      });
    });

    // Update camp states
    this.camps.forEach((camp) => {
      camp.update(time, delta);
    });
  }

  public destroy(): void {
    // Clean up event listeners
    this.scene.events.off(GameEvents.PLAYER_READY, this.registerPlayer, this);
    this.scene.events.off("soul-created", this.registerSoul, this);
    this.scene.events.off("enemy-created", this.registerEnemy, this);
    this.scene.events.off(GameEvents.TOWER_PLACED, this.registerTower, this);
    this.scene.events.off("soul-destroyed", this.unregisterSoul, this);
    this.scene.events.off(GameEvents.ENEMY_KILLED, this.unregisterEnemy, this);
    this.scene.events.off(GameEvents.TOWER_REMOVED, this.unregisterTower, this);

    // Clear arrays
    this.souls = [];
    this.enemies = [];
    this.towers = [];
    this.camps = [];
    this.player = null;
  }
}
