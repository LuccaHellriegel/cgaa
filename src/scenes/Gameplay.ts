import { createAnims } from "../graphics/animation";
import { generateTextures } from "../graphics/textures";
import { Movement } from "../game/player/input/Movement";
import { Collision } from "../game/collision/Collision";
import { Areas } from "../game/areas/Areas";
import { wallPartHalfSize } from "../globals/globalSizes";
import { PathManager } from "../game/enemies/path/PathManager";
import { SpawnManager } from "../game/enemies/spawn/SpawnManager";
import { Enemies } from "../game/enemies/Enemies";
import { TowerModus } from "../game/player/input/TowerModus";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/Player";
import { setupPointerEvents } from "../game/player/input/mouse";
import { InteractionModus } from "../game/player/input/InteractionModus";
import { calculateUnifiedMap } from "../game/base/map";

export class Gameplay extends Phaser.Scene {
	movement: Movement;

	constructor() {
		super("Gameplay");
	}

	preload() {}

	create() {
		generateTextures(this);
		createAnims(this.anims);

		let physicsGroups = new Collision(this).getPhysicGroups();

		let areas = new Areas(this, physicsGroups.areas);
		let borderWall = areas.getBorderWall();
		this.physics.world.setBounds(
			0,
			0,
			borderWall.width - 4 * wallPartHalfSize,
			borderWall.width - 4 * wallPartHalfSize
		);

		let unifiedMap = calculateUnifiedMap(areas.getAllMaps());
		let pathManager = new PathManager(unifiedMap);
		let spawnManager = new SpawnManager(this, unifiedMap);
		let towerModus = new TowerModus(this);
		let towerManager = new TowerManager(
			this,
			physicsGroups.towers,
			physicsGroups.towerSightGroup,
			physicsGroups.towerBulletGroup,
			towerModus,
			spawnManager
		);

		let interactionModus = new InteractionModus(this, towerModus);
		let enemies = new Enemies(
			this,
			areas,
			spawnManager,
			pathManager,
			physicsGroups.enemies,
			physicsGroups.enemyWeapons,
			physicsGroups.buildings
		);
		spawnManager.setEnemies(enemies);

		towerModus.setInteractionModus(interactionModus);
		enemies.addInteractionUnits();
		pathManager.calculateBuildingSpecificPaths(enemies.getBuildings());
		enemies.spawnAreaUnits();
		enemies.spawnWaveUnits();

		let player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon);
		this.cameras.main.startFollow(player);
		setupPointerEvents(this, player, towerModus, towerManager, interactionModus);
		this.movement = new Movement(this, player);
	}

	update() {
		this.movement.update();
	}
}
