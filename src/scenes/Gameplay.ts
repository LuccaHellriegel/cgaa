import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/Movement";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/unit/Player";
import { setupPointerEvents } from "../game/player/input/pointer";
import { InteractionModus } from "../game/player/input/modi/interaction/InteractionModus";
import { Square } from "../game/player/unit/Square";
import { GhostTower } from "../game/player/input/modi/interaction/GhostTower";
import { Modi } from "../game/player/input/modi/Modi";
import { relativePositionToPoint } from "../game/base/position";
import { createAreas, constructAreaConfigs } from "../game/area/area";
import { StaticConfig } from "../game/base/types";
import { createTowerSpawnObj } from "../game/base/spawn/spawn";
import { calculatePaths } from "../game/enemies/path/path";
import { spawnWave } from "../game/enemies/wave";
import { mainCamp } from "../game/enemies/camp/camp";
import { enableCollision } from "../game/collision/collision";
import { campColors } from "../game/base/globals/globalColors";
import { BuildingInfo } from "../game/base/interfaces";

export class Gameplay extends Phaser.Scene {
	movement: Movement;
	cgaa;

	constructor() {
		super("Gameplay");
	}

	preload() {
		generateTextures(this);
		createAnims(this.anims);
	}

	create() {
		let physicsGroups = enableCollision(this);

		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: physicsGroups.areas };
		let areaConfigs = constructAreaConfigs(areaStaticConfig);
		let { unifiedMap, middlePos } = createAreas(areaConfigs);

		let enemyDict = {};

		let keyObjF = this.input.keyboard.addKey("F");
		let ghostTower = new GhostTower(this, 0, 0, keyObjF);

		let keyObjE = this.input.keyboard.addKey("E");
		let interactionModus = new InteractionModus(this, ghostTower, keyObjE);

		this.cgaa = { activeCamps: [...campColors].reverse(), interactionElements: [], interactionModus };

		let towerSpawnObj = createTowerSpawnObj(unifiedMap, areaConfigs, enemyDict);
		let towerManager = new TowerManager(
			this,
			physicsGroups.towers,
			physicsGroups.towerBulletGroup,
			towerSpawnObj,
			ghostTower
		);

		let pathDict = {};
		let buildingInfos: BuildingInfo[] = mainCamp(this, unifiedMap, areaConfigs, enemyDict, physicsGroups, pathDict);

		let camps = buildingInfos.reduce((acc, info) => {
			let buildings = info.buildings;
			let color = info.color;
			let obj = { [color]: { buildings, dontAttackList: [] } };
			return { ...acc, ...obj };
		}, {});

		this.cgaa.camps = camps;

		console.log(camps);
		calculatePaths({ scene: this, pathDict, unifiedMap, areaConfigs, middlePos, buildingInfos });

		spawnWave(this);

		let pos = relativePositionToPoint(middlePos.column, middlePos.row);
		new Square(this, pos.x, pos.y, physicsGroups.player);
		let modi = new Modi(this, keyObjF, interactionModus, towerManager);

		let player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon);
		this.cameras.main.startFollow(player);
		setupPointerEvents(this, player, ghostTower, modi);

		this.movement = new Movement(this, player);
	}

	update() {
		this.movement.update();
	}
}
