import { createAnims } from "../graphics/animation";
import { generateTextures } from "../graphics/textures";
import { Movement } from "../game/player/input/Movement";
import { Collision } from "../game/collision/Collision";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/Player";
import { setupPointerEvents } from "../game/base/pointer";
import { InteractionModus } from "../game/player/modi/InteractionModus";
import { Square } from "../game/player/Square";
import { GhostTower } from "../game/player/modi/GhostTower";
import { Modi } from "../game/player/modi/Modi";
import { relativePosToRealPos } from "../game/base/position";
import { createAreas, constructAreaConfigs } from "../game/area/area";
import { StaticConfig } from "../game/base/types";
import { createTowerSpawnObj } from "../game/base/spawn/spawn";
import { constructCampConfigs } from "../game/enemies/config";
import { CampConfig, createCamps } from "../game/enemies/camp";
import { calculatePaths } from "../game/enemies/path/path";
import { spawnWave } from "../game/enemies/wave";

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

		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: physicsGroups.areas };
		let areaConfigs = constructAreaConfigs(areaStaticConfig);
		let { unifiedMap, middlePos } = createAreas(areaConfigs);

		let enemyArr = [];

		let keyObjF = this.input.keyboard.addKey("F");
		let keyObjE = this.input.keyboard.addKey("E");

		let ghostTower = new GhostTower(this, 0, 0, keyObjF);
		let towerSpawnObj = createTowerSpawnObj(unifiedMap, areaConfigs, enemyArr);
		let towerManager = new TowerManager(
			this,
			physicsGroups.towers,
			physicsGroups.towerBulletGroup,
			towerSpawnObj,
			ghostTower
		);
		let interactionModus = new InteractionModus(this, ghostTower);

		let pathDict = {};
		let campConfigs: CampConfig[] = constructCampConfigs(
			this,
			unifiedMap,
			areaConfigs,
			enemyArr,
			physicsGroups,
			pathDict
		);
		let buildingPositions = createCamps(campConfigs);

		calculatePaths({ scene: this, pathDict, unifiedMap, areaConfigs, middlePos, buildingPositions });

		spawnWave(this, 0);

		let pos = relativePosToRealPos(middlePos.column, middlePos.row);
		new Square(this, pos.x, pos.y, physicsGroups.player);
		let modi = new Modi(this, keyObjF, keyObjE, interactionModus, towerManager);

		let player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon);
		this.cameras.main.startFollow(player);
		setupPointerEvents(this, player, ghostTower, modi);

		this.movement = new Movement(this, player);
	}

	update() {
		this.movement.update();
	}
}
