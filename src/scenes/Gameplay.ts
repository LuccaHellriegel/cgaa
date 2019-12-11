import { createAnims } from "../graphics/animation";
import { generateTextures } from "../graphics/textures";
import { Movement } from "../game/player/input/Movement";
import { Collision } from "../game/collision/Collision";
import { Areas } from "../game/areas/Areas";
import { wallPartHalfSize } from "../globals/globalSizes";
import { PathManager } from "../game/enemies/path/PathManager";
import { Enemies } from "../game/enemies/Enemies";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/Player";
import { setupPointerEvents } from "../game/player/input/pointer";
import { InteractionModus } from "../game/player/modi/InteractionModus";
import { calculateUnifiedMap } from "../game/base/map";
import { EnemySpawnMap } from "../game/spawn/EnemySpawnMap";
import { TowerSpawnMap } from "../game/spawn/TowerSpawnMap";
import { Square } from "../game/player/Square";
import { playerStartX, playerStartY } from "../globals/globalConfig";
import { GhostTower } from "../game/player/modi/GhostTower";
import { Modi } from "../game/player/modi/Modi";

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
		let enemyArr = [];

		new Square(this, playerStartX, playerStartY, physicsGroups.player);
		let player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon);
		this.cameras.main.startFollow(player);

		let keyObjF = this.input.keyboard.addKey("F");
		let keyObjE = this.input.keyboard.addKey("E");

		let ghostTower = new GhostTower(this, 0, 0, keyObjF);
		let towerSpawnMap = new TowerSpawnMap(this, unifiedMap, enemyArr);
		let towerManager = new TowerManager(
			this,
			physicsGroups.towers,
			physicsGroups.towerSightGroup,
			physicsGroups.towerBulletGroup,
			towerSpawnMap,
			ghostTower
		);
		let interactionModus = new InteractionModus(this, ghostTower);
		let modi = new Modi(this, keyObjF, keyObjE, interactionModus, towerManager);
		setupPointerEvents(this, player, ghostTower, modi);
		this.movement = new Movement(this, player);

		let pathManager = new PathManager(unifiedMap);

		let enemySpawnMap = new EnemySpawnMap(this, unifiedMap, enemyArr);
		let enemies = new Enemies(
			this,
			areas.getAreaForBuildings(),
			enemySpawnMap,
			pathManager,
			physicsGroups.enemies,
			physicsGroups.enemyWeapons,
			physicsGroups.buildings,
			enemyArr
		);

		pathManager.calculateBuildingSpecificPaths(enemies.getBuildings());

		enemies.spawnAreaUnits();
		enemies.spawnWaveUnits();
	}

	update() {
		this.movement.update();
	}
}
