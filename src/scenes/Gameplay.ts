import { createAnims } from "../graphics/animation/animation";
import { generateTextures } from "../graphics/texture/texture";
import { Movement } from "../game/player/input/move/Movement";
import { TowerManager } from "../game/player/towers/TowerManager";
import { Player } from "../game/player/unit/Player";
import { InteractionModus } from "../game/player/input/modi/interaction/InteractionModus";
import { Square } from "../game/player/unit/Square";
import { GhostTower } from "../game/player/input/modi/interaction/GhostTower";
import { Modi } from "../game/player/input/modi/Modi";
import { relativePositionToPoint } from "../game/base/position";
import { createAreas, constructAreaConfigs } from "../game/area/area";
import { StaticConfig } from "../game/base/types";
import { createTowerSpawnObj } from "../game/base/spawn/spawn";
import { calculatePaths } from "../game/enemies/path/path";
import { enableCollision } from "../game/collision/collision";
import { campColors } from "../game/base/globals/globalColors";
import { WASD } from "../game/player/input/move/WASD";
import { WaveController } from "../game/enemies/wave/WaveController";
import { CampsState } from "../game/enemies/camp/CampsState";
import { Mouse } from "../game/player/input/move/Mouse";
import { Enemies } from "../game/enemies/unit/Enemies";
import { Camps } from "../game/enemies/camp/Camps";
import { Rerouter } from "../game/enemies/path/Rerouter";
import { Rivalries } from "../game/enemies/camp/Rivalries";
import { Cooperation } from "../game/player/state/Cooperation";
import { Quests } from "../game/player/state/Quest";

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

	private initCGAA() {
		this.cgaa = {
			interactionElements: [],
			enemies: new Enemies(),
			pathDict: {},
			camps: {}
		};

		this.cgaa.keyObjF = this.input.keyboard.addKey("F");
		this.cgaa.ghostTower = new GhostTower(this, 0, 0, this.cgaa.keyObjF);

		this.cgaa.keyObjE = this.input.keyboard.addKey("E");
		let rivalries = new Rivalries();
		this.cgaa.rerouter = new Rerouter(this.events, rivalries);

		this.cgaa.interactionModus = new InteractionModus(
			this,
			this.cgaa.ghostTower,
			this.cgaa.keyObjE,
			new Cooperation(this, new Quests(this), this.cgaa.rerouter.rerouter, rivalries)
		);

		campColors.forEach(color => (this.cgaa.camps[color] = { dontAttackList: [] }));
	}

	private startWaves() {
		new WaveController(this, new CampsState(this.cgaa.campsObj.getCampBuildings()));
	}

	create() {
		this.initCGAA();

		let physicsGroups = enableCollision(this);

		let areaStaticConfig: StaticConfig = { scene: this, physicsGroup: physicsGroups.areas };
		let areaConfigs = constructAreaConfigs(areaStaticConfig);
		let { unifiedMap, middlePos } = createAreas(areaConfigs);

		let towerSpawnObj = createTowerSpawnObj(unifiedMap, areaConfigs, this.cgaa.enemies);
		let towerManager = new TowerManager(
			this,
			physicsGroups.towers,
			physicsGroups.towerBulletGroup,
			towerSpawnObj,
			this.cgaa.ghostTower
		);

		this.cgaa.campsObj = new Camps(this, unifiedMap, areaConfigs, physicsGroups, this.cgaa.enemies, this.cgaa.rerouter);

		calculatePaths({
			scene: this,
			unifiedMap,
			areaConfigs,
			middlePos,
			buildingInfos: this.cgaa.campsObj.getBuildingInfos()
		});

		let pos = relativePositionToPoint(middlePos.column, middlePos.row);
		new Square(this, pos.x, pos.y, physicsGroups.player);
		let modi = new Modi(this.cgaa.keyObjF, this.cgaa.interactionModus, towerManager);

		let player = Player.withChainWeapon(this, physicsGroups.player, physicsGroups.playerWeapon);
		this.cameras.main.startFollow(player);

		new Mouse(this, player, this.cgaa.ghostTower, modi);

		this.movement = new Movement(new WASD(this), player);

		this.startWaves();
	}

	update() {
		this.movement.update();
	}
}
